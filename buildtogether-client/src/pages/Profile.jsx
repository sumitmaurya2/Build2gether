import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getUserByUsername } from "../api/users"
import { getUserProjects } from "../api/projects"
import { useAuth } from "../context/AuthContext"


export default function Profile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
 const [projects, setProjects] = useState([])
  const isOwnProfile = user?.uid === userData?.firebaseUid


  useEffect(() => {
    async function fetchProfile() {
  const data = await getUserByUsername(username)
  if (data.message === "User not found") {
    navigate("/home")
  } else {
    setUserData(data)
    const userProjects = await getUserProjects(data.firebaseUid)
    setProjects(userProjects)
  }
  setLoading(false)
    }
    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm text-ink-3">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate("/home")}
          className="text-sm text-ink-3 hover:text-ink transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
            <span className="text-cream text-xs font-display italic">B</span>
          </div>
          <span className="font-sans font-semibold text-ink">
            Build<span className="text-brand">Together</span>
          </span>
        </div>
        <div className="w-16" />
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        {/* Profile header */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start justify-between mb-4">
  <div className="w-16 h-16 rounded-full bg-ink flex items-center justify-center text-cream text-2xl font-medium">
    {userData.name?.charAt(0).toUpperCase()}
  </div>
  {isOwnProfile && (
    <button
      onClick={() => navigate("/edit-profile")}
      className="text-xs border border-border text-ink-2 px-4 py-2 rounded-full hover:border-ink transition-colors"
    >
      Edit profile
    </button>
  )}
</div>
            
          </div>

          <h1 className="font-semibold text-ink text-xl mb-0.5">{userData.name}</h1>
          <p className="text-sm text-ink-3 mb-3">
            @{userData.username} · {userData.role}
          </p>

          {userData.bio && (
            <p className="text-sm text-ink-2 leading-relaxed mb-4">
              {userData.bio}
            </p>
          )}

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {userData.skills?.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-surface-2 border border-border text-ink-2 px-3 py-1.5 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Projects", value: "0" },
            { label: "Collaborations", value: "0" },
            { label: "Builder Score", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-border rounded-2xl p-4 text-center">
              <p className="text-2xl font-mono font-semibold text-ink mb-1">{stat.value}</p>
              <p className="text-xs text-ink-3">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Projects placeholder */}
     <div className="flex flex-col gap-4">
  <h2 className="font-semibold text-ink text-sm px-1">Projects</h2>

  {projects.length === 0 ? (
    <div className="bg-surface border border-border rounded-2xl p-8 text-center">
      <p className="text-2xl mb-2">📦</p>
      <p className="font-semibold text-ink text-sm mb-1">No projects yet</p>
      <p className="text-xs text-ink-3">Projects will show here</p>
    </div>
  ) : (
    projects.map((project) => (
      <div key={project._id} className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-ink">{project.title}</h3>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
            project.stage === "idea"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : project.stage === "building"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}>
            {project.stage}
          </span>
        </div>
        <p className="text-sm text-ink-3 mb-3 leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.skills.map((skill) => (
            <span key={skill} className="text-xs bg-surface-2 border border-border text-ink-2 px-2.5 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>
    ))
  )}
</div>

      </div>
    </div>
  )
}