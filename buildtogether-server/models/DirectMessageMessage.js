const mongoose = require("mongoose")

const directMessageMessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DirectMessage",
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
}, { timestamps: true })

directMessageMessageSchema.index({ conversation: 1, createdAt: 1 })

module.exports = mongoose.model("DirectMessageMessage", directMessageMessageSchema)
