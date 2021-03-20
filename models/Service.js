const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  price: {
    type: String,
    // type: Date,
  },

});

const Service = mongoose.model("service", ServiceSchema);
module.exports = Service;
