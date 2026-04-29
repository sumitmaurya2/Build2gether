const rateLimit = require("express-rate-limit")
const admin = require("../config/firebaseAdmin")
const User = require("../models/User")

const SESSION_MAX_AGE_SECONDS = Number(process.env.SESSION_MAX_AGE_SECONDS || 60 * 60 * 12)

function getBearerToken(req) {
  const header = req.get("authorization") || ""
  const [scheme, token] = header.split(" ")
  return scheme?.toLowerCase() === "bearer" && token ? token : null
}

function tokenSessionExpired(decodedToken) {
  if (!decodedToken.auth_time) {
    return true
  }

  const ageSeconds = Math.floor(Date.now() / 1000) - decodedToken.auth_time
  return ageSeconds > SESSION_MAX_AGE_SECONDS
}

async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req)
    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const decodedToken = await admin.auth().verifyIdToken(token, true)
    if (tokenSessionExpired(decodedToken)) {
      return res.status(401).json({ message: "Session expired. Please sign in again." })
    }

    req.auth = decodedToken
    return next()
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" })
  }
}

function requireVerifiedEmail(req, res, next) {
  const provider = req.auth?.firebase?.sign_in_provider
  if (provider === "password" && !req.auth.email_verified) {
    return res.status(403).json({ message: "Please verify your email before continuing." })
  }

  return next()
}

async function attachCurrentUser(req, res, next) {
  try {
    const user = await User.findOne({ firebaseUid: req.auth.uid })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    req.currentUser = user
    return next()
  } catch (error) {
    return next(error)
  }
}

function requireSelfParam(paramName = "firebaseUid") {
  return (req, res, next) => {
    if (req.params[paramName] !== req.auth.uid) {
      return res.status(403).json({ message: "You can only access your own account." })
    }

    return next()
  }
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." },
})

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please slow down." },
})

module.exports = {
  attachCurrentUser,
  authLimiter,
  requireAuth,
  requireSelfParam,
  requireVerifiedEmail,
  writeLimiter,
}
