import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { sendEmailVerification } from "firebase/auth"
import { useAuth } from "../context/AuthContext"
import { auth } from "../firebase"
import { getNextRoute, readPendingEmail, requiresEmailVerification, writePendingEmail } from "../utils/authFlow"

export default function VerifyEmail() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const [displayEmail, setDisplayEmail] = useState(() => readPendingEmail())

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true })
      return undefined
    }

    const nextEmail = user.email || readPendingEmail()
    setDisplayEmail(nextEmail)
    writePendingEmail(nextEmail)

    if (!requiresEmailVerification(user)) {
      writePendingEmail("")
      navigate(getNextRoute(user, userProfile), { replace: true })
      return undefined
    }

    const interval = setInterval(async () => {
      if (!auth.currentUser) {
        clearInterval(interval)
        navigate("/login", { replace: true })
        return
      }

      await auth.currentUser.reload()
      if (auth.currentUser.emailVerified) {
        writePendingEmail("")
        clearInterval(interval)
        navigate("/profile-setup", { replace: true })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [navigate, user, userProfile])

  async function handleResendEmail() {
    setMessage("")
    setError("")
    setSending(true)

    try {
      if (!auth.currentUser) {
        throw new Error("Session expire ho gayi. Please login again.")
      }

      await sendEmailVerification(auth.currentUser)
      setMessage("Verification email dobara bhej di gayi hai.")
    } catch (error) {
      setError(error.message || "Verification email resend nahi ho payi")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg items-center">
        <div className="w-full rounded-[28px] border border-border bg-surface p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">
            @
          </div>
          <h1 className="font-display text-3xl italic text-ink sm:text-4xl">
            Check your email
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-3">
            We sent a verification link to
          </p>
          <p className="mt-1 break-all text-sm font-medium text-ink sm:text-base">
            {displayEmail || user?.email}
          </p>
          <p className="mt-6 text-xs leading-5 text-ink-3 sm:text-sm">
            Email verify hote hi page automatically next step par redirect ho jayega.
          </p>

          {message ? <p className="mt-5 text-sm leading-6 text-green-700">{message}</p> : null}
          {error ? <p className="mt-5 text-sm leading-6 text-red-700">{error}</p> : null}

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={sending}
              className="rounded-full bg-ink px-4 py-3 text-sm font-medium text-cream transition-colors hover:bg-brand disabled:opacity-70"
            >
              {sending ? "Sending..." : "Resend verification email"}
            </button>

            <Link
              to="/login"
              className="rounded-full border border-border px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
