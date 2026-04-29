import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GithubAuthProvider, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { findOrCreateUser } from "../api/users"
import { useAuth } from "../context/AuthContext"
import { auth } from "../firebase"
import { getDisplayName, getNextRoute, writePendingEmail } from "../utils/authFlow"

const LOGIN_ATTEMPT_LIMIT = 5
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000

function readLoginAttempts(email) {
  const key = `bt_login_attempts:${email}`
  const attempts = JSON.parse(window.localStorage.getItem(key) || "[]")
  const now = Date.now()
  return attempts.filter((timestamp) => now - timestamp < LOGIN_ATTEMPT_WINDOW_MS)
}

function writeLoginAttempts(email, attempts) {
  window.localStorage.setItem(`bt_login_attempts:${email}`, JSON.stringify(attempts))
}

function clearLoginAttempts(email) {
  window.localStorage.removeItem(`bt_login_attempts:${email}`)
}

export default function Login() {
  const navigate = useNavigate()
  const { setUserProfile } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)
    const email = formData.email.trim().toLowerCase()

    try {
      const attempts = readLoginAttempts(email)
      if (attempts.length >= LOGIN_ATTEMPT_LIMIT) {
        setError("Bahut attempts ho gaye. 15 minutes baad dobara try karo.")
        setLoading(false)
        return
      }

      const result = await signInWithEmailAndPassword(auth, email, formData.password)
      clearLoginAttempts(email)
      // Email login should also recover if the backend profile was not created earlier.
      const profile = await findOrCreateUser(result.user, getDisplayName(result.user))
      setUserProfile(profile)
      writePendingEmail(result.user.email || email)
      navigate(getNextRoute(result.user, profile), { replace: true })
    } catch (error) {
      if (email) {
        writeLoginAttempts(email, [...readLoginAttempts(email), Date.now()])
      }

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

  async function handlePasswordReset() {
    setError("")
    setMessage("")

    const email = formData.email.trim().toLowerCase()
    if (!email) {
      setError("Password reset ke liye email daalo")
      return
    }

    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage("Password reset link bhej diya gaya hai. Link expire hone se pehle use kar lena.")
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setError("Valid email daalo")
      } else {
        setError("Password reset email bhejne mein problem aayi")
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
      const profile = await findOrCreateUser(result.user, getDisplayName(result.user))

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

      const profile = await findOrCreateUser(result.user, getDisplayName(result.user))

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
          {message ? (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
              {message}
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
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={loading}
              className="text-sm font-medium text-ink-3 transition-colors hover:text-brand disabled:opacity-70"
            >
              Forgot password?
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
