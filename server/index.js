import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";
import translateRoute from "./routes/AWSTranslateRoute.js";
import { Server } from "socket.io";
import { translate } from "./controllers/AWSTranslateController.js";
import getPrismaInstance from "./utils/PrismaClient.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings"));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/translate", translateRoute);

const PORT = process.env.PORT || 3005;
const server = app.listen(PORT, () => {
  console.log(
    `Server started on port: ${process.env.PORT ? process.env.PORT : 3005}`
  );
});

const io = new Server(server, {
  cors: {
    origin: "https://sandesh-chat.vercel.app",
    // origin: "http://localhost:3000",
  },
});

global.onlineUsers = new Map(); // userId: socketId

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  });

  socket.on("send-msg", async (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    const prisma = getPrismaInstance();
    const targetUser = await prisma.User.findUnique({ where: { id: data.to } });

    // console.log(targetUser);

    if (targetUser.language !== "null")
      data.message.message = await translate({
        // targetLang: data.language,
        targetLang: targetUser.language,
        text: data.message.message,
      });

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", {
        from: data.from,
        message: data.message,
      });
    }
  });

  socket.on("signout", (userId) => {
    onlineUsers.delete(userId);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  });
});
