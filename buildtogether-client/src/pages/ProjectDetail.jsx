import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser } from "../api/users"
import { getProjectById } from "../api/projects"
import { sendJoinRequest } from "../api/joinRequests"
import AppNavbar from "../components/AppNavbar"

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const [projectData, currentUser] = await Promise.all([
        getProjectById(id),
        getUser(user.uid)
      ])
      setProject(projectData)
      setUserData(currentUser)
      setLoading(false)
    }
    fetchData()
  }, [id, user.uid])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm text-ink-3">Loading...</p>
      </div>
    )
  }

  const isOwnProject = project.postedBy?._id === userData?._id
  const isMember = project.members?.some(
    m => m._id?.toString() === userData?._id?.toString()
  )

  async function handleSendRequest() {
    try {
      await sendJoinRequest(user.uid, project._id, message)
      setSent(true)
      setShowModal(false)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Navbar */}
      <AppNavbar userData={userData} unreadCount={0} />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
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
              {project.timeline && (
                <span className="text-xs text-ink-3 font-mono">· {project.timeline}</span>
              )}
            </div>
          </div>

          <h1 className="font-display text-3xl text-ink italic mb-3">
            {project.title}
          </h1>

          <p className="text-sm text-ink-2 leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.skills.map((skill) => (
              <span key={skill} className="text-xs bg-surface-2 border border-border text-ink-2 px-3 py-1.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>

          {/* Roles needed */}
          {project.rolesNeeded?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs text-ink-3 mb-2">Looking for</p>
              <div className="flex flex-wrap gap-2">
                {project.rolesNeeded.map((role) => (
                  <span key={role} className="text-xs bg-ink text-cream px-3 py-1.5 rounded-full capitalize">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          {isOwnProject || isMember ? (
            <button
              onClick={() => navigate(`/project-room/${project._id}`)}
              className="w-full bg-brand text-white text-sm font-medium py-3 rounded-full hover:bg-ink transition-colors"
            >
              Open project room →
            </button>
          ) : sent ? (
            <div className="w-full text-center py-3 text-sm text-green-600 font-medium bg-green-50 rounded-full">
              Request sent ✓
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-ink text-cream text-sm font-medium py-3 rounded-full hover:bg-brand transition-colors"
            >
              Show interest →
            </button>
          )}
        </div>

        {/* Posted by */}
        <div
          className="bg-surface border border-border rounded-2xl p-5 mb-4 flex items-center gap-4 cursor-pointer hover:border-ink/20 transition-all"
          onClick={() => navigate(`/profile/${project.postedBy?.username}`)}
        >
          <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-cream font-medium shrink-0">
            {project.postedBy?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-ink-3 mb-0.5">Posted by</p>
            <p className="font-semibold text-ink text-sm">{project.postedBy?.name}</p>
            <p className="text-xs text-ink-3">@{project.postedBy?.username} · {project.postedBy?.role}</p>
          </div>
        </div>

        {/* Team members */}
        {project.members?.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-xs text-ink-3 mb-4">Team members · {project.members.length}</p>
            <div className="flex flex-col gap-3">
              {project.members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => navigate(`/profile/${member.username}`)}
                >
                  <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-cream text-xs font-medium shrink-0">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink group-hover:text-brand transition-colors">
                      {member.name}
                    </p>
                    <p className="text-xs text-ink-3">@{member.username} · {member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center px-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold text-ink mb-1">Send join request</h3>
            <p className="text-xs text-ink-3 mb-4">
              Tell the owner why you want to join
            </p>
            <textarea
              rows={3}
              placeholder="I can help with the frontend..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-surface-2 text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 text-sm border border-border text-ink-2 py-2.5 rounded-full hover:border-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="flex-1 text-sm bg-ink text-cream py-2.5 rounded-full hover:bg-brand transition-colors"
              >
                Send request →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
