const mongoose = require("mongoose");
const validator = require("validator");
const TaksSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users"
    }
  },
  {
    timestamps: true
  }
);

const task = mongoose.model("tasks", TaksSchema);

module.exports = task;
