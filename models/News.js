const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  topic: {
    type: String,
  },
  text: {
    type: String,
  },
  date: {
    type: String,
    // type: Date,
  },
});

const News = mongoose.model("news", NewsSchema);
module.exports = News;
