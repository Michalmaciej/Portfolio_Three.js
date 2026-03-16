import { useEffect, useState } from 'react'

const ROLES = ['Software Developer', 'Machine Learning Developer', 'Designer', 'Creator']

interface Props {
  visible: boolean
}

export function HeroSection({ visible }: Props) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [roleFade, setRoleFade] = useState(true)

  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      setRoleFade(false)
      setTimeout(() => {
        setRoleIndex(i => (i + 1) % ROLES.length)
        setRoleFade(true)
      }, 280)
    }, 2600)
    return () => clearInterval(interval)
  }, [visible])

  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen flex items-center px-5 md:px-12 lg:px-20 pt-20 md:pt-0 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0, pointerEvents: 'none' }}
    >
      {/* Left column — text */}
      <div className="w-full max-w-lg" style={{ pointerEvents: 'auto' }}>
        {/* Label */}
        <p
          className="font-mono text-[11px] tracking-[0.45em] text-emerald-400 mb-7 uppercase"
        >
          Portfolio
        </p>

        {/* Name */}
        <h1
          className="text-6xl md:text-7xl leading-none tracking-tight dark:text-white text-gray-900 mb-5"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          Michał<br />
          <span className="text-emerald-400">Maciej</span>
        </h1>

        {/* Description */}
        <p
          className="text-base dark:text-white/45 text-gray-500 mb-8 leading-relaxed max-w-sm"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}
        >
          I develop modern web applications and create efficient machine learning models.
        </p>

        {/* Cycling role */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span
            className="font-mono text-sm text-emerald-400 transition-opacity duration-280"
            style={{ opacity: roleFade ? 1 : 0 }}
          >
            {ROLES[roleIndex]}
          </span>
        </div>

        {/* CTA */}
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-6 py-3 border border-emerald-500/50 text-emerald-400 text-sm font-mono tracking-wider hover:bg-emerald-500/10 transition-colors duration-200"
        >
          View Work
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </section>
  )
}
