const express = require("express")
const router = express.Router()
const Message = require("../models/Message")
const Project = require("../models/Project")
const { attachCurrentUser, requireAuth, requireVerifiedEmail, writeLimiter } = require("../middleware/auth")

async function canAccessProject(projectId, userId) {
  const project = await Project.findById(projectId).select("postedBy members")
  if (!project) {
    return false
  }

  return project.postedBy.toString() === userId.toString() ||
    project.members.some((memberId) => memberId.toString() === userId.toString())
}

// GET /api/messages/:projectId — purane messages lao
router.get("/:projectId", requireAuth, attachCurrentUser, async (req, res) => {
  try {
    const allowed = await canAccessProject(req.params.projectId, req.currentUser._id)
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this project" })
    }

    const messages = await Message.find({ projectId: req.params.projectId })
      .populate("sender", "name username")
      .sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/messages — message save karo
router.post("/", writeLimiter, requireAuth, requireVerifiedEmail, attachCurrentUser, async (req, res) => {
  try {
    const { projectId, text } = req.body

    const allowed = await canAccessProject(projectId, req.currentUser._id)
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this project" })
    }

    const message = await Message.create({
      projectId,
      sender: req.currentUser._id,
      text,
    })

    const populated = await message.populate("sender", "name username")
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
