const express = require("express")
const router = express.Router()
const JoinRequest = require("../models/JoinRequest")
const User = require("../models/User")
const Project = require("../models/Project")
const Notification = require("../models/Notification")

// POST — request bhejo
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, projectId, message } = req.body

    const sender = await User.findOne({ firebaseUid })
    if (!sender) {
      return res.status(404).json({ message: "User not found" })
    }

    const existing = await JoinRequest.findOne({
      project: projectId,
      sender: sender._id,
    })
    if (existing) {
      return res.status(400).json({ message: "Already sent request" })
    }

    const request = await JoinRequest.create({
      project: projectId,
      sender: sender._id,
      message,
    })

    // Project owner ko notification bhejo
    const project = await Project.findById(projectId)
    await Notification.create({
      recipient: project.postedBy,
      type: "join_request",
      message: `${sender.name} wants to join your project`,
      link: `/requests`,
    })

    res.status(201).json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET — project ki requests
router.get("/project/:projectId", async (req, res) => {
  try {
    const requests = await JoinRequest.find({ project: req.params.projectId })
      .populate("sender", "name username role skills")
    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PATCH — accept ya reject
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body

    const request = await JoinRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    if (status === "accepted") {
      const project = await Project.findByIdAndUpdate(
        request.project,
        { $addToSet: { members: request.sender } }
      )

      // Sender ko notification bhejo
      await Notification.create({
        recipient: request.sender,
        type: "request_accepted",
        message: `Your request to join "${project.title}" was accepted`,
        link: `/project-room/${project._id}`,
      })
    }

    if (status === "rejected") {
      const project = await Project.findById(request.project)

      await Notification.create({
        recipient: request.sender,
        type: "request_rejected",
        message: `Your request to join "${project.title}" was not accepted`,
        link: `/home`,
      })
    }

    res.status(200).json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router