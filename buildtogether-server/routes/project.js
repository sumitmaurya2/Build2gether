const express = require("express")
const router = express.Router()
const Project = require("../models/Project")
const User = require("../models/User")

// POST /api/projects — naya project banao
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, ...projectData } = req.body

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const project = await Project.create({
      ...projectData,
      postedBy: user._id,
    })

    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/projects — saare projects lao (feed)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ status: "open" })
      .populate("postedBy", "name username role")
      .sort({ createdAt: -1 })

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// GET /api/projects/user/:firebaseUid — ek user ke saare projects
router.get("/user/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const projects = await Project.find({ postedBy: user._id })
      .sort({ createdAt: -1 })

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// DELETE /api/projects/:id
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }
    res.status(200).json({ message: "Project deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PATCH /api/projects/:id
router.patch("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    )
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }
    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
// GET /api/projects/search?q=react&stage=idea&budget=unpaid
router.get("/search", async (req, res) => {
  try {
    const { q, stage, budget } = req.query

    let filter = { status: "open" }

    if (stage) filter.stage = stage
    if (budget) filter.budget = budget
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
      ]
    }

    const projects = await Project.find(filter)
      .populate("postedBy", "name username role")
      .sort({ createdAt: -1 })

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// GET /api/projects/:id
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const total = await Project.countDocuments({ status: "open" })
    const projects = await Project.find({ status: "open" })
      .populate("postedBy", "name username role")
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






module.exports = router