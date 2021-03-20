const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  type: {
    type: String,
  },

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
  },

  myDoctorId: {
    type: String,
    required: true,
  },
  // day: {
  //   type: String,
  //   required: true,
  // },
  // hour: {
  //   type: String,
  //   required: true,
  // },

  visitDate: {
    type: String,
    required: true,
    // default: "28.02.2021--12:00",
  },
});

VisitSchema.index(
  {
    myDoctorId: 1,
    visitDate:1,
    // day: 1,
    // hour: 1,
  },
  {
    unique: true,
  }
);

const Visit = mongoose.model("visit", VisitSchema);
module.exports = Visit;
