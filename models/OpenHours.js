const mongoose = require("mongoose");

const OpenHoursSchema = new mongoose.Schema({
  monday: {
    type: Object,
  },
  tuesday: {
    type: Object,
  },
  wednesday: {
    type: Object,
  },
  thursday: {
    type: Object,
  },
  friday: {
    type: Object,
  },
  saturday: {
    type: Object,
  },
  sunday: {
    type: Object,
  },
});

const OpenHours = mongoose.model("openhours", OpenHoursSchema);
module.exports = OpenHours;
