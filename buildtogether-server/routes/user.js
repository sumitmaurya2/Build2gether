const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { authLimiter, requireAuth, requireSelfParam, requireVerifiedEmail, writeLimiter } = require("../middleware/auth")

function getProfileComplete(payload) {
  return Boolean(payload.username && payload.role && Array.isArray(payload.skills) && payload.skills.length)
}

function normalizeRole(role) {
  const allowedRoles = ["developer", "designer", "founder", "marketer", "student", "product"]
  return allowedRoles.includes(role) ? role : null
}

router.post("/", authLimiter, requireAuth, async (req, res) => {
  const { name } = req.body
  const firebaseUid = req.auth.uid
  const email = req.auth.email?.trim().toLowerCase()

  try {
    if (!firebaseUid || !name || !email) {
      return res.status(400).json({ message: "Authenticated user, name, and email are required" })
    }

    const existingUser = await User.findOne({ firebaseUid })
    if (existingUser) {
      return res.status(200).json(existingUser)
    }

    // Migrate legacy email/password users into the Firebase flow when the email already exists.
    const legacyUser = await User.findOne({ email })
    if (legacyUser) {
      legacyUser.firebaseUid = firebaseUid
      legacyUser.name = legacyUser.name || name
      legacyUser.email = email
      legacyUser.role = normalizeRole(legacyUser.role)
      legacyUser.skills = Array.isArray(legacyUser.skills) ? legacyUser.skills : []
      legacyUser.bio = typeof legacyUser.bio === "string" ? legacyUser.bio : ""
      legacyUser.profileComplete = getProfileComplete(legacyUser)
      await legacyUser.save()
      return res.status(200).json(legacyUser)
    }

    const newUser = await User.create({ firebaseUid, name, email })
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})



router.patch("/:firebaseUid", writeLimiter, requireAuth, requireVerifiedEmail, requireSelfParam(), async (req, res) => {
  try {
    const existingUser = await User.findOne({ firebaseUid: req.params.firebaseUid })
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const { email, firebaseUid, _id, ...allowedBody } = req.body
    const updates = {
      ...allowedBody,
      username: req.body.username?.trim(),
      bio: req.body.bio?.trim() || "",
    }

    // Recompute completeness from the merged profile so partial edits do not accidentally reset it.
    updates.profileComplete = getProfileComplete({
      ...existingUser.toObject(),
      ...updates,
    })

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      updates,
      { new: true, runValidators: true }
    )

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})



// GET /api/users/username/:username — public profile
router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-email")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/users/:firebaseUid — user ka data lao
router.get("/:firebaseUid", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (req.params.firebaseUid === req.auth.uid) {
      return res.status(200).json(user)
    }

    const publicUser = user.toObject()
    delete publicUser.email
    res.status(200).json(publicUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})




module.exports = router
