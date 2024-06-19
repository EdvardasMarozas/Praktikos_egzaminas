const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "mysecretkey";

module.exports = {
  getAllUsers: async (req, res) => {
    const users = await prisma.users.findMany();
    res.json(users);
  },
  getUserById: async (req, res) => {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(user);
  },
  getMyRole: async (req, res) => {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
    });
    res.json(user);
  },
  createUser: async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
    res.json(user);
  },
  updateRole: async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { role },
    });
    res.json(user);
  },
  updatePassword: async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword },
    });
    res.json(user);
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    await prisma.users.delete({ where: { id: parseInt(id) } });
    res.sendStatus(204);
  },
  handleblockUser: async (req, res) => {
    const { id } = req.params;
    const { blocked } = req.body;
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { blocked },
    });
    res.json(user);
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.users.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "3h",
    });
    res.json({ token, role: user.role });
  },
  logout: (req, res) => {
    res.sendStatus(204);
  },
};
