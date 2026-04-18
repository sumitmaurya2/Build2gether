const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["developer", "designer", "founder", "marketer", "student", "product"],
    default: null,
  },
  skills: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: "",
    trim: true,
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
