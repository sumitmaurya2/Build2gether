const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
require("dotenv").config()

const User = require("./models/User")
const Message = require("./models/Message")
const DirectMessage = require("./models/DirectMessage")
const userRoutes = require("./routes/user")
const projectRoutes = require("./routes/project")
const joinRequestRoutes = require("./routes/joinRequest")
const messageRoutes = require("./routes/message")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}))
app.use(express.json())

app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/join-requests", joinRequestRoutes)
app.use("/api/messages", messageRoutes)

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join_room", (projectId) => {
    socket.join(projectId)
    console.log(`User joined room: ${projectId}`)
  })

  socket.on("send_message", async (data) => {
    try {
      const user = await User.findOne({ firebaseUid: data.firebaseUid })
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
    const sender = await User.findOne({ firebaseUid: data.senderFirebaseUid })
    const receiver = await User.findOne({ firebaseUid: data.receiverFirebaseUid })

    let conversation = await DirectMessage.findOne({
      participants: { $all: [sender._id, receiver._id] }
    })

    if (!conversation) {
      conversation = await DirectMessage.create({
        participants: [sender._id, receiver._id],
        messages: [],
      })
    }

    conversation.messages.push({ sender: sender._id, text: data.text })
    await conversation.save()

    const populated = await conversation.populate("messages.sender", "name username")
    const lastMessage = populated.messages[populated.messages.length - 1]

    const roomId = [sender._id.toString(), receiver._id.toString()].sort().join("_")
    io.to(roomId).emit("receive_dm", lastMessage)
  } catch (error) {
    console.log(error.message)
  }
})

socket.on("join_dm", (roomId) => {
  socket.join(roomId)
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
const directMessageRoutes = require("./routes/directMessage")
app.use("/api/dm", directMessageRoutes)


  const notificationRoutes = require("./routes/notification")
app.use("/api/notifications", notificationRoutes)