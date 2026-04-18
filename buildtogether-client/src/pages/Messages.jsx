import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser } from "../api/users"
import { getConversations } from "../api/directMessages"
import AppNavbar from "../components/AppNavbar"

export default function Messages() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await getUser(user.uid)
      setUserData(data)
      const convos = await getConversations(user.uid)
      setConversations(convos)
      setLoading(false)
    }
    fetchData()
  }, [user])

 function getOtherParticipant(conversation) {
  return conversation.participants.find(
    p => p.firebaseUid !== userData?.firebaseUid
  )
}

  return (
    <div className="min-h-screen bg-cream">
      <AppNavbar userData={userData} unreadCount={0} />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-24 md:pb-12">

        <h1 className="font-display text-4xl text-ink italic mb-6">
          Messages
        </h1>

        {loading ? (
          <p className="text-sm text-ink-3">Loading...</p>
        ) : conversations.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">💬</p>
            <p className="font-semibold text-ink text-sm mb-1">No messages yet</p>
            <p className="text-xs text-ink-3">
              Visit someone's profile to start a conversation
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {conversations.map((convo) => {
              const other = getOtherParticipant(convo)
              const lastMsg = convo.messages[convo.messages.length - 1]
              return (
                <div
                  key={convo._id}
                  onClick={() => navigate(`/dm/${other?.firebaseUid}`)}
                  className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-ink/20 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-cream font-medium shrink-0">
                    {other?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-sm">{other?.name}</p>
                    <p className="text-xs text-ink-3 truncate">
                      {lastMsg ? lastMsg.text : "No messages yet"}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}