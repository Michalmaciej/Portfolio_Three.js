import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

interface Props {
  visible: boolean
  isDark: boolean
}

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement & HTMLParagraphElement & HTMLHeadingElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const style = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  }

  return { ref, style }
}

/* ─── Interest card ─────────────────────────────────────────────────── */

interface CardProps {
  name: string
  subtitle: string
  icon: React.ReactNode
  isDark: boolean
  delay: number
}

function InterestCard({ name, subtitle, icon, isDark, delay }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const baseBg = isDark ? '#14141e' : '#f4f4f8'
  const spotBg = isDark
    ? `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(16,185,129,0.13) 0%, transparent 65%)`
    : `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(16,185,129,0.10) 0%, transparent 65%)`

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)'
          : 'translateY(32px)',
        transition: `opacity 0.6s ease ${delay}s, transform ${inView ? '0.25s ease' : `0.6s ease ${delay}s`}`,
        background: hovered ? `${spotBg}, ${baseBg}` : baseBg,
        border: `1px solid ${hovered ? 'rgba(16,185,129,0.45)' : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'}`,
        boxShadow: hovered
          ? `0 0 0 1px rgba(16,185,129,0.12), 0 8px 32px rgba(16,185,129,0.12), 0 2px 8px rgba(0,0,0,0.2)`
          : isDark ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '2px',
        padding: '28px 24px',
      }}
    >
      {/* Corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 48,
          height: 48,
          background: hovered
            ? 'linear-gradient(225deg, rgba(16,185,129,0.25) 0%, transparent 60%)'
            : 'transparent',
          transition: 'background 0.3s ease',
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '2px',
          background: hovered
            ? 'rgba(16,185,129,0.15)'
            : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          color: hovered ? '#10b981' : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
          transition: 'background 0.3s ease, color 0.3s ease',
        }}
      >
        <div style={{ width: 22, height: 22 }}>{icon}</div>
      </div>

      {/* Name */}
      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          color: hovered ? '#10b981' : isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.8)',
          marginBottom: 6,
          transition: 'color 0.25s ease',
          lineHeight: 1.2,
        }}
      >
        {name}
      </p>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 300,
          fontSize: 12,
          color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </p>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '1px',
          width: hovered ? '100%' : '0%',
          background: 'linear-gradient(90deg, #10b981, transparent)',
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </div>
  )
}

/* ─── SVG icons ─────────────────────────────────────────────────────── */

const ChessIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
    <path d="M9 4h1V2h4v2h1l1 5H8L9 4z"/>
    <path d="M8 9c0 0-1 1-1 3h10c0-2-1-3-1-3"/>
    <rect x="7" y="12" width="10" height="3" rx="0.5"/>
    <path d="M6 19h12v1H6z"/>
    <path d="M7 15l-1 4h12l-1-4"/>
  </svg>
)

const TFTIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
    <polygon points="12 2 19.5 6.5 19.5 17.5 12 22 4.5 17.5 4.5 6.5"/>
    <path d="M12 7v5l3 3"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
  </svg>
)

const BookIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
    <line x1="9" y1="15" x2="12" y2="15"/>
  </svg>
)

const CubeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
    {/* inner grid lines */}
    <line x1="7.5" y1="9.5" x2="12" y2="12"/>
    <line x1="16.5" y1="9.5" x2="12" y2="12"/>
  </svg>
)

const INTERESTS: { name: string; subtitle: string; icon: React.ReactNode }[] = [
  { name: 'Chess',            subtitle: 'Strategic & analytical thinking',   icon: ChessIcon },
  { name: 'Teamfight Tactics',subtitle: 'Tactical autobattler strategy',      icon: TFTIcon   },
  { name: 'Books',            subtitle: 'Classic & contemporary literature',  icon: BookIcon  },
  { name: "Rubik's Cube",     subtitle: 'Pattern recognition & solving',      icon: CubeIcon  },
]

/* ─── Section ───────────────────────────────────────────────────────── */

export function AboutSection({ visible, isDark }: Props) {
  const isMobile = useIsMobile()
  const label1  = useFadeIn(0)
  const head1   = useFadeIn(0.1)
  const para1   = useFadeIn(0.2)
  const divider = useFadeIn(0.3)
  const label2  = useFadeIn(0.35)
  const head2   = useFadeIn(0.45)
  const para2   = useFadeIn(0.55)

  return (
    <section
      id="about"
      className="relative z-10 min-h-screen flex items-center justify-center px-5 md:px-12 lg:px-20 py-24"
      style={{
        pointerEvents: 'none',
        background: isDark ? '#12121a' : '#ffffff',
      }}
    >
      <div
        className="w-full"
        style={{ maxWidth: 860, pointerEvents: visible ? 'auto' : 'none' }}
      >
        {/* Overview label */}
        <p
          ref={label1.ref}
          className="font-mono text-[11px] tracking-[0.45em] text-emerald-400 uppercase mb-3"
          style={label1.style}
        >
          Introduction
        </p>

        {/* Overview heading */}
        <h2
          ref={head1.ref}
          className="text-4xl md:text-5xl dark:text-white text-gray-900 mb-6 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, ...head1.style }}
        >
          Overview.
        </h2>

        {/* Overview body */}
        <p
          ref={para1.ref}
          className="text-[15px] leading-relaxed dark:text-white/55 text-gray-500 mb-16"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300, ...para1.style }}
        >
          I'm a dedicated and highly motivated software developer, holding a Master of Science
          (M.Sc.) degree in Computer Science. While I am currently at the start of my professional
          journey, I bring a robust foundational knowledge and a drive for learning that rapidly
          translates into effective coding. My core technical focus lies at the intersection of
          Machine Learning (ML) and Web Application Development. I specialize in creating
          intelligent, data-driven solutions and building efficient, scalable web interfaces.
          I am proficient in Python for data manipulation and modeling, with hands-on experience
          using frameworks like TensorFlow and Keras to design and implement robust ML models.
          My work in this area involves the full pipeline: from data preprocessing and feature
          engineering to model training and performance evaluation. On the development side,
          I utilize React to build modern, dynamic user interfaces. I also possess experience
          with Three.js, focusing on the creation of engaging 3D visuals and web experiences.
        </p>

        {/* Divider */}
        <div
          ref={divider.ref}
          className="mb-12 h-px"
          style={{
            width: '64px',
            background: 'linear-gradient(90deg, #10b981, transparent)',
            ...divider.style,
          }}
        />

        {/* Interests label */}
        <p
          ref={label2.ref}
          className="font-mono text-[11px] tracking-[0.45em] text-emerald-400 uppercase mb-3"
          style={label2.style}
        >
          What I enjoy doing
        </p>

        {/* Interests heading */}
        <h2
          ref={head2.ref}
          className="text-4xl md:text-5xl dark:text-white text-gray-900 mb-6 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, ...head2.style }}
        >
          Interests.
        </h2>

        {/* Interests body */}
        <p
          ref={para2.ref}
          className="text-[15px] leading-relaxed dark:text-white/55 text-gray-500 mb-10"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300, ...para2.style }}
        >
          I thrive on tackling real-world problems and collaborating closely to deliver efficient,
          scalable, and user-friendly solutions. My ability to learn quickly ensures I can adapt
          to new challenges and technologies to meet specific client needs.{' '}
          Beyond the code, I maintain a keen interest in strategic and analytical pursuits,
          including playing chess and Teamfight Tactics (TFT). I also enjoy the challenge of
          solving the Rubik's Cube and engaging with classic and contemporary literature.
          These hobbies reflect my analytical mindset and dedication to problem-solving.
        </p>

        {/* Interest cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {INTERESTS.map((item, i) => (
            <InterestCard
              key={item.name}
              name={item.name}
              subtitle={item.subtitle}
              icon={item.icon}
              isDark={isDark}
              delay={0.65 + i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
