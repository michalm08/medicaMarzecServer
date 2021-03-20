const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor.js");
const User = require("../models/User.js");

// @route Post api/doctors
// @desc Register new doctor
// @access Public
router.post("/", async (req, res) => {
  try {
    //------------------------------- user section 1/2 -------------------------------
    //wyjmuje dane
    const { name, lastname, email, password, type, special, note, img } = req.body;

    //patrze czy istnieje taki user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exist" }] });
    }

    //------------------------------- doctor section 1/1 -------------------------------
    // //tworze doctor

    const doctorContent = {};
    doctorContent.special = special;
    doctorContent.note = note;
    doctorContent.img = img;

    let doctor = new Doctor(doctorContent);
    await doctor.save();
    // // biore id pacienta
    const doctorId = doctor.id;

    //------------------------------- user section 2/2 -------------------------------

    //tworze content user
    const userContent = {};
    userContent.name = name;
    userContent.lastname = lastname;
    userContent.email = email;
    userContent.password = password;
    userContent.type = type;
    userContent.doctor = doctorId;

    //zapisuje user do bazy
    user = new User(userContent);
    await user.save();

    //biore id usera
    const userId = user.id;
    //wypisze doctora
    // const realPatient = await User.findById(userId).populate("patient");
    const realDoctor = await User.findById(userId).populate("doctor");
    res.send(realDoctor);
    //---------------stare---------------------

    // //zapisuje user do bazy
    // user = new User(userContent);
    // await user.save();

    // // imie nazwisko email haslo typ
    // const { email, password, type } = req.body;
    // const userContent = {};
    // userContent.email = email;
    // userContent.password = password;
    // userContent.type = type;

    // let user = new User(userContent);
    // await user.save();
    // //specjalizacje, opis fotka
    // const { name, specjal } = req.body;
    // const doctorContent = {};
    // doctorContent.name = name;
    // doctorContent.specjal = specjal;
    // let doctor = new Doctor(doctorContent);
    // await doctor.save();

    // res.send(req.body);
    //---------------stare koniec----------------
  } catch (err) {
    // res.status(500).send("Server error");
    res.status(500).send(err);
  }
});

// @route Get api/doctors
// @desc Show all doctors
// @access Public
router.get("/", async (req, res) => {
  const all = await User.find({ type: "doctor" }).populate("doctor");
  res.json(all);
});

// @route Get api/doctors/showOne
// @desc Show one doctor
// @access Public
router.get("/showone", async (req, res) => {
  const { doctorId } = req.body;
  const data = await Doctor.findById(doctorId);
  res.json(data);
});

// @route Get api/doctors/delete
// @desc delete doctor
// @access Public
//#######DELETE DOCTOR JEST PUBLIC MUSZE TO ZMIENIC
router.delete("/delete", async (req, res) => {
  const { doctorId } = req.body;
  const data = await Doctor.findByIdAndDelete(doctorId);
  res.json(data);
});

// @route Get api/doctors/photo
// @desc TEST TEST
// @access Public
router.post("/photo", async (req, res) => {

  
  let doctor = new Doctor(req.body);
  await doctor.save();
  // console.log(req.files.file)
  
  res.json(req.body);
});

// @route Get api/doctors/showOne
// @desc Show free termins of some doctor
// @access Public

module.exports = router;
