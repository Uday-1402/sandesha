import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.json({ message: "Email is required.", status: false });

    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ message: "User not found.", status: false });

    return res.json({ message: "User found", status: true, user });
  } catch (error) {
    next(error);
  }
};

export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, about, image: profilePicture } = req.body;
    if (!email || !name || !profilePicture)
      return res.send("Email,name and image are required");

    const prisma = getPrismaInstance();
    const user = await prisma.user.create({
      data: { email, name, about, profilePicture },
    });

    return res.json({ message: "success", status: true, user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    });

    const usersGroups = {};
    users.forEach((user) => {
      const initialLetter = user.name[0].toUpperCase();
      if (!usersGroups[initialLetter]) usersGroups[initialLetter] = [];
      usersGroups[initialLetter].push(user);
    });

    return res.status(200).send({ usersGroups });
  } catch (error) {
    next(error);
  }
};

export const test = (req, res, next) => {
  return res.json({ success: true });
};
