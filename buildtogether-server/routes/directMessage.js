const express = require("express")
const router = express.Router()
const DirectMessage = require("../models/DirectMessage")
const User = require("../models/User")
const { attachCurrentUser, requireAuth, requireVerifiedEmail, writeLimiter } = require("../middleware/auth")

router.get("/conversation/:uid1/:uid2", requireAuth, requireVerifiedEmail, attachCurrentUser, async (req, res) => {
  try {
    if (req.params.uid1 !== req.auth.uid) {
      return res.status(403).json({ message: "You can only open your own conversations" })
    }

    const user1 = req.currentUser
    const user2 = await User.findOne({ firebaseUid: req.params.uid2 })
    if (!user2) {
      return res.status(404).json({ message: "User not found" })
    }

    let conversation = await DirectMessage.findOne({
      participants: { $all: [user1._id, user2._id] },
    }).populate("messages.sender", "name username")

    if (!conversation) {
      conversation = await DirectMessage.create({
        participants: [user1._id, user2._id],
        messages: [],
      })
    }

    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/send", writeLimiter, requireAuth, requireVerifiedEmail, attachCurrentUser, async (req, res) => {
  try {
    const { receiverFirebaseUid, text } = req.body
    const receiver = await User.findOne({ firebaseUid: receiverFirebaseUid })
    if (!receiver) {
      return res.status(404).json({ message: "User not found" })
    }

    let conversation = await DirectMessage.findOne({
      participants: { $all: [req.currentUser._id, receiver._id] },
    })

    if (!conversation) {
      conversation = await DirectMessage.create({
        participants: [req.currentUser._id, receiver._id],
        messages: [],
      })
    }

    conversation.messages.push({
      sender: req.currentUser._id,
      text,
    })

    await conversation.save()

    const populated = await conversation.populate("messages.sender", "name username")
    const lastMessage = populated.messages[populated.messages.length - 1]

    res.status(201).json(lastMessage)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/:firebaseUid", requireAuth, attachCurrentUser, async (req, res) => {
  try {
    if (req.params.firebaseUid !== req.auth.uid) {
      return res.status(403).json({ message: "You can only access your own conversations" })
    }

    const conversations = await DirectMessage.find({
      participants: req.currentUser._id,
    }).populate("participants", "name username role firebaseUid")
      .sort({ updatedAt: -1 })

    res.status(200).json(conversations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
