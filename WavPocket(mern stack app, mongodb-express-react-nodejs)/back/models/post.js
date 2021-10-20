const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

//The reason we dont use minLength, and maxLength in the title and tag objets its because we have implemented validators
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file: {
    type: Buffer,
    fileType: String,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
