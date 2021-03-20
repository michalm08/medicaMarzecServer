const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  birth: {
    type: String,
  },
  city: {
    type: String,
  },

});

const Patient = mongoose.model("patient", PatientSchema);
module.exports = Patient;
