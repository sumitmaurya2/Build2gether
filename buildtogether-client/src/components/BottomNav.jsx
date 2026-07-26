import { useLocation, useNavigate } from "react-router-dom"
import { Bell, Compass, House, MessageCircle, Plus } from "lucide-react"

const tabs = [
  { path: "/home", Icon: House, label: "Home" },
  { path: "/explore", Icon: Compass, label: "Explore" },
  { path: "/create-project", Icon: Plus, label: "Post" },
  { path: "/messages", Icon: MessageCircle, label: "Messages" },
  { path: "/notifications", Icon: Bell, label: "Alerts" },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav aria-label="Primary navigation" className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center justify-around px-1 py-2">
        {tabs.map((tab) => {
          const { path, label } = tab
          const isActive = location.pathname === path
          return (
            <button key={path} type="button" onClick={() => navigate(path)} aria-current={isActive ? "page" : undefined} className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition-all ${isActive ? "text-brand" : "text-ink-3"}`}>
              <tab.Icon size={19} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
