import { useNavigate, useLocation } from "react-router-dom"

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

 const tabs = [
  { path: "/home", icon: "⊞", label: "Home" },
  { path: "/explore", icon: "⊕", label: "Explore" },
  { path: "/create-project", icon: "✚", label: "Post" },
  { path: "/messages", icon: "💬", label: "Messages" },
  { path: "/notifications", icon: "🔔", label: "Alerts" },
]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                isActive ? "text-brand" : "text-ink-3"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}