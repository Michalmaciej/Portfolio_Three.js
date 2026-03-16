import { useEffect, useRef, useState } from 'react'

interface Props {
  isDark: boolean
  visible: boolean
}

/* ─── Data ───────────────────────────────────────────────────────────── */

const SKILLS = [
  { name: 'Python',      letter: 'Py', category: 'ml' },
  { name: 'TensorFlow',  letter: 'TF', category: 'ml' },
  { name: 'Streamlit',   letter: 'St', category: 'web' },
  { name: 'NumPy',       letter: 'Np', category: 'ml' },
  { name: 'React JS',    letter: 'Re', category: 'web' },
  { name: 'MLFlow',      letter: 'ML', category: 'ml' },
  { name: 'Pandas',      letter: 'Pd', category: 'ml' },
  { name: 'PyTorch',     letter: 'PT', category: 'ml' },
  { name: 'Keras',       letter: 'Ks', category: 'ml' },
  { name: 'Three JS',    letter: '3J', category: 'web' },
  { name: 'Git',         letter: 'Gt', category: 'tools' },
  { name: 'Django',      letter: 'Dj', category: 'web' },
  { name: 'Docker',      letter: 'Dk', category: 'tools' },
  { name: 'GitHub',      letter: 'GH', category: 'tools' },
]

const CATEGORY_COLOR: Record<string, string> = {
  ml:    'rgba(16,185,129,1)',    // emerald
  web:   'rgba(96,165,250,1)',    // blue-400
  tools: 'rgba(167,139,250,1)',   // violet-400
}

const CATEGORY_BG: Record<string, string> = {
  ml:    'rgba(16,185,129,0.09)',
  web:   'rgba(96,165,250,0.09)',
  tools: 'rgba(167,139,250,0.09)',
}

const CATEGORY_BORDER: Record<string, string> = {
  ml:    'rgba(16,185,129,0.22)',
  web:   'rgba(96,165,250,0.22)',
  tools: 'rgba(167,139,250,0.22)',
}

const CATEGORY_GLOW: Record<string, string> = {
  ml:    'rgba(16,185,129,0.18)',
  web:   'rgba(96,165,250,0.18)',
  tools: 'rgba(167,139,250,0.18)',
}

/* ─── Skill Chip ─────────────────────────────────────────────────────── */

function SkillChip({
  skill,
  isDark,
  order,
  groupVisible,
}: {
  skill: typeof SKILLS[number]
  isDark: boolean
  order: number
  groupVisible: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const color  = CATEGORY_COLOR[skill.category]
  const bg     = CATEGORY_BG[skill.category]
  const border = CATEGORY_BORDER[skill.category]
  const glow   = CATEGORY_GLOW[skill.category]

  const delay = order * 0.055

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: groupVisible ? 1 : 0,
        transform: groupVisible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.92)',
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s, border-color 0.2s, box-shadow 0.2s, background 0.2s`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '22px 12px 18px',
        borderRadius: 4,
        cursor: 'default',
        background: hovered
          ? (isDark ? '#1a1a28' : '#efefef')
          : (isDark ? '#14141e' : '#f6f6f9'),
        border: `1px solid ${hovered ? border : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: hovered
          ? `0 0 0 1px ${glow}, 0 8px 28px ${glow}`
          : isDark ? '0 2px 8px rgba(0,0,0,0.25)' : '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      {/* Icon area */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 6,
        background: hovered ? bg : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
        border: `1px solid ${hovered ? border : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s, border-color 0.2s',
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', monospace",
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '0.04em',
          color: hovered ? color : (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)'),
          transition: 'color 0.2s',
        }}>
          {skill.letter}
        </span>
      </div>

      {/* Name */}
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: hovered ? 500 : 400,
        fontSize: 11.5,
        letterSpacing: '0.03em',
        color: hovered
          ? (isDark ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.78)')
          : (isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.42)'),
        textAlign: 'center',
        transition: 'color 0.2s, font-weight 0.2s',
        whiteSpace: 'nowrap',
      }}>
        {skill.name}
      </span>
    </div>
  )
}

/* ─── Legend dot ─────────────────────────────────────────────────────── */

function LegendDot({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: color }} />
      <span style={{
        fontFamily: "'Space Grotesk', monospace",
        fontSize: 10,
        letterSpacing: '0.08em',
        color,
        opacity: 0.7,
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </span>
  )
}

/* ─── Section ────────────────────────────────────────────────────────── */

export function SkillsSection({ isDark, visible }: Props) {
  const labelRef = useRef<HTMLParagraphElement>(null)
  const [headerIn, setHeaderIn] = useState(false)

  useEffect(() => {
    const el = labelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderIn(true) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: headerIn ? 1 : 0,
    transform: headerIn ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  })

  return (
    <section
      id="skills"
      className="relative z-10 flex items-center justify-center py-24 px-5 md:px-12 lg:px-20"
      style={{
        minHeight: '100vh',
        background: isDark ? '#12121a' : '#ffffff',
        pointerEvents: 'none',
      }}
    >
      <div
        className="w-full"
        style={{ maxWidth: 860, pointerEvents: visible ? 'auto' : 'none' }}
      >
        {/* Header */}
        <p
          ref={labelRef}
          className="font-mono text-[11px] tracking-[0.45em] text-emerald-400 uppercase mb-3"
          style={fadeIn(0)}
        >
          Tech Stack
        </p>
        <h2
          className="text-4xl md:text-5xl dark:text-white text-gray-900 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, ...fadeIn(0.1) }}
        >
          Skills.
        </h2>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 16,
            marginBottom: 48,
            ...fadeIn(0.18),
          }}
        >
          <LegendDot label="ML / AI" color={CATEGORY_COLOR.ml} />
          <LegendDot label="Web" color={CATEGORY_COLOR.web} />
          <LegendDot label="Tools" color={CATEGORY_COLOR.tools} />
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 12,
        }}>
          {SKILLS.map((skill, i) => (
            <SkillChip
              key={skill.name}
              skill={skill}
              isDark={isDark}
              order={i}
              groupVisible={headerIn}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
