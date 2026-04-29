import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUser, updateUserProfile } from "../api/users"

const SKILLS = [
  "React", "Node.js", "Python", "MongoDB", "Firebase",
  "UI/UX", "Figma", "Flutter", "Machine Learning", "Django",
  "PostgreSQL", "TypeScript", "Next.js", "DevOps", "AWS"
]

const ROLES = ["developer", "designer", "founder", "marketer", "student", "product"]

export default function EditProfile() {
  const { user, setUserProfile } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    role: "",
    skills: [],
    bio: "",
  })

  useEffect(() => {
    async function fetchUser() {
      const data = await getUser(user.uid)
      setFormData({
        name: data.name || "",
        username: data.username || "",
        role: data.role || "",
        skills: data.skills || [],
        bio: data.bio || "",
      })
    }
    fetchUser()
  }, [user])

  function handleSkillToggle(skill) {
    const already = formData.skills.includes(skill)
    if (already) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const updatedProfile = await updateUserProfile(user.uid, formData)
      // Keep local auth state aligned so redirect logic reflects the latest profile completeness.
      setUserProfile(updatedProfile)
      navigate(`/profile/${updatedProfile.username}`)
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
          Edit profile
        </h1>
        <p className="text-sm text-ink-3 mb-10">
          Update your builder identity
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Full name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-2">Your role</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`px-4 py-2 rounded-full text-sm border transition-all capitalize ${
                    formData.role === role
                      ? "bg-ink text-cream border-ink"
                      : "bg-surface text-ink-2 border-border hover:border-ink"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-2">Skills</label>
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

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink focus:outline-none focus:border-ink transition-colors resize-none"
            />
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
