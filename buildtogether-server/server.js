const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Test route
app.get("/", (req, res) => {
  res.json({ message: "BuildTogether server is running" })
})


// Routes
const userRoutes = require("./routes/user")
app.use("/api/users", userRoutes)

const projectRoutes = require("./routes/project")
app.use("/api/projects", projectRoutes)


const joinRequestRoutes = require("./routes/joinRequest")
app.use("/api/join-requests", joinRequestRoutes)


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "buildtogether" })
  .then(() => {
    console.log("MongoDB connected")
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message)
  })
