const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getAllCategories: async (req, res) => {
    const categories = await prisma.categories.findMany();
    res.json(categories);
  },
  getCategoryById: async (req, res) => {
    const { id } = req.params;
    const category = await prisma.categories.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(category);
  },
  createCategory: async (req, res) => {
    const { name } = req.body;
    const category = await prisma.categories.create({
      data: {
        name,
      },
    });
    res.json(category);
  },
  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await prisma.categories.update({
      where: { id: parseInt(id) },
      data: {
        name,
      },
    });
    res.json(category);
  },
  deleteCategory: async (req, res) => {
    const { id } = req.params;
    await prisma.categories.delete({ where: { id: parseInt(id) } });
    res.sendStatus(204);
  },
};
