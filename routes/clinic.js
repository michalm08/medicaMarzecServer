const express = require("express");
const router = express.Router();
const OpenHours = require("../models/OpenHours");
const News = require("../models/News");
const Service = require("../models/Service");
const specjalAuth = require("../middleware/specjalAuth.js");
const moment = require("moment");
// const moment = require("moment");

//-----------------Open Hours---------------------------

// @route POST api/clinic/openhours
// @desc Tworzy godziny otwarcia
// @access Special private
router.post("/openhours", specjalAuth, async (req, res) => {
  let week = {
    monday: { start: "08:00", end: "16:00" },
    tuesday: { start: "08:00", end: "16:00" },
    wednesday: { start: "08:00", end: "16:00" },
    thursday: { start: "08:00", end: "16:00" },
    friday: { start: "08:00", end: "16:00" },
    saturday: { start: "08:00", end: "16:00" },
    sunday: { start: "08:00", end: "16:00" },
  };

  try {
    const openHours = new OpenHours(week);
    await openHours.save();
  } catch (err) {
    res.send(err.message);
  }

  res.json("add all week");
});

// @route PUT api/clinic/openhours
// @desc Updatuje godziny otwarcia
// @access Special private
router.put("/openhours", specjalAuth, async (req, res) => {
  // const id = "6051c3bc9d5d205e7eeba9bd";

  try {
    // await OpenHours.findByIdAndUpdate(id, req.body);
    await OpenHours.findOneAndUpdate(req.body);
    res.json("zaktualizowano");
  } catch (err) {
    res.send(err.message);
  }
});
// @route GET api/clinic/openhours
// @desc pokazuje wszystkie godziny otwarcia
// @access Public
router.get("/openhours", async (req, res) => {
  try {
    const days = await OpenHours.find();
    res.send(days);
  } catch (err) {
    res.send(err.message);
  }
});

//-----------------NEWS---------------------------
// @route POST api/clinic/news
// @desc Dodaje newsa
// @access Special private
router.post("/news", specjalAuth, async (req, res) => {
  let oneNews = {
    topic: req.body.topic,
    text: req.body.value,
    date: moment().format("DD.MM.YYYY"),
    // date: moment().format("MMMM Do YYYY, h:mm:ss a"),
  };
  try {
    const news = new News(oneNews);
    await news.save();
    res.send("posted");
  } catch (err) {
    res.send(err.message);
  }
});

// @route PUT api/clinic/news
// @desc edytuje newsa
// @access Special private
router.put("/news", specjalAuth, async (req, res) => {
  let id = "60511b58facd8b55484d6737";
  let oneNews = {
    topic: req.body.topic,
    text: req.body.text,
    date: req.body.date,
  };
  try {
    await News.findByIdAndUpdate(id, oneNews);
    res.send("success");
  } catch (err) {
    res.send(err.message);
  }
});

// @route GET api/clinic/news
// @desc pokazuje wszystkie newsy
// @access PUBLIC
router.get("/news", async (req, res) => {
  try {
    const news = await News.find();
    res.send(news);
  } catch (err) {
    res.json(err.message);
  }
});

// @route DELETE api/clinic/news/:id
// @desc usuwa newsa
// @access Special private
router.delete("/news/:id", specjalAuth, async (req, res) => {
  id = req.params.id;
  try {
    await News.findByIdAndRemove(id);
    res.send("deleted");
  } catch (err) {
    res.json(err.message);
  }
});

//-----------------SERVICES---------------------------

// @route POST api/clinic/services
// @desc Dodaje usluge
// @access Special private
router.post("/services", specjalAuth, async (req, res) => {
  let oneService = {
    text: req.body.text,
    price: req.body.price,
  };
  try {
    let service = new Service(oneService);
    await service.save();
    res.json("dodano usluge");
  } catch (err) {
    res.json(err.message);
  }
});

// @route PUT api/clinic/services
// @desc edytuje usluge
// @access Special private
router.put("/services", specjalAuth, async (req, res) => {
  try {
    req.body.forEach(async (elem) => {
      const id = elem._id;
      let oneService = {
        text: elem.text,
        price: elem.price,
      };

      await Service.findByIdAndUpdate(id, oneService);
    });
    res.json("updatowano");
  } catch (err) {
    res.json(err);
  }
});

// @route GET api/clinic/services
// @desc pokazuje wszystkie USLUGI
// @access Public
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.json(err.message);
  }
});

// @route DELETE api/clinic/services/:id
// @desc usuwa usluge
// @access Special private
router.delete("/services/:id", specjalAuth, async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  try {
    await Service.findByIdAndRemove(id);
    res.json("usunieto usluge");
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
