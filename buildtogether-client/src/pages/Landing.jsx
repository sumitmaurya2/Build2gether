import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

/* ─── tiny hook: animate on scroll ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ─── marquee items ─── */
const MARQUEE_ITEMS = [
  'Ship real projects',
  'Find your co-founder',
  'Proof-of-work profiles',
  'Real collaboration',
  'Build in public',
  'No fake resumes',
  'Earn trust by building',
  'Find your team',
]

/* ─── features ─── */
const FEATURES = [
  {
    icon: '⬡',
    tag: 'Discovery',
    title: 'Projects that need you',
    desc: 'A personalized feed of real projects — filtered by your skills, interest, and availability. No noise, only signal.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    icon: '◎',
    tag: 'Proof-of-Work',
    title: 'Your profile is your work',
    desc: "Forget the resume. Your profile shows completed projects, collaborator endorsements, and real output — not claims.",
    color: 'bg-brand-light border-orange-100',
    iconBg: 'bg-orange-100 text-brand',
  },
  {
    icon: '⬟',
    tag: 'Matching',
    title: 'Smart teammate suggestions',
    desc: 'Post what you need — the system surfaces the right people based on skills, trust score, and response rate.',
    color: 'bg-green-50 border-green-100',
    iconBg: 'bg-green-100 text-green-700',
  },
  {
    icon: '◈',
    tag: 'Collaboration',
    title: 'Project rooms that work',
    desc: 'Every accepted project gets a private space — chat, milestones, and progress tracking in one place.',
    color: 'bg-violet-50 border-violet-100',
    iconBg: 'bg-violet-100 text-violet-700',
  },
  {
    icon: '◉',
    tag: 'Trust',
    title: 'A reputation you own',
    desc: "Trust isn't handed out — it's earned. Verified completions, endorsements, and activity streaks build your builder score.",
    color: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    icon: '⬡',
    tag: 'Community',
    title: 'Rooms for your niche',
    desc: 'AI/ML, UI/UX, Startup Ideas, Hackathon Teams — live rooms where builders ask, share, and grow together.',
    color: 'bg-rose-50 border-rose-100',
    iconBg: 'bg-rose-100 text-rose-700',
  },
]

/* ─── how it works steps ─── */
const STEPS = [
  {
    num: '01',
    title: 'Build your builder profile',
    desc: 'Set your skills, role, and portfolio. Your profile starts empty — it fills up as you ship.',
  },
  {
    num: '02',
    title: 'Discover or post a project',
    desc: 'Browse the feed for live projects needing your skills, or post your idea and describe who you need.',
  },
  {
    num: '03',
    title: 'Match, chat, and commit',
    desc: "Send a join request with a message. Owner reviews and accepts. You're in — project room unlocks.",
  },
  {
    num: '04',
    title: 'Ship it. Earn credit.',
    desc: "Project done? Close it. Every member gets credit. It shows on your profile — permanent proof of work.",
  },
]

/* ─── user types ─── */
const USER_TYPES = [
  { emoji: '🎓', label: 'Students', sub: 'Build real things before placement season' },
  { emoji: '💡', label: 'Founders', sub: 'Find your technical co-founder fast' },
  { emoji: '👨‍💻', label: 'Developers', sub: 'Join projects worth your weekends' },
  { emoji: '🎨', label: 'Designers', sub: 'Collaborate on products, not just mockups' },
]

/* ─── Section wrapper with fade-up animation ─── */
function Section({ children, className = '', id = '' }) {
  const [ref, visible] = useInView()
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </section>
  )
}

export default function Landing() {
  /* hero staggered animation */
  const [heroReady, setHeroReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-cream grain-overlay">
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-32">
        {/* subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          {/* badge */}
          <div
            className={`inline-flex items-center gap-2 border border-border bg-surface rounded-full px-4 py-1.5 text-xs text-ink-3 mb-8 transition-all duration-500 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Now open for early builders
          </div>

          {/* headline */}
          <h1
            className={`font-display text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.05] tracking-tight mb-6 text-balance transition-all duration-600 delay-100 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '120ms' }}
          >
            Find people who{' '}
            <span className="italic text-brand">actually build.</span>
          </h1>

          {/* subheadline */}
          <p
            className={`text-lg md:text-xl text-ink-3 max-w-2xl mx-auto mb-10 leading-relaxed text-balance transition-all duration-600 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '240ms' }}
          >
            BuildTogether is a collaboration network for serious builders.
            Post your project, find the right teammates, ship together —
            and let your work speak for itself.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 transition-all duration-600 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '360ms' }}
          >
            <Link
              to="/signup"
              className="group flex items-center gap-2 bg-ink text-cream text-sm font-medium px-6 py-3.5 rounded-full hover:bg-brand transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              Start building for free
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a
              href="#how"
              className="text-sm text-ink-3 hover:text-ink px-6 py-3.5 transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-3"
            >
              See how it works
            </a>
          </div>

          {/* Hero visual — project card mockup */}
          <div
            className={`relative max-w-3xl mx-auto transition-all duration-700 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '480ms' }}
          >
            <HeroMockup />
          </div>
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="border-y border-border bg-ink overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-cream/60 text-sm font-mono mx-6">
              {item}
              <span className="text-brand mx-6">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FOR WHO ── */}
      <Section className="py-20 max-w-6xl mx-auto px-6" id="who">
        <p className="text-xs font-mono text-ink-3 uppercase tracking-widest mb-4">Built for</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {USER_TYPES.map((u, i) => (
            <div
              key={i}
              className="border border-border bg-surface rounded-2xl p-6 hover:border-brand/40 hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                {u.emoji}
              </div>
              <h3 className="font-sans font-semibold text-ink mb-1">{u.label}</h3>
              <p className="text-xs text-ink-3 leading-relaxed">{u.sub}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section className="py-20 bg-surface-2 border-y border-border" id="how">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-mono text-ink-3 uppercase tracking-widest mb-3">The flow</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink italic">
              From idea to shipped —<br />
              <span className="not-italic font-sans font-medium text-3xl md:text-4xl text-ink-2">
                here's how it works
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="relative p-6 rounded-2xl border border-border bg-surface hover:border-ink/20 transition-all duration-200 group"
              >
                <span className="font-mono text-4xl font-semibold text-border-strong block mb-4 group-hover:text-brand transition-colors">
                  {s.num}
                </span>
                <h3 className="font-sans font-semibold text-ink mb-2 text-[15px]">{s.title}</h3>
                <p className="text-sm text-ink-3 leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-border-strong text-lg">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FEATURES GRID ── */}
      <Section className="py-20 max-w-6xl mx-auto px-6" id="features">
        <div className="mb-14">
          <p className="text-xs font-mono text-ink-3 uppercase tracking-widest mb-3">What's inside</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink italic">
            Everything a builder needs.
          </h2>
          <p className="text-ink-3 mt-3 max-w-xl">
            No bloat, no fluff. Just the tools that make real collaboration possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border ${f.color} hover:shadow-md transition-all duration-200 group`}
            >
              <div className={`w-9 h-9 rounded-xl ${f.iconBg} flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-2 block">
                {f.tag}
              </span>
              <h3 className="font-sans font-semibold text-ink mb-2 text-[15px]">{f.title}</h3>
              <p className="text-sm text-ink-3 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── PROOF-OF-WORK HIGHLIGHT ── */}
      <Section className="py-20 bg-ink" id="community">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono text-brand uppercase tracking-widest mb-4">The difference</p>
              <h2 className="font-display text-4xl md:text-5xl text-cream italic leading-tight mb-6">
                Show evidence,<br />not claims.
              </h2>
              <p className="text-cream/60 leading-relaxed mb-8">
                Anyone can write "3 years of React" on a resume. On BuildTogether, your profile shows
                what you actually shipped — projects, collaborators, endorsements, and completion rate.
                The work speaks. The trust compounds.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  'Completed projects on your profile — forever',
                  'Collaborator endorsements after each project',
                  'Trust score built from real activity',
                  'Public portfolio page for every builder',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center mt-0.5 shrink-0">
                      <span className="text-brand text-xs">✓</span>
                    </div>
                    <span className="text-cream/70 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust score card mockup */}
            <div className="flex justify-center">
              <TrustCardMockup />
            </div>
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section className="py-28 max-w-4xl mx-auto px-6 text-center">
        <p className="text-xs font-mono text-ink-3 uppercase tracking-widest mb-6">Ready?</p>
        <h2 className="font-display text-5xl md:text-6xl text-ink italic mb-6">
          Start building with<br />
          the right people.
        </h2>
        <p className="text-ink-3 mb-10 max-w-lg mx-auto leading-relaxed">
          Free to join. No fluff, no job board, no random DMs.
          Just builders, projects, and real collaboration.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 bg-brand text-white text-base font-medium px-8 py-4 rounded-full hover:bg-ink transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand/20"
        >
          Create your builder profile
          <span>→</span>
        </Link>
        <p className="text-xs text-ink-3 mt-4">No credit card. Takes 2 minutes.</p>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-ink rounded flex items-center justify-center">
              <span className="text-cream text-xs font-display italic">B</span>
            </div>
            <span className="text-sm font-sans font-medium text-ink">BuildTogether</span>
          </div>
          <p className="text-xs text-ink-3">Built by builders, for builders. India 🇮🇳</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-ink-3 hover:text-ink transition-colors">Privacy</a>
            <a href="#" className="text-xs text-ink-3 hover:text-ink transition-colors">Terms</a>
            <a href="#" className="text-xs text-ink-3 hover:text-ink transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ── Hero mockup card ── */
function HeroMockup() {
  return (
    <div className="relative">
      {/* shadow cards behind */}
      <div className="absolute inset-0 bg-ink/5 rounded-2xl translate-x-2 translate-y-2" />
      <div className="absolute inset-0 bg-ink/3 rounded-2xl translate-x-4 translate-y-4" />

      {/* main card */}
      <div className="relative bg-surface border border-border rounded-2xl p-6 shadow-xl text-left">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                Open · 3 spots
              </span>
              <span className="text-xs font-mono text-ink-3">posted 2h ago</span>
            </div>
            <h3 className="font-sans font-semibold text-ink text-lg">AI Resume Builder for students</h3>
          </div>
          <div className="w-9 h-9 bg-brand-light border border-orange-100 rounded-xl flex items-center justify-center text-base shrink-0">
            🚀
          </div>
        </div>

        <p className="text-sm text-ink-3 mb-4 leading-relaxed">
          Building an AI-powered resume builder tailored for Indian students — LaTeX export, ATS score, job match.
          Looking for a backend dev and a UI designer.
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {['React', 'Node.js', 'OpenAI API', 'UI/UX'].map((t) => (
            <span key={t} className="text-xs bg-surface-2 border border-border text-ink-2 px-2.5 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['S', 'R', 'A'].map((l, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-ink text-cream text-xs flex items-center justify-center border-2 border-surface font-medium"
                >
                  {l}
                </div>
              ))}
            </div>
            <span className="text-xs text-ink-3">3 interested</span>
          </div>
          <button className="text-xs bg-ink text-cream px-4 py-2 rounded-full hover:bg-brand transition-colors">
            Show interest →
          </button>
        </div>
      </div>

      {/* floating notification */}
      <div className="absolute -top-4 -right-4 bg-surface border border-border rounded-xl px-3 py-2 shadow-lg animate-float">
        <div className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <div>
            <p className="text-xs font-medium text-ink">New match found</p>
            <p className="text-[10px] text-ink-3">Skills aligned · 94%</p>
          </div>
        </div>
      </div>

      {/* floating tag bottom left */}
      <div className="absolute -bottom-4 -left-4 bg-brand text-white rounded-xl px-3 py-2 shadow-lg animate-float" style={{ animationDelay: '2s' }}>
        <p className="text-xs font-medium">✓ Project shipped</p>
      </div>
    </div>
  )
}

/* ── Trust score card ── */
function TrustCardMockup() {
  return (
    <div className="w-full max-w-xs">
      <div className="bg-surface/10 border border-white/10 rounded-2xl p-6">
        {/* avatar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-display text-lg italic">
            S
          </div>
          <div>
            <p className="text-cream font-semibold text-sm">Sumit Kumar</p>
            <p className="text-cream/50 text-xs">Full-stack Developer · Lucknow</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-brand/20 text-brand border border-brand/30 px-2 py-1 rounded-full font-mono">
              Trusted
            </span>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { val: '7', label: 'Projects' },
            { val: '94%', label: 'Completion' },
            { val: '4.9', label: 'Rating' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-cream font-semibold text-lg font-mono">{s.val}</p>
              <p className="text-cream/40 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* skills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {['React', 'Node.js', 'MongoDB', 'Firebase'].map((sk) => (
            <span key={sk} className="text-[10px] text-cream/60 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
              {sk}
            </span>
          ))}
        </div>

        {/* trust bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-cream/40 font-mono uppercase">Builder score</span>
            <span className="text-[10px] text-brand font-mono">872 / 1000</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: '87%' }}
            />
          </div>
        </div>
      </div>

      {/* endorsement card below */}
      <div className="mt-3 bg-surface/5 border border-white/10 rounded-xl px-4 py-3 flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 text-xs">
          R
        </div>
        <div>
          <p className="text-cream/70 text-xs leading-relaxed italic">
            "Sumit shipped the entire backend in 2 weeks. Responsive, clean code."
          </p>
          <p className="text-cream/30 text-[10px] mt-1">— Rahul · AI Resume Builder project</p>
        </div>
      </div>
    </div>
  )
}
