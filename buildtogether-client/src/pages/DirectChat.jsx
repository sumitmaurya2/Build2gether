import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser } from "../api/users"
import { getConversation } from "../api/directMessages"
import { socket, connectSocket } from "../api/socket"
import { BASE_URL } from "../api/config"
import { apiFetch, getAuthToken } from "../api/request"

export default function DirectChat() {
  const { receiverUid } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [receiverData, setReceiverData] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const bottomRef = useRef(null)

 useEffect(() => {
  async function setup() {
    try {
      const currentUser = await getUser(user.uid)
      setUserData(currentUser)

      // Receiver fetch karo
      const response = await apiFetch(`${BASE_URL}/api/users/${receiverUid}`)
      const receiver = await response.json()
      setReceiverData(receiver)

      const rid = [currentUser._id, receiver._id].sort().join("_")

      try {
        await connectSocket()
      } catch (err) {
        console.error("Socket connect failed", err)
      }

      const token = await getAuthToken()
      socket.emit("join_dm", {
        roomId: rid,
        receiverFirebaseUid: receiverUid,
        token,
      })

      const convo = await getConversation(user.uid, receiverUid, 1, 100)
      setMessages(convo.messages || [])
    } catch (error) {
      console.log(error.message)
    }
  }
  setup()

  socket.on("receive_dm", (message) => {
    setMessages(prev => [...prev, message])
  })

  return () => {
    socket.off("receive_dm")
  }
}, [receiverUid, user.uid])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim()) return

    const token = await getAuthToken()
    socket.emit("send_dm", {
      receiverFirebaseUid: receiverUid,
      token,
      text,
    })
    setText("")
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col">

      {/* Navbar */}
      <nav className="bg-surface border-b border-border px-6 h-14 flex items-center gap-4 shrink-0">
        <button
          onClick={() => navigate("/messages")}
          className="text-sm text-ink-3 hover:text-ink transition-colors"
        >
          ←
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-cream text-xs font-medium">
            {receiverData?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-ink text-sm">{receiverData?.name}</p>
            <p className="text-xs text-ink-3">@{receiverData?.username}</p>
          </div>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3 max-w-2xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-3xl mb-3">👋</p>
            <p className="font-semibold text-ink text-sm mb-1">
              Start a conversation with {receiverData?.name}
            </p>
            <p className="text-xs text-ink-3">Messages are private</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.sender?._id === userData?._id ||
              msg.sender === userData?._id

            return (
              <div
                key={i}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs lg:max-w-md flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
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
