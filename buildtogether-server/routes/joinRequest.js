const express = require("express")
const router = express.Router()
const JoinRequest = require("../models/JoinRequest")
const User = require("../models/User")
const Project = require("../models/Project")
const Notification = require("../models/Notification")
const { attachCurrentUser, requireAuth, requireVerifiedEmail, writeLimiter } = require("../middleware/auth")

// POST — request bhejo
router.post("/", writeLimiter, requireAuth, requireVerifiedEmail, attachCurrentUser, async (req, res) => {
  try {
    const { projectId, message } = req.body

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (project.postedBy.toString() === req.currentUser._id.toString()) {
      return res.status(400).json({ message: "You already own this project" })
    }

    const existing = await JoinRequest.findOne({
      project: projectId,
      sender: req.currentUser._id,
    })
    if (existing) {
      return res.status(400).json({ message: "Already sent request" })
    }

    const request = await JoinRequest.create({
      project: projectId,
      sender: req.currentUser._id,
      message,
    })

    await Notification.create({
      recipient: project.postedBy,
      type: "join_request",
      message: `${req.currentUser.name} wants to join your project`,
      link: `/requests`,
    })

    res.status(201).json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET — project ki requests
router.get("/project/:projectId", requireAuth, attachCurrentUser, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      postedBy: req.currentUser._id,
    })
    if (!project) {
      return res.status(403).json({ message: "Only the project owner can view requests" })
    }

    const requests = await JoinRequest.find({ project: req.params.projectId })
      .populate("sender", "name username role skills")
    res.status(200).json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PATCH — accept ya reject
router.patch("/:id", writeLimiter, requireAuth, requireVerifiedEmail, attachCurrentUser, async (req, res) => {
  try {
    const { status } = req.body
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid request status" })
    }

    const request = await JoinRequest.findById(req.params.id)
    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    const ownedProject = await Project.findOne({
      _id: request.project,
      postedBy: req.currentUser._id,
    })
    if (!ownedProject) {
      return res.status(403).json({ message: "Only the project owner can update requests" })
    }

    request.status = status
    await request.save()

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
