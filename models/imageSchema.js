const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    email: { type: String, required: true },
    schedule: { type: String, requried: true },
    awsurl: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
