const express = require("express");
const User = require("../models/User.js");
const Doctor = require("../models/Doctor.js");
const Patient = require("../models/Patient.js");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const specjalAuth = require("../middleware/specjalAuth.js");

// @route get api/users/login
// @desc in login everyone
// @access Public
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("no nie ma takiego emaila");
    }
    if (user.password !== password) {
      return res.status(401).send("no jest taki email ale zle haslo");
    }

    //create new token
    const payload = {
      id: user.id,
      type: user.type,
    };
    const token = jwt.sign(payload, process.env.jwtSecret, {
      expiresIn: 360000,
    });
    res.json({ token });
  } catch (error) {
    res.send(error.message);
  }
});

// @route post api/users/me
// @desc Wyswietl swoj profil
// @access Private
router.get("/me", auth, async (req, res) => {
  // const me = await User.findById(req.user.id).select("-password");

  const me = await User.findById(req.user.id)
    .select("-password")
    .populate("patient")
    .populate("doctor");

  // if (me.type === "doctor") {
  // } else {
  // }
  res.json(me);
});

// @route Get api/users/:id
// @desc Wyswietl czyjs profil
// @access Special Private
router.get("/:id", specjalAuth, async (req, res) => {
  const user = await User.findById(req.params.id).populate("patient");
  res.json(user);
});

// @route Get api/users/delete/doctor/:id
// @desc Usun profil doktora
// @access Special Private
router.delete("/delete/doctor/:id", specjalAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  const doctorID = user.doctor;
  await Doctor.findByIdAndRemove(doctorID);
  await User.findByIdAndRemove(req.params.id);
  res.json('Deleted');
});

// @route Get api/users/delete/patient/:id
// @desc Usun profil pacjenta
// @access Special Private
router.delete("/delete/patient/:id", specjalAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  const patientID = user.doctor;
  await Patient.findByIdAndRemove(patientID);
  await User.findByIdAndRemove(req.params.id);
  res.json('Deleted');
});

module.exports = router;
