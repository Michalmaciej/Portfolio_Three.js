import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

interface Props {
  isDark: boolean
  visible: boolean
}

/* ─── Data ───────────────────────────────────────────────────────────── */

const ENTRIES = [
  {
    side: 'left' as const,
    period: 'Oct 2020 – Feb 2024',
    label: 'B.Sc. Studies',
    degree: 'Bachelor of Science',
    abbr: 'B.Sc.',
    school: 'Politechnika Rzeszowska im. Ignacego Łukasiewicza',
    field: 'Computer Science (Informatyka)',
    specialization: 'Information Systems Engineering',
    skills: 'Software development methodologies, database architecture, network design, and principles of secure and scalable enterprise systems.',
    thesis: 'Calculation of Measurement Uncertainties using Python and Tkinter',
  },
  {
    side: 'right' as const,
    period: 'Feb 2024 – Sep 2025',
    label: 'M.Sc. Studies',
    degree: 'Master of Science',
    abbr: 'M.Sc.',
    school: 'Politechnika Rzeszowska im. Ignacego Łukasiewicza',
    field: 'Computer Science (Informatyka)',
    specialization: 'Cybersecurity and Cloud Technologies',
    skills: 'Securing modern digital infrastructure — network security, threat analysis, data privacy, and scalable cloud services (AWS, Azure).',
    thesis: 'Sign Language Recognition with Facial Expression Analysis',
  },
]

/* ─── Row (card + node + spacer) ─────────────────────────────────────── */

function TimelineRow({
  entry,
  isDark,
  lineVisible,
}: {
  entry: typeof ENTRIES[number]
  isDark: boolean
  lineVisible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isLeft = entry.side === 'left'
  const cardSlide = isLeft ? 'translateX(-40px)' : 'translateX(40px)'

  const cardStyle: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateX(0)' : cardSlide,
    transition: 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)',
  }

  const card = (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...cardStyle,
        background: isDark ? '#14141e' : '#f6f6f9',
        border: `1px solid ${hovered ? 'rgba(16,185,129,0.45)' : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'}`,
        boxShadow: hovered
          ? '0 0 0 1px rgba(16,185,129,0.1), 0 8px 32px rgba(16,185,129,0.1)'
          : isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
        borderRadius: 2,
        padding: '28px 28px 24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1), border-color 0.25s, box-shadow 0.25s',
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: hovered
          ? 'linear-gradient(90deg, #10b981, #34d399)'
          : isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)',
        transition: 'background 0.3s ease',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        {/* Degree badge */}
        <span style={{
          display: 'inline-block',
          fontFamily: "'Space Grotesk', monospace",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: '#10b981',
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 2,
          padding: '3px 9px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {entry.abbr}
        </span>

        {/* Period */}
        <span style={{
          fontFamily: "'Space Grotesk', monospace",
          fontSize: 10,
          letterSpacing: '0.06em',
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
          whiteSpace: 'nowrap',
        }}>
          {entry.period}
        </span>
      </div>

      {/* Degree full name */}
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: 17,
        color: isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.82)',
        marginBottom: 4,
        lineHeight: 1.25,
      }}>
        {entry.degree}
      </p>

      {/* School */}
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 300,
        fontSize: 12,
        color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.4)',
        marginBottom: 18,
        lineHeight: 1.4,
      }}>
        {entry.school}
      </p>

      {/* Divider */}
      <div style={{
        height: 1,
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)',
        marginBottom: 16,
      }} />

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Row isDark={isDark} label="Field" value={entry.field} />
        <Row isDark={isDark} label="Specialization" value={entry.specialization} />
        <Row isDark={isDark} label="Key Skills" value={entry.skills} />
        <Row isDark={isDark} label="Thesis" value={`"${entry.thesis}"`} accent />
      </div>
    </div>
  )

  const spacer = <div />

  const nodeVisible = inView || lineVisible
  const node = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, paddingTop: 30 }}>
      {/* Outer ring */}
      <div style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: nodeVisible ? '#10b981' : isDark ? '#1e1e2e' : '#e8e8ee',
        boxShadow: nodeVisible ? '0 0 0 4px rgba(16,185,129,0.18), 0 0 18px rgba(16,185,129,0.35)' : 'none',
        border: `2px solid ${nodeVisible ? '#10b981' : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
        transition: 'background 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease',
        flexShrink: 0,
        zIndex: 1,
      }} />
    </div>
  )

  if (isMobile) {
    return <div style={{ marginBottom: 16 }}>{card}</div>
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 48px 1fr',
      alignItems: 'start',
      gap: '0 16px',
      marginBottom: 16,
    }}>
      {isLeft ? card : spacer}
      {node}
      {isLeft ? spacer : card}
    </div>
  )
}

function Row({ label, value, isDark, accent }: { label: string; value: string; isDark: boolean; accent?: boolean }) {
  return (
    <div>
      <span style={{
        fontFamily: "'Space Grotesk', monospace",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#10b981',
        display: 'block',
        marginBottom: 2,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 13,
        fontWeight: accent ? 400 : 300,
        color: accent
          ? isDark ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.68)'
          : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
        lineHeight: 1.55,
        fontStyle: accent ? 'italic' : 'normal',
      }}>
        {value}
      </span>
    </div>
  )
}

/* ─── Section ────────────────────────────────────────────────────────── */

export function EducationSection({ isDark, visible }: Props) {
  const isMobile = useIsMobile()
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headRef  = useRef<HTMLHeadingElement>(null)
  const [headerIn, setHeaderIn]   = useState(false)
  const [lineVisible, setLineVisible] = useState(false)

  useEffect(() => {
    const el = labelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderIn(true); setLineVisible(true) } },
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
      id="education"
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
          Academic Background
        </p>
        <h2
          ref={headRef}
          className="text-4xl md:text-5xl dark:text-white text-gray-900 mb-16 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, ...fadeIn(0.1) }}
        >
          Education.
        </h2>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            display: isMobile ? 'none' : 'block',
            position: 'absolute',
            left: 'calc(50% - 1px)',
            top: 0,
            bottom: 0,
            width: 1,
            background: isDark
              ? 'linear-gradient(to bottom, rgba(16,185,129,0.5) 0%, rgba(16,185,129,0.15) 100%)'
              : 'linear-gradient(to bottom, rgba(16,185,129,0.45) 0%, rgba(16,185,129,0.1) 100%)',
            transform: `scaleY(${lineVisible ? 1 : 0})`,
            transformOrigin: 'top',
            transition: 'transform 1.1s cubic-bezier(0.22,1,0.36,1)',
          }} />

          {ENTRIES.map(entry => (
            <TimelineRow
              key={entry.abbr}
              entry={entry}
              isDark={isDark}
              lineVisible={lineVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
