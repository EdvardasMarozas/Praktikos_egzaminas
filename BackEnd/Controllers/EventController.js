const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs").promises;

const validateText = (txt, default_txt = "") => {
  if (txt == undefined) {
    return default_txt;
  } else {
    return htmlspecialchars(txt.trim());
  }
};

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
    let photo = "nophoto.png";

    if (!name || !category || !date || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (req.file) {
      const ext = {
        "image/webp": ".webp",
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/avif": ".avif",
      };
      const fileExtension = ext[req.file.mimetype];
      if (fileExtension) {
        let fileName = req.file.filename.slice(0, 6) + "_" + fileExtension;
        await fs.rename(req.file.path, "public/images/" + fileName);
        photo = fileName;
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
    }

    try {
      const createCategory = await prisma.categories.create({
        data: { name: category },
      });

      // console.log(date);
      // // console.log(new Date('2017-05-08T15:16:00:000'));
      // console.log(new Date(date).getTime());
      const event = await prisma.events.create({
        data: {
          name,
          date: new Date(date),
          location,
          photo,
          confirmed: false,
          rating: 0,
          category: { connect: { id: createCategory.id } },
          Users: { connect: { id: Number(usersId) } },
        },
      });

      res.json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res
        .status(500)
        .json({ error: error.message, message: "kas cia vykstsa" });
    }
  },
  updateEvent: async (req, res) => {
    const { id } = req.params;
    const { name, category, categoryID, date, location } = req.body;
    let photo = "nophoto.png";

    const oldPhoto = await prisma.events.findUnique({
      where: { id: parseInt(id) },
      select: { photo: true },
    });
    console.log(oldPhoto);

    if (!name || !category || !date || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (req.file) {
      if (oldPhoto.photo != "") {
        fs.unlink("public/images/" + oldPhoto.photo, (err) => {
          if (err) console.log(err);
          else {
            console.log("\nDeleted file:" + oldPhoto.photo);
          }
        });
      }
      const ext = {
        "image/webp": ".webp",
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/avif": ".avif",
      };
      const fileExtension = ext[req.file.mimetype];
      if (fileExtension) {
        let fileName = req.file.filename.slice(0, 6) + "_" + fileExtension;
        await fs.rename(req.file.path, "public/images/" + fileName);
        photo = fileName;
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
    }

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

    const oldPhoto = await prisma.events.findUnique({
      where: { id: parseInt(id) },
      select: { photo: true },
    });
    console.log(oldPhoto);

    if (oldPhoto.photo != "") {
      fs.unlink("public/images/" + oldPhoto.photo, (err) => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file:" + oldPhoto.photo);
        }
      });
    }
    await prisma.events.delete({ where: { id: parseInt(id) } });
    res.sendStatus(204);
  },
};
