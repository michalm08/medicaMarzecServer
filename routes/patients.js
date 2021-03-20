const express = require("express");
const { body, validationResult } = require("express-validator");
const Patient = require("../models/Patient.js");
const User = require("../models/User.js");
const router = express.Router();
const auth = require("../middleware/auth");
const specjalAuth = require("../middleware/specjalAuth.js");

// @route Post api/patients
// @desc Register new patient
// @access Public
router.post(
  "/",
  // body("name").isLength({ min: 3 }).withMessage("minimum 3 litery"),
  [
    body("name").notEmpty().withMessage("Imie jest wymagane"),
    body("lastname").notEmpty().withMessage("Nazwisko jest wymagane"),
    body("email").isEmail().withMessage("Wpisz poprawny emial"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Hało musi zawierać minimum 6 znaków"),
    body("birth").notEmpty().withMessage("Data urodzenia jest wymagana"),
    body("city").notEmpty().withMessage("Miasto jest wymagane"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //------------------------------- user section 1/2 -------------------------------
      //wyjmuje dane
      const { name, lastname, email, password, type } = req.body;

      //patrze czy istnieje taki user
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      }

      //------------------------------- pacient section 1/1 -------------------------------
      //tworze patient
      const { birth, city } = req.body;
      const patientContent = {};
      patientContent.birth = birth;
      patientContent.city = city;
      // patientContent.user = userId;

      let patient = new Patient(patientContent);
      await patient.save();
      // biore id pacienta
      const patientId = patient.id;

      //------------------------------- user section 2/2 -------------------------------

      //tworze content user
      const userContent = {};
      userContent.name = name;
      userContent.lastname = lastname;
      userContent.email = email;
      userContent.password = password;
      userContent.type = type;
      userContent.patient = patientId;
      

      //zapisuje user do bazy
      user = new User(userContent);
      await user.save();

      //biore id usera
      const userId = user.id;

      //wypisze pacienta
      const realPatient = await User.findById(userId).populate("patient");

      res.send(realPatient);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

//test add patient
// @route GET api/patients/addPatient
// @desc add patient to user
// @access Private
router.get("/addPatient", auth, async (req, res) => {
  const all = await Patient.find();
  res.json(all);
});

// @route GET api/patients/all
// @desc Show all patients
// @access special Private
router.get("/all", specjalAuth, async (req, res) => {
  const all = await User.find({ type: "patient" });
  res.json(all);
});

// @route GET api/patients/update
// @desc Update patient
// @access Private
router.post("/update", auth, async (req, res) => {
  const userId = req.user.id;
  let user = await User.findById(userId);
  const patientId = user.patient;

  let userData = {};
  req.body.name && (userData.name = req.body.name);
  req.body.lastname && (userData.lastname = req.body.lastname);
  req.body.password && (userData.password = req.body.password);
  await User.findByIdAndUpdate(userId, userData);

  const patientData = {};
  req.body.birth && (patientData.birth = req.body.birth);
  req.body.city && (patientData.city = req.body.city);
  await Patient.findByIdAndUpdate(patientId, patientData);

  user = await User.findById(userId).populate("patient");
  res.json(user);
});

// @route Get api/patients/deleteme
// @desc Usun moj profil
// @access Private
router.delete("/deleteme", auth, async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const patientID = user.patient;
  await Patient.findByIdAndRemove(patientID);
  await User.findByIdAndRemove(userId);
  //dodac usuwanie z bazy patient tez

  res.json("Deleted");
});

module.exports = router;
