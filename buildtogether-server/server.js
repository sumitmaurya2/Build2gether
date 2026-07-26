const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const helmet = require("helmet")
const { Server } = require("socket.io")
require("dotenv").config()

const admin = require("./config/firebaseAdmin")
const User = require("./models/User")
const Message = require("./models/Message")
const DirectMessage = require("./models/DirectMessage")
const Project = require("./models/Project")
const userRoutes = require("./routes/user")
const projectRoutes = require("./routes/project")
const joinRequestRoutes = require("./routes/joinRequest")
const messageRoutes = require("./routes/message")
const directMessageRoutes = require("./routes/directMessage")
const notificationRoutes = require("./routes/notification")

const app = express()
const server = http.createServer(app)
const SESSION_MAX_AGE_SECONDS = Number(process.env.SESSION_MAX_AGE_SECONDS || 60 * 60 * 12)

// Required by managed hosts, which place the app behind a reverse proxy.
app.set("trust proxy", 1)

function getAllowedOrigins() {
  const configuredOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173"

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean)
    .concat(["http://localhost:5173", "http://127.0.0.1:5173"])
}

const allowedOrigins = [...new Set(getAllowedOrigins())]

function corsOrigin(origin, callback) {
  const normalizedOrigin = origin?.replace(/\/+$/, "")

  // Allow same-origin/server requests without an Origin header and only whitelist known frontends otherwise.
  if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
    return callback(null, true)
  }

  return callback(new Error("CORS origin not allowed"))
}

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
})

app.use(cors({
  origin: corsOrigin,
  methods: ["GET", "POST", "PATCH", "DELETE"],
}))
app.use(helmet())
app.use(express.json())

// Used by the hosting provider to decide whether this instance is ready to receive traffic.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/join-requests", joinRequestRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/dm", directMessageRoutes)
app.use("/api/notifications", notificationRoutes)

async function verifySocketToken(token) {
  if (!token) {
    return null
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token, true)
    const ageSeconds = Math.floor(Date.now() / 1000) - decodedToken.auth_time
    return ageSeconds <= SESSION_MAX_AGE_SECONDS ? decodedToken : null
  } catch {
    return null
  }
}

async function canAccessProject(projectId, firebaseUid) {
  const user = await User.findOne({ firebaseUid })
  if (!user) {
    return null
  }

  const project = await Project.findById(projectId).select("postedBy members")
  if (!project) {
    return null
  }

  const isOwner = project.postedBy?.toString() === user._id.toString()
  const isMember = project.members.some((memberId) => memberId.toString() === user._id.toString())

  return isOwner || isMember ? user : null
}

async function getDmParticipants(senderFirebaseUid, receiverFirebaseUid) {
  const sender = await User.findOne({ firebaseUid: senderFirebaseUid })
  const receiver = await User.findOne({ firebaseUid: receiverFirebaseUid })

  if (!sender || !receiver) {
    return null
  }

  return { sender, receiver }
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join_room", async (payload) => {
    try {
      const projectId = typeof payload === "string" ? payload : payload?.projectId
      const decodedToken = await verifySocketToken(typeof payload === "string" ? null : payload?.token)
      if (!projectId || !decodedToken) {
        return
      }

      const user = await canAccessProject(projectId, decodedToken.uid)
      if (!user) {
        return
      }

      socket.join(projectId)
      console.log(`User ${user._id} joined room: ${projectId}`)
    } catch (error) {
      console.log(error.message)
    }
  })

  socket.on("send_message", async (data) => {
    try {
      const decodedToken = await verifySocketToken(data.token)
      if (!decodedToken) {
        return
      }

      const user = await canAccessProject(data.projectId, decodedToken.uid)
      if (!user) {
        return
      }

      const message = await Message.create({
        projectId: data.projectId,
        sender: user._id,
        text: data.text,
      })

      const populatedMessage = await message.populate("sender", "name username")
      io.to(data.projectId).emit("receive_message", populatedMessage)
    } catch (error) {
      console.log(error.message)
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })

  socket.on("send_dm", async (data) => {
    try {
      const decodedToken = await verifySocketToken(data.token)
      if (!decodedToken) {
        return
      }

      const participants = await getDmParticipants(decodedToken.uid, data.receiverFirebaseUid)
      if (!participants || !data.text?.trim()) {
        return
      }

      const { sender, receiver } = participants

      let conversation = await DirectMessage.findOne({
        participants: { $all: [sender._id, receiver._id] }
      })

      if (!conversation) {
        conversation = await DirectMessage.create({
          participants: [sender._id, receiver._id],
          messages: [],
        })
      }

      conversation.messages.push({ sender: sender._id, text: data.text.trim() })
      await conversation.save()

      const populated = await conversation.populate("messages.sender", "name username")
      const lastMessage = populated.messages[populated.messages.length - 1]

      const roomId = [sender._id.toString(), receiver._id.toString()].sort().join("_")
      io.to(roomId).emit("receive_dm", lastMessage)
    } catch (error) {
      console.log(error.message)
    }
  })

  socket.on("join_dm", async (payload) => {
    try {
      const roomId = typeof payload === "string" ? payload : payload?.roomId
      const decodedToken = await verifySocketToken(typeof payload === "string" ? null : payload?.token)
      const receiverFirebaseUid = typeof payload === "string" ? null : payload?.receiverFirebaseUid
      if (!roomId || !decodedToken || !receiverFirebaseUid) {
        return
      }

      const participants = await getDmParticipants(decodedToken.uid, receiverFirebaseUid)
      if (!participants) {
        return
      }

      const expectedRoomId = [participants.sender._id.toString(), participants.receiver._id.toString()].sort().join("_")
      if (roomId !== expectedRoomId) {
        return
      }

      socket.join(roomId)
    } catch (error) {
      console.log(error.message)
    }
  })
})

mongoose
  .connect(process.env.MONGO_URI, {
    // Avoid silently writing to Atlas' default "test" database when no DB name is present in the URI.
    dbName: process.env.MONGO_DB_NAME || "buildtogether",
  })
  .then(async () => {
    // Keep Mongo indexes aligned with the current schema so auth/profile creation does not fail on stale fields.
    await User.syncIndexes()
    console.log("MongoDB connected")
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message)
  })
