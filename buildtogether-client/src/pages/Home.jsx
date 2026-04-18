import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser } from "../api/users"
import { getProjects } from "../api/projects"
import { getNotifications } from "../api/notifications"
import { sendJoinRequest } from "../api/joinRequests"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import AppNavbar from "../components/AppNavbar"

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [projects, setProjects] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const observerRef = useRef(null)
  const sentinelRef = useRef(null)

  useEffect(() => {
    async function fetchData() {
  const [data, notifs, projectsData] = await Promise.all([
    getUser(user.uid),
    getNotifications(user.uid),
    getProjects(1),
  ])
  setUserData(data)
  setUnreadCount(notifs.filter(n => !n.read).length)
  setProjects(projectsData.projects || [])
  setHasMore(projectsData.hasMore || false)
  setInitialLoading(false)
}
    fetchData()
  }, [user])

  async function loadMore() {
    if (!hasMore || loadingMore) return
    setLoadingMore(true)
    const nextPage = page + 1
    const data = await getProjects(nextPage)
    setProjects(prev => [...prev, ...data.projects])
    setHasMore(data.hasMore)
    setPage(nextPage)
    setLoadingMore(false)
  }

  useEffect(() => {
    if (!hasMore || loadingMore || initialLoading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [hasMore, loadingMore, page, initialLoading])

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sm text-ink-3">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <AppNavbar userData={userData} unreadCount={unreadCount} />

      <div className="max-w-5xl mx-auto px-4 pt-20 pb-24 md:pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left sidebar */}
        <div className="hidden md:block">
          <div className="bg-surface border border-border rounded-2xl p-5 sticky top-20">
            <div
              className="w-12 h-12 rounded-full bg-ink flex items-center justify-center text-cream font-medium text-lg mb-3 cursor-pointer"
              onClick={() => navigate(`/profile/${userData?.username}`)}
            >
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-ink text-sm">{userData?.name}</p>
            <p className="text-xs text-ink-3 mb-3">
              @{userData?.username || "—"} · {userData?.role || "—"}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {userData?.skills?.slice(0, 4).map((skill) => (
                <span key={skill} className="text-[10px] bg-surface-2 border border-border text-ink-2 px-2 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
            <button
              onClick={() => signOut(auth)}
              className="text-xs text-ink-3 hover:text-brand transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="md:col-span-2 flex flex-col gap-4">

          {/* Post project button */}
          <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-cream text-xs font-medium shrink-0">
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={() => navigate("/create-project")}
              className="flex-1 text-left text-sm text-ink-3 bg-surface-2 rounded-full px-4 py-2.5 hover:border-ink border border-border transition-colors"
            >
              Post a project...
            </button>
          </div>

          {/* Projects */}
          {projects.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center">
              <p className="text-3xl mb-3">🚀</p>
              <p className="font-semibold text-ink mb-1">No projects yet</p>
              <p className="text-sm text-ink-3">Be the first to post a project</p>
            </div>
          ) : (
            <>
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  currentUser={user}
                  userData={userData}
                />
              ))}

              {/* Sentinel — infinite scroll trigger */}
              <div ref={sentinelRef} className="py-2" />

              {loadingMore && (
                <p className="text-center text-xs text-ink-3 py-4">
                  Loading more...
                </p>
              )}

              {!hasMore && projects.length > 0 && (
                <p className="text-center text-xs text-ink-3 py-4">
                  You've seen all projects
                </p>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, currentUser, userData }) {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const isOwnProject = project.postedBy?._id === userData?._id
  const isMember = project.members?.some(
    m => m.toString() === userData?._id?.toString()
  )

  async function handleSendRequest() {
    try {
      await sendJoinRequest(currentUser.uid, project._id, message)
      setSent(true)
      setShowModal(false)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 hover:border-ink/20 hover:shadow-sm transition-all">

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
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
          <h3
            className="font-semibold text-ink cursor-pointer hover:text-brand transition-colors"
            onClick={() => navigate(`/project/${project._id}`)}
          >
            {project.title}
          </h3>
        </div>
      </div>

      <p className="text-sm text-ink-3 mb-4 leading-relaxed line-clamp-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.skills.map((skill) => (
          <span key={skill} className="text-xs bg-surface-2 border border-border text-ink-2 px-2.5 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate(`/profile/${project.postedBy?.username}`)}
        >
          <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center text-cream text-xs">
            {project.postedBy?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-ink-3 group-hover:text-brand transition-colors">
            {project.postedBy?.name}
          </span>
          {project.timeline && (
            <span className="text-xs text-ink-3">· {project.timeline}</span>
          )}
        </div>

        {isOwnProject || isMember ? (
          <button
            onClick={() => navigate(`/project-room/${project._id}`)}
            className="text-xs bg-brand text-white px-4 py-1.5 rounded-full hover:bg-ink transition-colors"
          >
            Open room →
          </button>
        ) : sent ? (
          <span className="text-xs text-green-600 font-medium">Request sent ✓</span>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="text-xs bg-ink text-cream px-4 py-1.5 rounded-full hover:bg-brand transition-colors"
          >
            Show interest →
          </button>
        )}
      </div>

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