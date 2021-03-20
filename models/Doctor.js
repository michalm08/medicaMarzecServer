const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  special: {
    type: Array,
  },
  note: {
    type: String,
  },
  img: {
    type: String,
  },
});
const Doctor = mongoose.model("doctor", DoctorSchema);
module.exports = Doctor;

// special: {
//   type: Array,
// },
// note: {
//   type: String,
// },
