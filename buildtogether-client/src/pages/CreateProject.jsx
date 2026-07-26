import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { createProject } from "../api/projects"

const SKILLS = [
  "React", "Node.js", "Python", "MongoDB", "Firebase",
  "UI/UX", "Figma", "Flutter", "Machine Learning", "Django",
  "PostgreSQL", "TypeScript", "Next.js", "DevOps", "AWS"
]

const ROLES = ["developer", "designer", "founder", "marketer", "product", "student"]

export default function CreateProject() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    rolesNeeded: [],
    teamSize: 1,
    timeline: "",
    budget: "unpaid",
    stage: "idea",
  })

  function handleSkillToggle(skill) {
    const already = formData.skills.includes(skill)
    if (already) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
  }

  function handleRoleToggle(role) {
    const already = formData.rolesNeeded.includes(role)
    if (already) {
      setFormData({ ...formData, rolesNeeded: formData.rolesNeeded.filter(r => r !== role) })
    } else {
      setFormData({ ...formData, rolesNeeded: [...formData.rolesNeeded, role] })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Project title aur description bharna zaroori hai.")
      return
    }
    if (formData.skills.length === 0 || formData.rolesNeeded.length === 0) {
      setError("Kam se kam ek skill aur ek required role select karein.")
      return
    }
    setLoading(true)
    try {
      await createProject({ ...formData, firebaseUid: user.uid })
      navigate("/home")
    } catch (error) {
      setError(error.message || "Project post nahi ho saka. Dobara try karein.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-12 pb-28 md:pb-12">
      <div className="max-w-xl mx-auto">

        <button
          onClick={() => navigate("/home")}
          className="text-sm text-ink-3 hover:text-ink mb-8 flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>

        <h1 className="font-display text-4xl text-ink italic mb-2">
          Post a project
        </h1>
        <p className="text-sm text-ink-3 mb-10">
          Tell builders what you're working on
        </p>
        {error && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Project title</label>
            <input
              type="text"
              placeholder="e.g. AI Resume Builder for students"
              value={formData.title}
              required
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Description</label>
            <textarea
              placeholder="What are you building? What problem does it solve?"
              value={formData.description}
              required
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors resize-none"
            />
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-2">Skills required</label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    formData.skills.includes(skill)
                      ? "bg-brand text-white border-brand"
                      : "bg-surface text-ink-2 border-border hover:border-ink"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Roles needed */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-2">Roles needed</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleToggle(role)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all capitalize ${
                    formData.rolesNeeded.includes(role)
                      ? "bg-ink text-cream border-ink"
                      : "bg-surface text-ink-2 border-border hover:border-ink"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Team size + Timeline */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-2">Team size needed</label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
                className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink focus:outline-none focus:border-ink transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-2">Timeline</label>
              <input
                type="text"
                placeholder="e.g. 30 days"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-2">Budget</label>
            <div className="flex gap-3">
              {["unpaid", "paid", "equity"].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFormData({ ...formData, budget: b })}
                  className={`px-4 py-2 rounded-full text-sm border transition-all capitalize ${
                    formData.budget === b
                      ? "bg-ink text-cream border-ink"
                      : "bg-surface text-ink-2 border-border hover:border-ink"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Stage */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-2">Project stage</label>
            <div className="flex gap-3">
              {["idea", "building", "launched"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, stage: s })}
                  className={`px-4 py-2 rounded-full text-sm border transition-all capitalize ${
                    formData.stage === s
                      ? "bg-brand text-white border-brand"
                      : "bg-surface text-ink-2 border-border hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-ink text-cream text-sm font-medium py-3 rounded-full hover:bg-brand transition-colors"
          >
            Post project →
          </button>

        </form>
      </div>
    </div>
  )
}
