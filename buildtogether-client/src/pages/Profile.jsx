import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getUserByUsername, getUser } from "../api/users"
import { getUserProjects, deleteProject } from "../api/projects"
import { useAuth } from "../context/AuthContext"
import AppNavbar from "../components/AppNavbar"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { writePendingEmail, writeStoredProfile } from "../utils/authFlow"

export default function Profile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user, setUserProfile } = useAuth()
  const [userData, setUserData] = useState(null)
  const [currentUserData, setCurrentUserData] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const [profileData, currentUser] = await Promise.all([
        getUserByUsername(username),
        getUser(user.uid)
      ])

      if (profileData.message === "User not found") {
        navigate("/home")
        return
      }

      setUserData(profileData)
      setCurrentUserData(currentUser)
      const userProjects = await getUserProjects(profileData.firebaseUid)
      setProjects(userProjects)
      setLoading(false)
    }
    fetchProfile()
  }, [username, user.uid, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm text-ink-3">Loading...</p>
      </div>
    )
  }

  const isOwnProfile = currentUserData?.firebaseUid === userData?.firebaseUid

  async function handleLogout() {
    setUserProfile(null)
    writeStoredProfile(null)
    writePendingEmail("")
    await signOut(auth)
    navigate("/", { replace: true })
  }

  return (
    <div className="min-h-screen bg-cream">
      <AppNavbar userData={currentUserData} unreadCount={0} />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-24 md:pb-12">

        {/* Profile header */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-full bg-ink flex items-center justify-center text-cream text-2xl font-medium">
              {userData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {isOwnProfile ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="text-xs border border-border text-ink-2 px-3 py-2 rounded-full hover:border-ink transition-colors"
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/edit-profile")}
                    className="text-xs border border-border text-ink-2 px-3 py-2 rounded-full hover:border-ink transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs border border-red-200 text-red-600 px-3 py-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/dm/${userData?.firebaseUid}`)}
                  className="text-xs border border-border text-ink-2 px-4 py-2 rounded-full hover:border-ink transition-colors"
                >
                  Message
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

          <div className="flex flex-wrap gap-2">
            {userData.skills?.map((skill) => (
              <span key={skill} className="text-xs bg-surface-2 border border-border text-ink-2 px-3 py-1.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
          {[
            { label: "Projects", value: projects.length.toString() },
            { label: "Collaborations", value: "0" },
            { label: "Builder Score", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-border rounded-2xl p-4 text-center">
              <p className="text-2xl font-mono font-semibold text-ink mb-1">{stat.value}</p>
              <p className="text-xs text-ink-3">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Projects */}
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
              <div
                key={project._id}
                className="bg-surface border border-border rounded-2xl p-5 cursor-pointer hover:border-ink/20 transition-all"
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-ink">{project.title}</h3>
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
                    {isOwnProfile && (
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/edit-project/${project._id}`)}
                          className="text-xs text-ink-3 hover:text-ink transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm("Delete this project?")) {
                              await deleteProject(project._id)
                              setProjects(projects.filter(p => p._id !== project._id))
                            }
                          }}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
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
