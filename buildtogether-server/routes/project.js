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




module.exports = router