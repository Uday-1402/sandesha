import { on } from "events";
import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";
import { translate } from "./AWSTranslateController.js";
import cron from "node-cron";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { message, from, to } = req.body;
    const isReceiverOnline = onlineUsers.get(to);
    if (message && from && to) {
      const newMessage = await prisma.message.create({
        data: {
          message,
          sender: { connect: { id: parseInt(from) } },
          receiver: { connect: { id: parseInt(to) } },
          messageStatus: isReceiverOnline ? "delivered" : "sent",
        },
        // select: { sender: true, receiver: true },
      });
      return res.status(201).send({ message: newMessage });
    }
    return res.status(400).send("Invalid message, sender or receiver data");
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  const { from, to, userLanguage, skipTimes = 0 } = req.params;
  try {
    const prisma = getPrismaInstance();
    const totalMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(from), receiverId: parseInt(to) },
          { senderId: parseInt(to), receiverId: parseInt(from) },
        ],
      },
    });

    const messages = await prisma.message.findMany({
      where: {
      OR: [
          { senderId: parseInt(from), receiverId: parseInt(to) },
          { senderId: parseInt(to), receiverId: parseInt(from) },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      // skip: skipTimes * 5,
    });
    messages.reverse();

    const unreadMessagesIDs = [];
    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "read" &&
        message.senderId === parseInt(to)
      ) {
        messages[index].messageStatus = "read";
        unreadMessagesIDs.push(message.id);
      }
    });

    await prisma.message.updateMany({
      where: { id: { in: unreadMessagesIDs } },
      data: { messageStatus: "read" },
    });

    for (const message of messages) {
      try {
        if(message.senderId!== +from && userLanguage != "null"){  
          const data = { targetLang: userLanguage, text: message.message };
          message.message = await translate(data);
        }
      } catch (error) {
        console.log("error in translation: ", error);
      }
    }

    return res.status(200).json({ messages, totalMessages });
  } catch (error) {
    next(error);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = `uploads/images/${date}-${req.file.originalname}`;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;

      if (from && to) {
        const message = await prisma.message.create({
          data: {
            message: fileName,
            type: "image",
            sender: { connect: { id: parseInt(from) } },
            receiver: { connect: { id: parseInt(to) } },
          },
        });
        res.status(201).json({ message });
      }
      return res.status(400).send("Invalid sender or receiver data");
    }
    return res.status(400).send("No image uploaded");
  } catch (error) {
    next(error);
  }
};

export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = `uploads/recordings/${date}-${req.file.originalname}`;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;

      if (from && to) {
        const message = await prisma.message.create({
          data: {
            message: fileName,
            type: "audio",
            sender: { connect: { id: parseInt(from) } },
            receiver: { connect: { id: parseInt(to) } },
          },
        });
        res.status(201).json({ message });
      }
      return res.status(400).send("Invalid sender or receiver data");
    }
    return res.status(400).send("No Audio uploaded");
  } catch (error) {
    next(error);
  }
};

export const getInitialContactsWithMessages = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.from);
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessages: {
          include: { receiver: true, sender: true },
          orderBy: { createdAt: "desc" },
        },
        receivedMessages: {
          include: { receiver: true, sender: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const messages = [...user.sentMessages, ...user.receivedMessages];
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const contacts = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const calculatedId = isSender ? msg.receiverId : msg.senderId; // msg reciever id
      if (msg.messageStatus === "sent" && onlineUsers.get(calculatedId)) {
        messageStatusChange.push(msg.id);
      }
      const {
        id,
        type,
        message,
        messageStatus,
        createdAt,
        senderId,
        receiverId,
      } = msg;
      if (!contacts.get(calculatedId)) {
        let contact = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
        };
        if (isSender) {
          contact = {
            ...contact,
            ...msg.receiver,
            totalUnreadMessages: 0,
          };
        } else {
          contact = {
            ...contact,
            ...msg.sender,
            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
          };
        }
        contacts.set(calculatedId, { ...contact });
      } else if (messageStatus !== "read" && !isSender) {
        const contact = contacts.get(calculatedId);
        contacts.set(calculatedId, {
          ...contact,
          totalUnreadMessages: contact.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length) {
      await prisma.message.updateMany({
        where: { id: { in: messageStatusChange } },
        data: { messageStatus: "delivered" },
      });
    }

    return res.status(200).json({
      contacts: Array.from(contacts.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  } catch (error) {
    next(error);
  }
};

export const scheduleMessage = async (req, res, next) => {
  const { scheduledTime } = req.body;
  try {
    const task = cron.schedule(
      scheduledTime,
      async function () {
        try {
          const prisma = getPrismaInstance();
          const { message, from, to } = req.body;
          const isReceiverOnline = onlineUsers.get(to);
          if (message && from && to) {
            const newMessage = await prisma.message.create({
              data: {
                message,
                sender: { connect: { id: parseInt(from) } },
                receiver: { connect: { id: parseInt(to) } },
                messageStatus: isReceiverOnline ? "delivered" : "sent",
              },
              // select: { sender: true, receiver: true },
            });
            return res.status(201).send({ message: newMessage });
          }
          return res
            .status(400)
            .send("Invalid message, sender or receiver data");
        } catch (error) {
          next(error);
        }
      },
      {
        scheduled: true,
      }
    );
    task.start();
  } catch (error) {
    next(error);
  }
};
