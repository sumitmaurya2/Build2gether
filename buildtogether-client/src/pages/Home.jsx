import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser } from "../api/users"
import { getProjects } from "../api/projects"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"

import { Users, Clock, ArrowUpRight, Zap, Target, IndianRupee } from 'lucide-react';


export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    async function fetchData() {
      const data = await getUser(user.uid)
      setUserData(data)
      const projectsData = await getProjects()
      setProjects(projectsData)
    }
    fetchData()
  }, [user])

  return (
    <div className="min-h-screen bg-cream">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
            <span className="text-cream text-xs font-display italic">B</span>
          </div>
          <span className="font-sans font-semibold text-ink">
            Build<span className="text-brand">Together</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink-3">{userData?.name}</span>
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-cream text-xs font-medium">
            {userData?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* Layout */}
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left sidebar */}
        <div className="hidden md:block">
          <div className="bg-surface border border-border rounded-2xl p-5 sticky top-20">
            <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center text-cream font-medium text-lg mb-3">
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
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          )}

        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
    // Budget icon helper
  const getBudgetIcon = (budget) => {
    switch (budget) {
      case 'paid': return <IndianRupee className="w-3 h-3 text-green-600" />;
      case 'equity': return <Zap className="w-3 h-3 text-purple-600" />;
      default: return <Target className="w-3 h-3 text-ink-3" />; // unpaid
    }
  };
return (
    <div className="group bg-surface border border-border rounded-2xl p-5 hover:border-ink/30 hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden">
      
      {/* 1. Header: Status & Budget (Instant Context) */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Stage Badge */}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            project.stage === "idea"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : project.stage === "building"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}>
            {project.stage}
          </span>
          
          {/* Closed Status Badge (If applicable) */}
          {project.status === 'closed' && (
             <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-red-50 text-red-700 border-red-200">
               Closed
             </span>
          )}
        </div>

        {/* Budget Badge */}
        <div className="flex items-center gap-1.5 bg-surface-2 border border-border px-2.5 py-1 rounded-full">
          {getBudgetIcon(project.budget)}
          <span className="text-xs font-medium text-ink-2 capitalize">
            {project.budget}
          </span>
        </div>
      </div>

      {/* 2. Main Content: Title & Description */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-ink mb-1 group-hover:text-brand transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-ink-3 leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* 3. Roles & Skills (What are they looking for?) */}
      <div className="mb-6 flex-grow">
        {project.rolesNeeded && project.rolesNeeded.length > 0 && (
          <div className="mb-3">
            <span className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-1.5 block">
              Looking For
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.rolesNeeded.slice(0, 3).map((role) => (
                <span key={role} className="text-xs font-medium bg-brand/10 text-brand border border-brand/20 px-2.5 py-1 rounded-md">
                  {role}
                </span>
              ))}
              {project.rolesNeeded.length > 3 && (
                <span className="text-xs font-medium text-ink-3 px-1 py-1">
                  +{project.rolesNeeded.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Optional: Show 1-2 key skills if space permits */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {project.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-[11px] bg-surface-2 border border-border text-ink-2 px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. Footer: Meta & CTA */}
      <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
        <div className="flex flex-col gap-1">
          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-ink flex items-center justify-center text-cream text-[10px] font-bold">
              {project.postedBy?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="text-xs font-medium text-ink-2 truncate max-w-[100px]">
              {project.postedBy?.name || 'Anonymous'}
            </span>
          </div>
          
{/* Timeline & Team Size */}
<div className="flex items-center gap-3 text-xs text-ink-3 mt-1">
  <div className="flex items-center gap-1" title="Team Size">
    <Users className="w-3 h-3" />
    <span>{project.members?.length || 0}/{project.teamSize}</span>
  </div>
  
  {/* Yahan changes kiye hain */}
  {project.timeline && (
    <div className="flex items-center gap-1.5 bg-surface-2 px-2 py-0.5 rounded-md" title="Project Duration">
      <Clock className="w-3 h-3" />
      <span className="truncate max-w-[110px]">
        Duration: <span className="font-medium text-ink-2">{project.timeline}</span>
      </span>
    </div>
  )}
</div>
        </div>

        {/* CTA Button */}
        <button className="flex items-center gap-1 text-sm font-medium bg-ink text-cream px-4 py-2 rounded-full hover:bg-ink-2 transition-colors active:scale-95">
          Join 
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}