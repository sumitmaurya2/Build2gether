import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { updateUserProfile } from "../api/users"
import { useAuth } from "../context/AuthContext"

const ROLES = ["developer", "designer", "founder", "marketer", "student", "product"]

const SKILLS = [
  "React", "Node.js", "Python", "MongoDB", "Firebase",
  "UI/UX", "Figma", "Flutter", "Machine Learning", "Django",
  "PostgreSQL", "TypeScript", "Next.js", "DevOps", "AWS"
]

export default function ProfileSetup() {
  const { user, userProfile, setUserProfile } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    role: "",
    skills: [],
    bio: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userProfile) {
      return
    }

    setFormData({
      username: userProfile.username || "",
      role: userProfile.role || "",
      skills: userProfile.skills || [],
      bio: userProfile.bio || "",
    })
  }, [userProfile])

  function handleRoleSelect(role) {
    setFormData({ ...formData, role })
  }

  function handleSkillToggle(skill) {
    const already = formData.skills.includes(skill)
    if (already) {
      setFormData({ ...formData, skills: formData.skills.filter((item) => item !== skill) })
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!formData.username.trim()) {
      setError("Username zaroori hai")
      return
    }

    if (!formData.role) {
      setError("Apna role select karo")
      return
    }

    if (formData.skills.length === 0) {
      setError("Kam se kam ek skill select karo")
      return
    }

    setLoading(true)

    try {
      const updatedProfile = await updateUserProfile(user.uid, {
        ...formData,
        username: formData.username.trim(),
        bio: formData.bio.trim(),
      })
      setUserProfile(updatedProfile)
      navigate("/home", { replace: true })
    } catch (error) {
      setError(error.message || "Profile save nahi ho payi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-border bg-surface p-6 shadow-sm sm:p-8 lg:p-10">
        <h1 className="font-display text-3xl italic text-ink sm:text-4xl">
          Set up your profile
        </h1>
        <p className="mt-2 mb-8 text-sm leading-6 text-ink-3 sm:text-base">
          Tell us who you are as a builder
        </p>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Username</label>
            <input
              type="text"
              placeholder="e.g. sumit_builds"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-2">Your role</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
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

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-2">
              Your skills
              <span className="ml-2 font-normal text-ink-3">select all that apply</span>
            </label>
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Bio</label>
            <textarea
              placeholder="What are you building? What excites you?"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink py-3 text-sm font-medium text-cream transition-colors hover:bg-brand disabled:opacity-70 sm:w-auto sm:min-w-56"
          >
            {loading ? "Saving..." : "Complete profile ->"}
          </button>
        </form>
      </div>
    </div>
  )
}
