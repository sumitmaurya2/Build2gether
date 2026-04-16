import { useEffect, useMemo, useRef, useState } from "react"
import { signOut } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { auth } from "../firebase"
import { isProfileComplete, writePendingEmail, writeStoredProfile } from "../utils/authFlow"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const mobileProfileRef = useRef(null)
  const navigate = useNavigate()
  const { user, userProfile, setUserProfile } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileOpen && !profileRef.current?.contains(event.target)) {
        setProfileOpen(false)
      }
      if (menuOpen && !mobileProfileRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [profileOpen, menuOpen])

  const isLoggedIn = Boolean(user)
  const profileComplete = isProfileComplete(userProfile)

  const profileLabel = useMemo(() => {
    const base = userProfile?.name || userProfile?.username || user?.email || "User"
    const initial = base.trim().charAt(0).toUpperCase()
    return initial || "U"
  }, [user, userProfile])

  async function handleLogout() {
    setProfileOpen(false)
    setMenuOpen(false)
    setUserProfile(null)
    writeStoredProfile(null)
    writePendingEmail("")
    await signOut(auth)
    navigate("/", { replace: true })
  }

  // Common SVG Icons for UI polish
  const Icons = {
    Profile: (
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    Setup: (
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738a1.125 1.125 0 0 1-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.44.315-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    Logout: (
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
      </svg>
    )
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to={isLoggedIn && profileComplete ? "/home" : "/"} 
          className="flex items-center gap-2 group rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 focus:ring-offset-surface transition-shadow"
        >
          <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-sm">
            <span className="text-cream text-sm font-display italic">B</span>
          </div>
          <span className="font-sans font-bold text-ink tracking-tight text-lg">
            Build<span className="text-brand">Together</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {["How it works", "Features", "Community"].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '')}`} 
              className="text-sm font-medium text-ink-3 hover:text-ink transition-colors focus:outline-none focus:text-brand"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-cream shadow-sm ring-2 ring-transparent hover:ring-brand/50 focus:outline-none focus:ring-brand transition-all hover:scale-105 active:scale-95"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-label="Open user menu"
                title={userProfile?.name || user?.email || "Profile"}
              >
                {profileLabel}
              </button>

              {/* Profile Dropdown */}
              <div 
                className={`absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl origin-top-right transition-all duration-200 ease-out ${
                  profileOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="px-4 py-3 border-b border-border bg-ink/5">
                  <p className="text-sm font-semibold text-ink truncate">
                    {userProfile?.name || userProfile?.username || user?.email || "User"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`h-2 w-2 rounded-full ${profileComplete ? "bg-green-500" : "bg-yellow-400"}`} />
                    <p className="text-xs text-ink-3">
                      {profileComplete ? "Profile complete" : "Setup required"}
                    </p>
                  </div>
                </div>
                
                <div className="p-1">
                  {!profileComplete && (
                    <Link
                      to="/profile-setup"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-ink rounded-xl transition-colors hover:bg-cream focus:bg-cream focus:outline-none"
                    >
                      {Icons.Setup}
                      Complete profile
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-ink rounded-xl transition-colors hover:bg-cream focus:bg-cream focus:outline-none"
                  >
                    {Icons.Profile}
                    View profile
                  </Link>
                  <div className="h-px bg-border my-1" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2.5 text-left text-sm font-medium text-red-600 rounded-xl transition-colors hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                  >
                    {Icons.Logout}
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-ink-2 hover:text-ink transition-colors px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-ink text-cream px-5 py-2.5 rounded-full hover:bg-ink-2 hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-surface"
              >
                Start building {"->"}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="md:hidden flex items-center">
          {isLoggedIn ? (
            /* Logged in: Profile circle instead of hamburger */
            <div className="relative" ref={mobileProfileRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-cream shadow-sm border-2 border-transparent hover:border-brand focus:outline-none focus:border-brand transition-all active:scale-95"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                {profileLabel}
              </button>

              {/* Mobile Profile & Nav Dropdown */}
              <div 
                className={`absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl origin-top-right transition-all duration-200 ease-out ${
                  menuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                {/* User info header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-ink/5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-cream flex-shrink-0 shadow-sm">
                    {profileLabel}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {userProfile?.name || userProfile?.username || "Your profile"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${profileComplete ? "bg-green-500" : "bg-yellow-400"}`} />
                      <p className="text-xs text-ink-3">
                        {profileComplete ? "Profile ready" : "Setup required"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  {/* Nav links */}
                  {["How it works", "Features", "Community"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '')}`}
                      className="block px-3 py-2.5 text-sm font-medium text-ink-2 rounded-xl hover:bg-cream hover:text-ink transition-colors focus:outline-none focus:bg-cream"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}

                  <div className="h-px bg-border my-2 mx-2" />

                  {/* Profile actions */}
                  {!profileComplete && (
                    <Link
                      to="/profile-setup"
                      className="flex items-center px-3 py-2.5 text-sm font-medium text-ink rounded-xl hover:bg-cream transition-colors focus:outline-none focus:bg-cream"
                      onClick={() => setMenuOpen(false)}
                    >
                      {Icons.Setup} Complete profile
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2.5 text-sm font-medium text-ink rounded-xl hover:bg-cream transition-colors focus:outline-none focus:bg-cream"
                    onClick={() => setMenuOpen(false)}
                  >
                    {Icons.Profile} View profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2.5 text-left text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50"
                  >
                    {Icons.Logout} Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Not logged in: hamburger menu */
            <>
              <button
                className="p-2 rounded-lg hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-colors"
                onClick={() => setMenuOpen((current) => !current)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <div className={`w-5 h-0.5 bg-ink transition-all duration-300 ease-out mb-1.5 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <div className={`w-5 h-0.5 bg-ink transition-all duration-300 ease-out mb-1.5 ${menuOpen ? "opacity-0 translate-x-2" : ""}`} />
                <div className={`w-5 h-0.5 bg-ink transition-all duration-300 ease-out ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>

              {/* Logged Out Mobile Menu Wrapper */}
              <div 
                className={`absolute top-[4.5rem] left-4 right-4 rounded-2xl bg-surface border border-border shadow-xl p-2 transition-all duration-200 ease-out origin-top ${
                  menuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
                }`}
              >
                <div className="flex flex-col gap-1">
                  {["How it works", "Features", "Community"].map((item) => (
                    <a 
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '')}`} 
                      className="px-4 py-3 text-sm font-medium text-ink-2 hover:bg-cream hover:text-ink rounded-xl transition-colors" 
                      onClick={() => setMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                  <div className="h-px bg-border my-2 mx-2" />
                  <Link 
                    to="/login" 
                    className="px-4 py-3 text-sm font-medium text-ink hover:bg-cream rounded-xl transition-colors" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="mt-2 px-4 py-3 text-sm font-medium bg-ink text-cream rounded-xl text-center shadow-sm hover:bg-ink-2 hover:shadow-md transition-all active:scale-95"
                    onClick={() => setMenuOpen(false)}
                  >
                    Start building {"->"}
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}