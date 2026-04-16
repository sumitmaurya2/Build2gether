import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth"
import { createUser } from "../api/users"
import { useAuth } from "../context/AuthContext"
import { auth } from "../firebase"
import { getDisplayName, writePendingEmail } from "../utils/authFlow"

export default function Signup() {
  const navigate = useNavigate()
  const { setUserProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    const trimmedName = formData.name.trim()
    const normalizedEmail = formData.email.trim().toLowerCase()

    if (!trimmedName || !normalizedEmail || !formData.password) {
      setError("Name, email, aur password sab bharna zaroori hai")
      return
    }

    setLoading(true)

    try {
      const result = await createUserWithEmailAndPassword(auth, normalizedEmail, formData.password)
      const profile = await createUser(result.user.uid, trimmedName, normalizedEmail)
      setUserProfile(profile)
      writePendingEmail(normalizedEmail)
      await sendEmailVerification(result.user)
      navigate("/verify-email", { replace: true })
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Ye email already registered hai")
      } else if (error.code === "auth/weak-password") {
        setError("Password kam se kam 6 characters ka hona chahiye")
      } else if (error.code === "auth/invalid-email") {
        setError("Valid email daalo")
      } else {
        setError(error.message || "Kuch galat hua, dobara try karo")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignup() {
    const provider = new GoogleAuthProvider()
    setError("")
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, provider)
      const profile = await createUser(result.user.uid, getDisplayName(result.user), result.user.email)
      setUserProfile(profile)
      writePendingEmail("")
      navigate(profile.profileComplete ? "/home" : "/profile-setup", { replace: true })
    } catch (error) {
      setError(error.message || "Google signup complete nahi ho paya")
    } finally {
      setLoading(false)
    }
  }

  async function handleGithubSignup() {
    const provider = new GithubAuthProvider()
    provider.addScope("user:email")
    setError("")
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, provider)
      if (!result.user.email) {
        throw new Error("GitHub account se public email nahi mili. GitHub email visible karke phir try karo.")
      }

      const profile = await createUser(result.user.uid, getDisplayName(result.user), result.user.email)
      setUserProfile(profile)
      writePendingEmail("")
      navigate(profile.profileComplete ? "/home" : "/profile-setup", { replace: true })
    } catch (error) {
      setError(error.message || "GitHub signup complete nahi ho paya")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <div className="w-full rounded-[28px] border border-border bg-surface p-6 shadow-sm sm:p-8">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
              <span className="text-cream text-xs font-display italic">B</span>
            </div>
            <span className="font-sans font-semibold text-ink">
              Build<span className="text-brand">Together</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl text-ink italic sm:text-4xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-3 mb-8">
            Already have an account?{" "}
            <Link to="/login" className="text-brand hover:underline">
              Log in
            </Link>
          </p>

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-2">Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Sumit Kumar"
                className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-ink py-3 text-sm font-medium text-cream transition-colors hover:bg-brand disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create account ->"}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-ink-3">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="flex items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-ink disabled:opacity-70"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleGithubSignup}
              disabled={loading}
              className="flex items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-ink disabled:opacity-70"
            >
              <img src="https://github.com/favicon.ico" className="w-4 h-4" />
              Continue with GitHub
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
