import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { updateProject } from "../api/projects"
import { BASE_URL } from "../api/config"

const SKILLS = [
  "React", "Node.js", "Python", "MongoDB", "Firebase",
  "UI/UX", "Figma", "Flutter", "Machine Learning", "Django",
  "PostgreSQL", "TypeScript", "Next.js", "DevOps", "AWS"
]

const ROLES = ["developer", "designer", "founder", "marketer", "product", "student"]

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
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

  useEffect(() => {
    async function fetchProject() {
      const response = await fetch(`${BASE_URL}/api/projects/${id}`)
      const data = await response.json()
      setFormData({
        title: data.title || "",
        description: data.description || "",
        skills: data.skills || [],
        rolesNeeded: data.rolesNeeded || [],
        teamSize: data.teamSize || 1,
        timeline: data.timeline || "",
        budget: data.budget || "unpaid",
        stage: data.stage || "idea",
      })
    }
    fetchProject()
  }, [id])

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
    try {
      await updateProject(id, formData)
      navigate(-1)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-ink-3 hover:text-ink mb-8 flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>

        <h1 className="font-display text-4xl text-ink italic mb-2">
          Edit project
        </h1>
        <p className="text-sm text-ink-3 mb-10">
          Update your project details
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Project title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink focus:outline-none focus:border-ink transition-colors resize-none"
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

          {/* Roles */}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-2">Team size</label>
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
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink focus:outline-none focus:border-ink transition-colors"
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
            className="bg-ink text-cream text-sm font-medium py-3 rounded-full hover:bg-brand transition-colors"
          >
            Save changes →
          </button>

        </form>
      </div>
    </div>
  )
}