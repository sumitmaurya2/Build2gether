const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")
const User = require("../models/User")

// GET /api/notifications/:firebaseUid — user ki saari notifications
router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const notifications = await Notification.find({ recipient: user._id })
      .sort({ createdAt: -1 })
      .limit(20)

    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PATCH /api/notifications/:id/read — notification read mark karo
router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    )
    res.status(200).json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PATCH /api/notifications/read-all/:firebaseUid — saari notifications read karo
router.patch("/read-all/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    await Notification.updateMany(
      { recipient: user._id, read: false },
      { read: true }
    )
    res.status(200).json({ message: "All read" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router