import { useNavigate, useLocation } from "react-router-dom"

export default function AppNavbar({ userData, unreadCount }) {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border px-6 h-14 flex items-center justify-between">

      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
          <span className="text-cream text-xs font-display italic">B</span>
        </div>
        <span className="font-sans font-semibold text-ink">
          Build<span className="text-brand">Together</span>
        </span>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={() => navigate("/home")}
          className="text-sm text-ink-3 hover:text-ink transition-colors"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/explore")}
          className="text-sm text-ink-3 hover:text-ink transition-colors"
        >
          Explore
        </button>
        <button
          onClick={() => navigate("/create-project")}
          className="text-sm text-ink-3 hover:text-ink transition-colors"
        >
          Post project
        </button>
        <button
          onClick={() => navigate("/requests")}
          className="text-sm text-ink-3 hover:text-ink transition-colors"
        >
          Requests
        </button>
        <button
          onClick={() => navigate("/notifications")}
          className="relative text-sm text-ink-3 hover:text-ink transition-colors"
        >
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Avatar — profile pe le jaye */}
      <div
        className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-cream text-xs font-medium cursor-pointer hover:bg-brand transition-colors"
        onClick={() => navigate(`/profile/${userData?.username}`)}
      >
        {userData?.name?.charAt(0).toUpperCase()}
      </div>

    </nav>
  )
}