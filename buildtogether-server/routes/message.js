const express = require("express")
const router = express.Router()
const Message = require("../models/Message")
const User = require("../models/User")

// GET /api/messages/:projectId — purane messages lao
router.get("/:projectId", async (req, res) => {
  try {
    const messages = await Message.find({ projectId: req.params.projectId })
      .populate("sender", "name username")
      .sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/messages — message save karo
router.post("/", async (req, res) => {
  try {
    const { projectId, firebaseUid, text } = req.body

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const message = await Message.create({
      projectId,
      sender: user._id,
      text,
    })

    const populated = await message.populate("sender", "name username")
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router