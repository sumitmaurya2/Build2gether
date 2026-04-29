const express = require("express")
const router = express.Router()
const Project = require("../models/Project")
const User = require("../models/User")
const { attachCurrentUser, requireAuth, requireSelfParam, requireVerifiedEmail, writeLimiter } = require("../middleware/auth")

function publicProjectQuery(filter = {}) {
  return Project.find(filter)
    .populate("postedBy", "name username role")
    .populate("members", "name username role")
}

router.post("/", writeLimiter, requireAuth, requireVerifiedEmail, attachCurrentUser, async (req, res) => {
  try {
    const { firebaseUid, postedBy, members, ...projectData } = req.body

    const project = await Project.create({
      ...projectData,
      postedBy: req.currentUser._id,
    })

    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const total = await Project.countDocuments({ status: "open" })
    const projects = await publicProjectQuery({ status: "open" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      projects,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/search", async (req, res) => {
  try {
    const { q, stage, budget } = req.query
    const filter = { status: "open" }

    if (stage) filter.stage = stage
    if (budget) filter.budget = budget
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
      ]
    }

    const projects = await publicProjectQuery(filter).sort({ createdAt: -1 })
    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/user/:firebaseUid", requireAuth, requireSelfParam(), async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const projects = await Project.find({ postedBy: user._id }).sort({ createdAt: -1 })
    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("postedBy", "name username role")
      .populate("members", "name username role")
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/:id", writeLimiter, requireAuth, requireVerifiedEmail, attachCurrentUser, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.currentUser._id,
    })

    if (!project) {
      return res.status(404).json({ message: "Project not found or not owned by you" })
    }

    res.status(200).json({ message: "Project deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch("/:id", writeLimiter, requireAuth, requireVerifiedEmail, attachCurrentUser, async (req, res) => {
  try {
    const { postedBy, members, ...projectData } = req.body
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.currentUser._id },
      projectData,
      { new: true, runValidators: true }
    )

    if (!project) {
      return res.status(404).json({ message: "Project not found or not owned by you" })
    }

    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
