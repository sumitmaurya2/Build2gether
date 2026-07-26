import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function AppNavbar({ userData, unreadCount = 0 }) {
  const navigate = useNavigate()
  const profilePath = userData?.username ? `/profile/${userData.username}` : "/profile"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <button type="button" onClick={() => navigate("/home")} aria-label="Go to home" className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-xs italic text-cream">B</span>
        <span className="font-sans text-sm font-semibold text-ink sm:text-base">Build<span className="text-brand">Together</span></span>
      </button>

      <div className="hidden items-center gap-5 md:flex">
        <button type="button" onClick={() => navigate("/home")} className="text-sm text-ink-3 transition-colors hover:text-ink">Home</button>
        <button type="button" onClick={() => navigate("/explore")} className="text-sm text-ink-3 transition-colors hover:text-ink">Explore</button>
        <button type="button" onClick={() => navigate("/create-project")} className="text-sm text-ink-3 transition-colors hover:text-ink">Post project</button>
        <button type="button" onClick={() => navigate("/requests")} className="text-sm text-ink-3 transition-colors hover:text-ink">Requests</button>
        <button type="button" onClick={() => navigate("/notifications")} aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"} className="relative rounded-lg p-1 text-ink-3 transition-colors hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/50">
          <Bell size={18} aria-hidden="true" />
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
        </button>
      </div>

      <button type="button" onClick={() => navigate(profilePath)} aria-label="Open your profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-medium text-cream transition-colors hover:bg-brand focus:outline-none focus:ring-2 focus:ring-brand/50">
        {userData?.name?.charAt(0).toUpperCase() || "U"}
      </button>
    </nav>
  )
}
