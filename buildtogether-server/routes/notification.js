const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")
const User = require("../models/User")
const { attachCurrentUser, requireAuth, writeLimiter } = require("../middleware/auth")

// GET /api/notifications/:firebaseUid — user ki saari notifications
router.get("/:firebaseUid", requireAuth, attachCurrentUser, async (req, res) => {
  try {
    if (req.params.firebaseUid !== req.auth.uid) {
      return res.status(403).json({ message: "You can only access your own notifications" })
    }

    const notifications = await Notification.find({ recipient: req.currentUser._id })
      .sort({ createdAt: -1 })
      .limit(20)

    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PATCH /api/notifications/:id/read — notification read mark karo
router.patch("/:id/read", writeLimiter, requireAuth, attachCurrentUser, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.currentUser._id },
      { read: true },
      { new: true }
    )
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }
    res.status(200).json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PATCH /api/notifications/read-all/:firebaseUid — saari notifications read karo
router.patch("/read-all/:firebaseUid", writeLimiter, requireAuth, attachCurrentUser, async (req, res) => {
  try {
    if (req.params.firebaseUid !== req.auth.uid) {
      return res.status(403).json({ message: "You can only update your own notifications" })
    }

    await Notification.updateMany(
      { recipient: req.currentUser._id, read: false },
      { read: true }
    )
    res.status(200).json({ message: "All read" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
