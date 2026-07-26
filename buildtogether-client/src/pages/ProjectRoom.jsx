import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser } from "../api/users"
import { socket, connectSocket } from "../api/socket"
import { BASE_URL } from "../api/config"
import { apiFetch, getAuthToken } from "../api/request"

export default function ProjectRoom() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
    async function setup() {
      if (!user?.uid) {
        return
      }

      const data = await getUser(user.uid)
      setUserData(data)

      // Read the same configured backend for local and Railway deployments.
      const response = await apiFetch(`${BASE_URL}/api/messages/${projectId}?page=1&limit=200`)
      const data = await response.json()
      setMessages(data.messages || [])

      // Ensure the shared socket is connected with auth before joining.
      try {
        await connectSocket()
      } catch (err) {
        console.error("Socket connect failed", err)
      }

      const token = await getAuthToken()
      socket.emit("join_room", { projectId, token })
    }
    setup()

    // Naye messages suno
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off("receive_message")
    }
  }, [projectId, user?.uid])

  // Naya message aane pe scroll down
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim()) return

    const token = await getAuthToken()
    socket.emit("send_message", {
      projectId,
      token,
      text,
    })
    setText("")
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col">

      {/* Navbar */}
      <nav className="bg-surface border-b border-border px-6 h-14 flex items-center justify-between shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-ink-3 hover:text-ink transition-colors"
        >
          ← Back
        </button>
        <span className="font-semibold text-ink text-sm">Project Room</span>
        <div className="w-16" />
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3 max-w-2xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-3xl mb-3">💬</p>
            <p className="font-semibold text-ink text-sm mb-1">No messages yet</p>
            <p className="text-xs text-ink-3">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender?.firebaseUid === user.uid ||
              msg.sender?._id === userData?._id

            return (
              <div
                key={msg._id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {!isOwn && (
                    <span className="text-xs text-ink-3 px-1">
                      {msg.sender?.name}
                    </span>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isOwn
                      ? "bg-ink text-cream rounded-br-sm"
                      : "bg-surface border border-border text-ink rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-surface border-t border-border px-4 py-3 shrink-0">
        <form
          onSubmit={handleSend}
          className="max-w-2xl mx-auto flex items-center gap-3"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-border rounded-full px-4 py-2.5 text-sm bg-cream text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
          />
          <button
            type="submit"
            className="bg-ink text-cream text-sm px-5 py-2.5 rounded-full hover:bg-brand transition-colors"
          >
            Send
          </button>
        </form>
      </div>

    </div>
  )
}
