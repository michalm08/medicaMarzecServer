const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  type: {
    type: String,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
