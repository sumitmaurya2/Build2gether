const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["join_request", "request_accepted", "request_rejected", "new_member"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: "",
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema)