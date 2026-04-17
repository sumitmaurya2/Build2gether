const express = require("express")
const router = express.Router()
const User = require("../models/User")

function getProfileComplete(payload) {
  return Boolean(payload.username && payload.role && Array.isArray(payload.skills) && payload.skills.length)
}

router.post("/", async (req, res) => {
  const { firebaseUid, name, email } = req.body

  try {
    if (!firebaseUid || !name || !email) {
      return res.status(400).json({ message: "firebaseUid, name, aur email required hain" })
    }

    const existingUser = await User.findOne({ firebaseUid })
    if (existingUser) {
      return res.status(200).json(existingUser)
    }

    const newUser = await User.create({ firebaseUid, name, email })
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch("/:firebaseUid", async (req, res) => {
  try {
    const updates = {
      ...req.body,
      username: req.body.username?.trim(),
      bio: req.body.bio?.trim() || "",
    }

    updates.profileComplete = getProfileComplete(updates)

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      updates,
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})



// GET /api/users/username/:username — public profile
router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})




module.exports = router
