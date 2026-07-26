import { useEffect, useState } from "react"
import { Bell, CheckCircle2, UserPlus, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser } from "../api/users"
import { getNotifications, markAllAsRead } from "../api/notifications"
import AppNavbar from "../components/AppNavbar"

function NotificationIcon({ type }) {
  const icons = {
    join_request: UserPlus,
    request_accepted: CheckCircle2,
    request_rejected: XCircle,
  }
  const Icon = icons[type] || Bell
  return <Icon className="mt-0.5 shrink-0 text-brand" size={20} aria-hidden="true" />
}

export default function Notifications() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadPage() {
      try {
        const [profile, items] = await Promise.all([getUser(user.uid), getNotifications(user.uid)])
        setUserData(profile)
        setNotifications(items)
      } catch {
        setError("Notifications load nahi ho sake. Dobara try karein.")
      } finally {
        setLoading(false)
      }
    }
    loadPage()
  }, [user.uid])

  const unreadCount = notifications.filter((item) => !item.read).length

  async function handleMarkAllRead() {
    try {
      await markAllAsRead(user.uid)
      setNotifications((items) => items.map((item) => ({ ...item, read: true })))
    } catch {
      setError("Notifications update nahi ho sake. Dobara try karein.")
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <AppNavbar userData={userData} unreadCount={unreadCount} />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-24 md:pb-12">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="font-display text-4xl italic text-ink">Notifications</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <button type="button" onClick={() => navigate("/requests")} className="text-xs text-ink-3 underline decoration-border underline-offset-4 hover:text-brand">Join requests</button>
            {unreadCount > 0 && <button type="button" onClick={handleMarkAllRead} className="text-xs text-ink-3 underline decoration-border underline-offset-4 hover:text-brand">Mark all as read</button>}
          </div>
        </div>
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading ? <p className="py-8 text-center text-sm text-ink-3">Loading notifications...</p> : notifications.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center"><Bell className="mx-auto mb-3 text-ink-3" size={28} /><p className="mb-1 text-sm font-semibold text-ink">No notifications yet</p><p className="text-xs text-ink-3">Activity will show here.</p></div>
        ) : <div className="flex flex-col gap-3">{notifications.map((notification) => <button key={notification._id} type="button" onClick={() => notification.link && navigate(notification.link)} className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all hover:border-ink/20 hover:shadow-sm ${notification.read ? "border-border bg-surface" : "border-orange-100 bg-brand-light"}`}>
          <NotificationIcon type={notification.type} /><div className="flex-1"><p className={notification.read ? "text-sm leading-relaxed text-ink-2" : "text-sm font-medium leading-relaxed text-ink"}>{notification.message}</p><p className="mt-1 text-xs text-ink-3">{new Date(notification.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p></div>{!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}</button>)}</div>}
      </main>
    </div>
  )
}
