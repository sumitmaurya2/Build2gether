import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { createUser, getUser } from "../api/users"
import { useAuth } from "../context/AuthContext"
import { auth } from "../firebase"
import { getDisplayName, getNextRoute, writePendingEmail } from "../utils/authFlow"

export default function Login() {
  const navigate = useNavigate()
  const { setUserProfile } = useAuth()
  const [formData, setFormData] = useState({
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
    setLoading(true)

    try {
      const email = formData.email.trim().toLowerCase()
      const result = await signInWithEmailAndPassword(auth, email, formData.password)
      const profile = await getUser(result.user.uid)
      setUserProfile(profile)
      writePendingEmail(result.user.email || email)
      navigate(getNextRoute(result.user, profile), { replace: true })
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setError("Email ya password sahi nahi hai")
      } else if (error.code === "auth/invalid-email") {
        setError("Valid email daalo")
      } else {
        setError(error.message || "Login nahi ho paya")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider()
    setError("")
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, provider)
      const profile = await createUser(
        result.user.uid,
        getDisplayName(result.user),
        result.user.email
      )

      setUserProfile(profile)
      writePendingEmail("")
      navigate(getNextRoute(result.user, profile), { replace: true })
    } catch (error) {
      setError(error.message || "Google login complete nahi ho paya")
    } finally {
      setLoading(false)
    }
  }

  async function handleGithubLogin() {
    const provider = new GithubAuthProvider()
    provider.addScope("user:email")
    setError("")
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, provider)
      if (!result.user.email) {
        throw new Error("GitHub account se public email nahi mili. GitHub email visible karke phir try karo.")
      }

      const profile = await createUser(
        result.user.uid,
        getDisplayName(result.user),
        result.user.email
      )

      setUserProfile(profile)
      writePendingEmail("")
      navigate(getNextRoute(result.user, profile), { replace: true })
    } catch (error) {
      setError(error.message || "GitHub login complete nahi ho paya")
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
            Welcome back
          </h1>
          <p className="mt-2 mb-8 text-sm leading-6 text-ink-3">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-brand hover:underline">
              Sign up
            </Link>
          </p>

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                placeholder="Your password"
                className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-ink py-3 text-sm font-medium text-cream transition-colors hover:bg-brand disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Log in ->"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-ink-3">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-ink disabled:opacity-70"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={loading}
              className="flex items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-ink disabled:opacity-70"
            >
              <img src="https://github.com/favicon.ico" className="w-4 h-4" />
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
