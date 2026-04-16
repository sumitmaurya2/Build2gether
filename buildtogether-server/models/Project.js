const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  rolesNeeded: {
    type: [String],
    default: [],
  },
  teamSize: {
    type: Number,
    default: 1,
  },
  timeline: {
    type: String,
    default: "",
  },
  budget: {
    type: String,
    enum: ["paid", "unpaid", "equity"],
    default: "unpaid",
  },
  stage: {
    type: String,
    enum: ["idea", "building", "launched"],
    default: "idea",
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
}, { timestamps: true })

module.exports = mongoose.model("Project", projectSchema)