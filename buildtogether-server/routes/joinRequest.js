const express = require("express")
const router = express.Router()
const JoinRequest = require("../models/JoinRequest")
const User = require("../models/User")

// POST /api/join-requests — request bhejo
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, projectId, message } = req.body

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check karo already request bheja hai kya
    const existing = await JoinRequest.findOne({
      project: projectId,
      sender: user._id,
    })
    if (existing) {
      return res.status(400).json({ message: "Already sent request" })
    }

    const request = await JoinRequest.create({
      project: projectId,
      sender: user._id,
      message,
    })

    res.status(201).json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/join-requests/project/:projectId — ek project ki saari requests
router.get("/project/:projectId", async (req, res) => {
  try {
    const requests = await JoinRequest.find({ project: req.params.projectId })
      .populate("sender", "name username role skills")

    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router 