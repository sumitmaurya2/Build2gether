import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser } from "../api/users"
import { searchProjects } from "../api/projects"
import AppNavbar from "../components/AppNavbar"

export default function Explore() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [projects, setProjects] = useState([])
  const [query, setQuery] = useState("")
  const [stage, setStage] = useState("")
  const [budget, setBudget] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const data = await getUser(user.uid)
      setUserData(data)
    }
    fetchUser()
    handleSearch()
  }, [])

  async function handleSearch() {
    setLoading(true)
    const data = await searchProjects(query, stage, budget)
    setProjects(data)
    setLoading(false)
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Navbar */}
     <AppNavbar userData={userData} unreadCount={0} />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, skills..."
            className="flex-1 border border-border rounded-full px-5 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
          />
          <button
            onClick={handleSearch}
            className="bg-ink text-cream text-sm px-5 py-3 rounded-full hover:bg-brand transition-colors"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Stage filter */}
          {["", "idea", "building", "launched"].map((s) => (
            <button
              key={s}
              onClick={() => { setStage(s); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                stage === s
                  ? "bg-ink text-cream border-ink"
                  : "bg-surface text-ink-2 border-border hover:border-ink"
              }`}
            >
              {s === "" ? "All stages" : s}
            </button>
          ))}

          <div className="w-px bg-border mx-1" />

          {/* Budget filter */}
          {["", "unpaid", "paid", "equity"].map((b) => (
            <button
              key={b}
              onClick={() => { setBudget(b); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                budget === b
                  ? "bg-brand text-white border-brand"
                  : "bg-surface text-ink-2 border-border hover:border-ink"
              }`}
            >
              {b === "" ? "All budgets" : b}
            </button>
          ))}
        </div>

        {/* Apply filters button */}
        <button
          onClick={handleSearch}
          className="w-full border border-border text-ink-2 text-sm py-2.5 rounded-full hover:border-ink transition-colors mb-6"
        >
          Apply filters
        </button>

        {/* Results */}
        {loading ? (
          <p className="text-sm text-ink-3 text-center py-8">Searching...</p>
        ) : projects.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <p className="font-semibold text-ink text-sm mb-1">No projects found</p>
            <p className="text-xs text-ink-3">Try different keywords or filters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-ink-3 font-mono">{projects.length} projects found</p>
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="bg-surface border border-border rounded-2xl p-5 hover:border-ink/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                      project.stage === "idea"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : project.stage === "building"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}>
                      {project.stage}
                    </span>
                    <span className="text-xs text-ink-3 font-mono">{project.budget}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-ink mb-2">{project.title}</h3>

                <p className="text-sm text-ink-3 mb-3 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-surface-2 border border-border text-ink-2 px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 border-t border-border pt-3">
                  <div className="w-5 h-5 rounded-full bg-ink flex items-center justify-center text-cream text-[10px]">
                    {project.postedBy?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-ink-3">{project.postedBy?.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}