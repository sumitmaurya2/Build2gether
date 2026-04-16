import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { isProfileComplete } from '../utils/authFlow'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

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

const FEATURES = [
  {
    icon: '[]',
    tag: 'Discovery',
    title: 'Projects that need you',
    desc: 'A personalized feed of real projects filtered by your skills, interest, and availability.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    icon: '()',
    tag: 'Proof-of-Work',
    title: 'Your profile is your work',
    desc: 'Your profile shows completed projects, collaborator endorsements, and real output.',
    color: 'bg-brand-light border-orange-100',
    iconBg: 'bg-orange-100 text-brand',
  },
  {
    icon: '<>',
    tag: 'Matching',
    title: 'Smart teammate suggestions',
    desc: 'Post what you need and surface the right people based on skills, trust score, and response rate.',
    color: 'bg-green-50 border-green-100',
    iconBg: 'bg-green-100 text-green-700',
  },
  {
    icon: '{}',
    tag: 'Collaboration',
    title: 'Project rooms that work',
    desc: 'Every accepted project gets a private space for chat, milestones, and progress tracking.',
    color: 'bg-violet-50 border-violet-100',
    iconBg: 'bg-violet-100 text-violet-700',
  },
  {
    icon: '**',
    tag: 'Trust',
    title: 'A reputation you own',
    desc: 'Verified completions, endorsements, and activity streaks build your builder score.',
    color: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    icon: '##',
    tag: 'Community',
    title: 'Rooms for your niche',
    desc: 'AI/ML, UI/UX, startup ideas, hackathon teams and more, all in one builder-first space.',
    color: 'bg-rose-50 border-rose-100',
    iconBg: 'bg-rose-100 text-rose-700',
  },
]

const STEPS = [
  { num: '01', title: 'Build your builder profile', desc: 'Set your skills, role, and portfolio. Your profile fills up as you ship.' },
  { num: '02', title: 'Discover or post a project', desc: 'Browse the feed for live projects needing your skills, or post your idea.' },
  { num: '03', title: 'Match, chat, and commit', desc: 'Send a join request, get accepted, and unlock the project room.' },
  { num: '04', title: 'Ship it. Earn credit.', desc: 'Every completed project becomes permanent proof of work on your profile.' },
]

const USER_TYPES = [
  { emoji: 'Student', label: 'Students', sub: 'Build real things before placement season' },
  { emoji: 'Founder', label: 'Founders', sub: 'Find your technical co-founder fast' },
  { emoji: 'Developer', label: 'Developers', sub: 'Join projects worth your weekends' },
  { emoji: 'Designer', label: 'Designers', sub: 'Collaborate on products, not just mockups' },
]

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
  const [heroReady, setHeroReady] = useState(false)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 80)
    return () => clearTimeout(timer)
  }, [])

  if (user && isProfileComplete(userProfile)) {
    return <Navigate to="/home" replace />
  }

  const primaryCtaHref = user ? "/profile-setup" : "/signup"
  const primaryCtaLabel = user ? "Complete your profile" : "Start building for free"

  return (
    <div className="min-h-screen bg-cream grain-overlay">
      <Navbar />

      <div className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div
            className={`inline-flex items-center gap-2 border border-border bg-surface rounded-full px-4 py-1.5 text-xs text-ink-3 mb-8 transition-all duration-500 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Now open for early builders
          </div>

          <h1
            className={`font-display text-5xl md:text-7xl lg:text-8xl text-ink leading-[1.05] tracking-tight mb-6 text-balance transition-all duration-600 delay-100 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '120ms' }}
          >
            Find people who <span className="italic text-brand">actually build.</span>
          </h1>

          <p
            className={`text-lg md:text-xl text-ink-3 max-w-2xl mx-auto mb-10 leading-relaxed text-balance transition-all duration-600 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '240ms' }}
          >
            BuildTogether is a collaboration network for serious builders.
            Post your project, find the right teammates, ship together and let your work speak for itself.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 transition-all duration-600 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '360ms' }}
          >
            <Link
              to={primaryCtaHref}
              className="group flex items-center gap-2 bg-ink text-cream text-sm font-medium px-6 py-3.5 rounded-full hover:bg-brand transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              {primaryCtaLabel}
              <span className="group-hover:translate-x-1 transition-transform">-&gt;</span>
            </Link>
            <a
              href="#how"
              className="text-sm text-ink-3 hover:text-ink px-6 py-3.5 transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-3"
            >
              See how it works
            </a>
          </div>

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

      <div className="border-y border-border bg-ink overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <span key={index} className="text-cream/60 text-sm font-mono mx-6">
              {item}
              <span className="text-brand mx-6">.</span>
            </span>
          ))}
        </div>
      </div>

      <Section className="py-20 max-w-6xl mx-auto px-6" id="who">
        <p className="text-xs font-mono text-ink-3 uppercase tracking-widest mb-4">Built for</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {USER_TYPES.map((userType) => (
            <div
              key={userType.label}
              className="border border-border bg-surface rounded-2xl p-6 hover:border-brand/40 hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-sm font-mono uppercase tracking-[0.25em] text-brand mb-3 group-hover:scale-105 transition-transform inline-block">
                {userType.emoji}
              </div>
              <h3 className="font-sans font-semibold text-ink mb-1">{userType.label}</h3>
              <p className="text-xs text-ink-3 leading-relaxed">{userType.sub}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-20 bg-surface-2 border-y border-border" id="how">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-mono text-ink-3 uppercase tracking-widest mb-3">The flow</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink italic">
              From idea to shipped
              <br />
              <span className="not-italic font-sans font-medium text-3xl md:text-4xl text-ink-2">
                here&apos;s how it works
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, index) => (
              <div
                key={step.num}
                className="relative p-6 rounded-2xl border border-border bg-surface hover:border-ink/20 transition-all duration-200 group"
              >
                <span className="font-mono text-4xl font-semibold text-border-strong block mb-4 group-hover:text-brand transition-colors">
                  {step.num}
                </span>
                <h3 className="font-sans font-semibold text-ink mb-2 text-[15px]">{step.title}</h3>
                <p className="text-sm text-ink-3 leading-relaxed">{step.desc}</p>
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-border-strong text-lg">
                    -&gt;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-20 max-w-6xl mx-auto px-6" id="features">
        <div className="mb-14">
          <p className="text-xs font-mono text-ink-3 uppercase tracking-widest mb-3">What&apos;s inside</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink italic">
            Everything a builder needs.
          </h2>
          <p className="text-ink-3 mt-3 max-w-xl">
            No bloat, no fluff. Just the tools that make real collaboration possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`p-6 rounded-2xl border ${feature.color} hover:shadow-md transition-all duration-200 group`}
            >
              <div className={`w-9 h-9 rounded-xl ${feature.iconBg} flex items-center justify-center text-xs font-mono mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-2 block">
                {feature.tag}
              </span>
              <h3 className="font-sans font-semibold text-ink mb-2 text-[15px]">{feature.title}</h3>
              <p className="text-sm text-ink-3 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-28 max-w-4xl mx-auto px-6 text-center">
        <p className="text-xs font-mono text-ink-3 uppercase tracking-widest mb-6">Ready?</p>
        <h2 className="font-display text-5xl md:text-6xl text-ink italic mb-6">
          Start building with
          <br />
          the right people.
        </h2>
        <p className="text-ink-3 mb-10 max-w-lg mx-auto leading-relaxed">
          Free to join. No fluff, no job board, no random DMs. Just builders, projects, and real collaboration.
        </p>
        <Link
          to={primaryCtaHref}
          className="inline-flex items-center gap-2 bg-brand text-white text-base font-medium px-8 py-4 rounded-full hover:bg-ink transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand/20"
        >
          {user ? "Continue onboarding" : "Create your builder profile"}
          <span>-&gt;</span>
        </Link>
        <p className="text-xs text-ink-3 mt-4">No credit card. Takes 2 minutes.</p>
      </Section>
    </div>
  )
}

function HeroMockup() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-ink/5 rounded-2xl translate-x-2 translate-y-2" />
      <div className="absolute inset-0 bg-ink/3 rounded-2xl translate-x-4 translate-y-4" />

      <div className="relative bg-surface border border-border rounded-2xl p-6 shadow-xl text-left">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                Open . 3 spots
              </span>
              <span className="text-xs font-mono text-ink-3">posted 2h ago</span>
            </div>
            <h3 className="font-sans font-semibold text-ink text-lg">AI Resume Builder for students</h3>
          </div>
          <div className="w-9 h-9 bg-brand-light border border-orange-100 rounded-xl flex items-center justify-center text-xs font-mono shrink-0">
            AI
          </div>
        </div>

        <p className="text-sm text-ink-3 mb-4 leading-relaxed">
          Building an AI-powered resume builder tailored for Indian students.
          Looking for a backend dev and a UI designer.
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {['React', 'Node.js', 'OpenAI API', 'UI/UX'].map((tag) => (
            <span key={tag} className="text-xs bg-surface-2 border border-border text-ink-2 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['S', 'R', 'A'].map((letter) => (
                <div
                  key={letter}
                  className="w-7 h-7 rounded-full bg-ink text-cream text-xs flex items-center justify-center border-2 border-surface font-medium"
                >
                  {letter}
                </div>
              ))}
            </div>
            <span className="text-xs text-ink-3">3 interested</span>
          </div>
          <button className="text-xs bg-ink text-cream px-4 py-2 rounded-full hover:bg-brand transition-colors">
            Show interest -&gt;
          </button>
        </div>
      </div>
    </div>
  )
}
