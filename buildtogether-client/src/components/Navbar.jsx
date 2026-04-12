import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-cream text-xs font-display italic">B</span>
          </div>
          <span className="font-sans font-semibold text-ink tracking-tight">
            Build<span className="text-brand">Together</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#how" className="text-sm text-ink-3 hover:text-ink transition-colors">How it works</a>
          <a href="#features" className="text-sm text-ink-3 hover:text-ink transition-colors">Features</a>
          <a href="#community" className="text-sm text-ink-3 hover:text-ink transition-colors">Community</a>
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-ink-2 hover:text-ink transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm bg-ink text-cream px-4 py-2 rounded-full hover:bg-ink-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start building →
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-ink transition-all mb-1 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-ink transition-all mb-1 ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-ink transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-6 py-4 flex flex-col gap-4">
          <a href="#how" className="text-sm text-ink-2" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#features" className="text-sm text-ink-2" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#community" className="text-sm text-ink-2" onClick={() => setMenuOpen(false)}>Community</a>
          <hr className="border-border" />
          <Link to="/login" className="text-sm text-ink-2">Log in</Link>
          <Link to="/signup" className="text-sm bg-ink text-cream px-4 py-2 rounded-full text-center">
            Start building →
          </Link>
        </div>
      )}
    </nav>
  )
}
