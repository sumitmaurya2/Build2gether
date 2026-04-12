import { useState } from "react"
import { Link } from "react-router-dom"


import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { GithubAuthProvider } from "firebase/auth"
import { auth } from "../firebase"



export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log(formData)
  }


async function handleGoogleSignup() {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    console.log(result.user)
  } catch (error) {
    console.log(error.message)
  }
}

async function handleGithubSignup() {
  const provider = new GithubAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    console.log(result.user)
  } catch (error) {
    console.log(error.message)
  }
}


  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
            <span className="text-cream text-xs font-display italic">B</span>
          </div>
          <span className="font-sans font-semibold text-ink">
            Build<span className="text-brand">Together</span>
          </span>
        </Link>

        {/* Heading */}
        <h1 className="font-display text-4xl text-ink italic mb-2">
          Create your account
        </h1>
        <p className="text-sm text-ink-3 mb-8">
          Already have an account?{" "}
          <Link to="/login" className="text-brand hover:underline">
            Log in
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-2">Full name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
              placeholder="Min. 8 characters"
              className="border border-border rounded-xl px-4 py-3 text-sm bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <button
            type="submit"
            className="bg-ink text-cream text-sm font-medium py-3 rounded-full hover:bg-brand transition-colors mt-2"
          >
            Create account →
          </button>
          {/* Divider */}
<div className="flex items-center gap-3 my-2">
  <div className="flex-1 h-px bg-border" />
  <span className="text-xs text-ink-3">or</span>
  <div className="flex-1 h-px bg-border" />
</div>

{/* Google Button */}
<button
  type="button"
  onClick={handleGoogleSignup}
  className="flex items-center justify-center gap-3 border border-border bg-surface text-ink text-sm font-medium py-3 rounded-full hover:border-ink transition-colors"
>
  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
  Continue with Google
</button>

<button
  type="button"
  onClick={handleGithubSignup}
  className="flex items-center justify-center gap-3 border border-border bg-surface text-ink text-sm font-medium py-3 rounded-full hover:border-ink transition-colors"
>
  <img src="https://github.com/favicon.ico" className="w-4 h-4" />
  Continue with GitHub
</button>


        </form>

      </div>
    </div>
  )
}