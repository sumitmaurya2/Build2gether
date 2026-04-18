const express = require("express")
const router = express.Router()
const DirectMessage = require("../models/DirectMessage")
const User = require("../models/User")

// GET /api/dm/:firebaseUid — user ki saari conversations
router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    if (!user) return res.status(404).json({ message: "User not found" })

    const conversations = await DirectMessage.find({
      participants: user._id
    }).populate("participants", "name username role firebaseUid")
      .sort({ updatedAt: -1 })

    res.status(200).json(conversations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/dm/conversation/:uid1/:uid2 — do logon ki conversation
router.get("/conversation/:uid1/:uid2", async (req, res) => {
  try {
    const user1 = await User.findOne({ firebaseUid: req.params.uid1 })
    const user2 = await User.findOne({ firebaseUid: req.params.uid2 })

    if (!user1 || !user2) return res.status(404).json({ message: "User not found" })

    let conversation = await DirectMessage.findOne({
      participants: { $all: [user1._id, user2._id] }
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

// POST /api/dm/send — message bhejo
router.post("/send", async (req, res) => {
  try {
    const { senderFirebaseUid, receiverFirebaseUid, text } = req.body

    const sender = await User.findOne({ firebaseUid: senderFirebaseUid })
    const receiver = await User.findOne({ firebaseUid: receiverFirebaseUid })

    if (!sender || !receiver) return res.status(404).json({ message: "User not found" })

    let conversation = await DirectMessage.findOne({
      participants: { $all: [sender._id, receiver._id] }
    })

    if (!conversation) {
      conversation = await DirectMessage.create({
        participants: [sender._id, receiver._id],
        messages: [],
      })
    }

    conversation.messages.push({
      sender: sender._id,
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

module.exports = router