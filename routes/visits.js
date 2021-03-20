const express = require("express");
const router = express.Router();
const Visit = require("../models/Visit.js");
const auth = require("../middleware/auth");
const specjalAuth = require("../middleware/specjalAuth.js");
const moment = require("moment");

// @route Post api/visits
// @desc Add visit
// @access Private
router.post("/", auth, async (req, res) => {
  try {
    const { type, myDoctorId, day, hour } = req.body;
    visitFields = {};
    visitFields.type = type;
    visitFields.myDoctorId = myDoctorId;
    visitFields.visitDate = moment().format(`YYYY-${day} ${hour}`);
    visitFields.patient = req.user.id;

    const visit = new Visit(visitFields);
    await visit.save();
    res.send(visit);
  } catch (error) {
    res.send(error.message);
  }
});

// @route GET api/visits
// @desc Show all visits test
// @access Public
router.get("/", async (req, res) => {
  try {
    const visits = await Visit.find().populate("patient");
    // const visits = await Visit.find();
    res.json(visits);
  } catch (error) {
    res.json(error.message);
  }
});

// @route GET api/visits/mine
// @desc Show my visits (today) doctor
// @access Specjal Private
router.get("/mine", specjalAuth, async (req, res) => {
  try {
    const visits = await Visit.find({
      myDoctorId: req.user.id,
      visitDate: "28.02.2021--17:00",
    });
    res.json(visits);
  } catch (error) {
    res.json(error.message);
  }
});

// @route GET api/visits/me
// @desc wszystkie wizyty zwyklego typa 
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const visits = await Visit.find({ patient: req.user.id });
    res.json(visits);
  } catch (error) {
    res.json(error.message);
  }
});


// @route GET api/visits/me/future
// @desc PRZESZLE wszystkie wizyty moje
// @access Private
router.get("/me/future", auth, async (req, res) => {
  try {
    const visits = await Visit.find({
      patient: req.user.id,
      visitDate: {
        $gte: moment().format(`YYYY-MM-DD hh:mm:ss`),
      },
    });
    res.json(visits);
  } catch (error) {
    res.json(error.message);
  }
});

// @route GET api/visits/me/past
// @desc PRZESZLE wszystkie wizyty moje
// @access Private
router.get("/me/past", auth, async (req, res) => {
  try {
    const visits = await Visit.find({
      patient: req.user.id,
      visitDate: {
        $lte: moment().format(`YYYY-MM-DD hh:mm:ss`),
      },
    });
    res.json(visits);
  } catch (error) {
    res.json(error.message);
  }
});

// @route GET api/visits/:id
// @desc Show visits of somebody (id osoby szukanej)
// @access Private Admin
router.get("/:id", specjalAuth, async (req, res) => {
  try {
    const visits = await Visit.find({ patient: req.params.id });
    res.json(visits);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
