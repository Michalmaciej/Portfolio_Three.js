import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

interface Props {
  isDark: boolean
  visible: boolean
}

/* ─── Data ───────────────────────────────────────────────────────────── */

const JOBS = [
  {
    index: '01',
    title: 'Prestige Electro',
    company: 'Prestige Electro — Serwis i sprzedaż komputerów, laptopów.',
    date: 'July 2022 – August 2022',
    type: 'Internship',
    points: [
      'Work as part of an unpaid student internship.',
      'Service and sale of computers and laptops.',
      'Replacement of damaged electronic components.',
      'Customer service and sales.',
      'Designing and building computer sets.',
    ],
  },
  {
    index: '02',
    title: 'Orzełek',
    company: 'Orzełek Sp. z o.o.',
    date: 'April 2025 – October 2025',
    type: 'Warehouse',
    points: [
      'Wholesaler of food and everyday products.',
      'Accepting deliveries of products.',
      'Distributing, adding and stacking goods.',
      'Completing orders for smaller partner stores.',
      'Packing intercontinental deliveries into a container.',
    ],
  },
]

/* ─── Job Card ───────────────────────────────────────────────────────── */

function JobCard({ job, isDark, order }: { job: typeof JOBS[number]; isDark: boolean; order: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const delay = order * 0.15

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(48px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, border-color 0.25s, box-shadow 0.25s`,
        background: isDark ? '#14141e' : '#f6f6f9',
        border: `1px solid ${hovered ? 'rgba(16,185,129,0.5)' : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'}`,
        boxShadow: hovered
          ? '0 0 0 1px rgba(16,185,129,0.08), 0 12px 40px rgba(16,185,129,0.12)'
          : isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        gridColumn: '1 / -1',
        height: 2,
        background: hovered
          ? 'linear-gradient(90deg, #10b981, #34d399)'
          : isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)',
        transition: 'background 0.3s ease',
      }} />

      {/* Left: company info */}
      <div style={{
        padding: '28px 28px 28px 32px',
        borderRight: isMobile ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
        borderBottom: isMobile ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Index */}
        <span style={{
          fontFamily: "'Space Grotesk', monospace",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.15em',
          color: '#10b981',
          opacity: 0.7,
        }}>
          {job.index}
        </span>

        {/* Logo placeholder */}
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 4,
          background: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)',
          border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: '#10b981',
          }}>
            {job.title.charAt(0)}
          </span>
        </div>

        {/* Company name */}
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
          lineHeight: 1.2,
          marginTop: 4,
        }}>
          {job.title}
        </p>

        {/* Full company */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 300,
          fontSize: 11,
          color: isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.38)',
          lineHeight: 1.45,
        }}>
          {job.company}
        </p>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Date badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'Space Grotesk', monospace",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.07em',
            color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.42)',
          }}>
            <span style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10b981',
            }} />
            {job.date}
          </span>

          <span style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            fontFamily: "'Space Grotesk', monospace",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#10b981',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.28)',
            borderRadius: 2,
            padding: '2px 8px',
          }}>
            {job.type}
          </span>
        </div>
      </div>

      {/* Right: bullet points */}
      <div style={{
        padding: '32px 32px 28px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <p style={{
          fontFamily: "'Space Grotesk', monospace",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#10b981',
          marginBottom: 18,
        }}>
          Responsibilities
        </p>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {job.points.map((point, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              {/* Custom bullet */}
              <span style={{
                display: 'block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#10b981',
                marginTop: 7,
                flexShrink: 0,
                opacity: 0.7,
              }} />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 300,
                fontSize: 13.5,
                color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
                lineHeight: 1.6,
              }}>
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ─── Section ────────────────────────────────────────────────────────── */

export function WorkSection({ isDark, visible }: Props) {
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
      id="work"
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
          Professional Experience
        </p>
        <h2
          className="text-4xl md:text-5xl dark:text-white text-gray-900 mb-14 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, ...fadeIn(0.1) }}
        >
          Work.
        </h2>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {JOBS.map((job, i) => (
            <JobCard key={job.index} job={job} isDark={isDark} order={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
