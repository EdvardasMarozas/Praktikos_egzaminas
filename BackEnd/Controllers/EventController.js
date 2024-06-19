const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

module.exports = {
  getAllEvents: async (req, res) => {
    const events = await prisma.events.findMany({
      where: {},
      include: {
        category: true,
      },
    });
    res.json(events);
  },
  getEventById: async (req, res) => {
    const { id } = req.params;
    const event = await prisma.events.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
      },
    });
    res.json(event);
  },
  getAllUserEvents: async (req, res) => {
    const { id } = req.params;
    const events = await prisma.events.findMany({
      where: { usersId: parseInt(id) },
      include: {
        category: true,
      },
    });
    res.json(events);
  },
  createEvent: async (req, res) => {
    const { name, category, date, location, usersId } = req.body;
    let photo = "default.jpg";
    if (req.file) {
      const ext = {
        "image/webp": ".webp",
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/avif": ".avif",
      };
      let file_name =
        req.file.filename.slice(0, 6) + "_" + petID + ext[req.file.mimetype];
      await fs.rename(req.file.path, "public/images/" + file_name);
      await _pets.updateImage(req.db, petID, file_name);
      photo = file_name;
    }

    const createCategory = await prisma.categories.create({
      data: {
        name: category,
      },
    });

    const event = await prisma.events.create({
      data: {
        name,
        date: new Date(date),
        location,
        photo,
        confirmed: false,
        rating: 0,
        category: {
          connect: { id: createCategory.id },
        },
        Users: {
          connect: { id: usersId },
        },
      },
    });
    res.json(event);
  },
  updateEvent: async (req, res) => {
    const { id } = req.params;
    const { name, category, categoryID, date, location, photo } = req.body;

    const updatedCategory = await prisma.categories.update({
      where: { id: parseInt(categoryID) },
      data: {
        name: category,
      },
    });
    const event = await prisma.events.update({
      where: { id: parseInt(id) },
      data: {
        name,
        // category,
        date: new Date(date),
        location,
        photo,
        rating: 0,
        category: {
          connect: { id: updatedCategory.id },
        },
      },
    });
    res.json(event);
  },
  deleteEvent: async (req, res) => {
    const { id } = req.params;
    await prisma.events.delete({ where: { id: parseInt(id) } });
    res.sendStatus(204);
  },
};
