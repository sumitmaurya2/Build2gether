import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser } from "../api/users"
import { getUserProjects } from "../api/projects"
import { getProjectRequests, updateRequestStatus } from "../api/joinRequests"
import AppNavbar from "../components/AppNavbar"

export default function Requests() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchRequests() {
      try {
      const profile = await getUser(user.uid)
      setUserData(profile)
      const projects = await getUserProjects(profile.firebaseUid)

      // Har project ki requests fetch karo
      const allRequests = []
      for (const project of projects) {
        const projectRequests = await getProjectRequests(project._id)
        projectRequests.forEach((req) => {
          allRequests.push({ ...req, projectTitle: project.title })
        })
      }

      // Sirf pending dikhao
      setRequests(allRequests.filter(r => r.status === "pending"))
      } catch {
        setError("Requests load nahi ho sake. Dobara try karein.")
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [user.uid])

async function handleAccept(requestId, projectId) {
  try {
    await updateRequestStatus(requestId, "accepted")
    setRequests((items) => items.filter(r => r._id !== requestId))
    navigate(`/project-room/${projectId}`)
  } catch {
    setError("Request update nahi ho saki. Dobara try karein.")
  }
}



  async function handleReject(requestId) {
    try {
      await updateRequestStatus(requestId, "rejected")
      setRequests((items) => items.filter(r => r._id !== requestId))
    } catch {
      setError("Request update nahi ho saki. Dobara try karein.")
    }
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Navbar */}
      <AppNavbar userData={userData} unreadCount={0} />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-24 md:pb-12">

        <h1 className="font-display text-4xl text-ink italic mb-2">
          Join requests
        </h1>
        <p className="text-sm text-ink-3 mb-8">
          People who want to join your projects
        </p>
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {loading ? (
          <p className="text-sm text-ink-3">Loading...</p>
        ) : requests.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="font-semibold text-ink text-sm mb-1">No pending requests</p>
            <p className="text-xs text-ink-3">Requests will show here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-surface border border-border rounded-2xl p-5">

                {/* Project name */}
                <p className="text-xs font-mono text-ink-3 mb-3">
                  {request.projectTitle}
                </p>

                {/* Sender info */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-cream text-sm font-medium cursor-pointer"
                    onClick={() => navigate(`/profile/${request.sender?.username}`)}
                  >
                    {request.sender?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold text-ink cursor-pointer hover:text-brand transition-colors"
                      onClick={() => navigate(`/profile/${request.sender?.username}`)}
                    >
                      {request.sender?.name}
                    </p>
                    <p className="text-xs text-ink-3">
                      @{request.sender?.username} · {request.sender?.role}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {request.sender?.skills?.slice(0, 4).map((skill) => (
                    <span key={skill} className="text-xs bg-surface-2 border border-border text-ink-2 px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Message */}
                {request.message && (
                  <p className="text-sm text-ink-2 bg-surface-2 rounded-xl px-4 py-3 mb-4 leading-relaxed">
                    "{request.message}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                 <button
  onClick={() => handleAccept(request._id, request.project)}
  className="flex-1 text-sm bg-ink text-cream py-2.5 rounded-full hover:bg-brand transition-colors"
>
  Accept
</button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="flex-1 text-sm border border-border text-ink-2 py-2.5 rounded-full hover:border-red-300 hover:text-red-500 transition-colors"
                  >
                    Reject
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
