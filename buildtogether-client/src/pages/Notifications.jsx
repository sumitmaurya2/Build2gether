import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getNotifications, markAllAsRead } from "../api/notifications"
import AppNavbar from "../components/AppNavbar"

export default function Notifications() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      const data = await getNotifications(user.uid)
      setNotifications(data)
      setLoading(false)
    }
    fetchNotifications()
  }, [user])

  async function handleMarkAllRead() {
    await markAllAsRead(user.uid)
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  function getIcon(type) {
    switch (type) {
      case "join_request": return "👋"
      case "request_accepted": return "✅"
      case "request_rejected": return "❌"
      default: return "🔔"
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-cream">

      {/* Navbar */}
      <AppNavbar userData={userData} unreadCount={0} />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-4xl text-ink italic">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-ink-3 hover:text-brand transition-colors underline underline-offset-4"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-ink-3">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">🔔</p>
            <p className="font-semibold text-ink text-sm mb-1">No notifications yet</p>
            <p className="text-xs text-ink-3">Activity will show here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => navigate(notification.link)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:border-ink/20 hover:shadow-sm ${
                  notification.read
                    ? "bg-surface border-border"
                    : "bg-brand-light border-orange-100"
                }`}
              >
                <span className="text-xl shrink-0">
                  {getIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <p className={`text-sm leading-relaxed ${
                    notification.read ? "text-ink-2" : "text-ink font-medium"
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-ink-3 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}