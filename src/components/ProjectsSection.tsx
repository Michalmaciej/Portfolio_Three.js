import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

interface Props {
  isDark: boolean
  visible: boolean
}

/* ─── Data ───────────────────────────────────────────────────────────── */

const TAG_COLORS: Record<string, string> = {
  'blue-text-gradient':  'rgba(96,165,250,1)',
  'green-text-gradient': 'rgba(16,185,129,1)',
  'pink-text-gradient':  'rgba(244,114,182,1)',
}

import signImg      from '../assets/projects/signrecognition.webp'
import portfolioImg from '../assets/projects/mywebsite.png'
import mathImg      from '../assets/projects/mathequation.png'
import brainImg     from '../assets/projects/brainscan.jpg'
import cryptoImg    from '../assets/projects/crypto.jpg'
import libraryImg   from '../assets/projects/library.png'

const PROJECTS = [
  {
    name: 'Sign Language Recognition',
    description:
      'Designed and implemented a model recognizing American Sign Language expressions with facial expression analysis. Feature vector extracted from MediaPipe was reduced via a cascade of autoencoders; the model is based on the LSTM network.',
    tags: [
      { name: 'tensorflow',  color: 'blue-text-gradient' },
      { name: 'numpy',       color: 'green-text-gradient' },
      { name: 'pandas',      color: 'pink-text-gradient' },
    ],
    letter: 'SL',
    accent: 'rgba(96,165,250,0.7)',
    image: signImg as string | null,
    source_code_link: 'https://github.com/Michalmaciej/Sign-language-recognition',
    live_link: null,
    inProgress: false,
  },
  {
    name: 'Portfolio Website',
    description:
      'Portfolio website built with React, Three.js and TailwindCSS — describing education, employment history, projects and skills. Features 3D models created in Blender.',
    tags: [
      { name: 'react',       color: 'blue-text-gradient' },
      { name: 'tailwindcss', color: 'green-text-gradient' },
      { name: 'three.js',    color: 'pink-text-gradient' },
    ],
    letter: 'PW',
    accent: 'rgba(16,185,129,0.7)',
    image: portfolioImg as string | null,
    source_code_link: 'https://github.com/Michalmaciej/Portfolio_Three.js',
    live_link: 'https://www.michalmaciej.com',
    inProgress: false,
  },
  {
    name: 'Math Equation Solver',
    description:
      'Web service where users draw a mathematical equation and receive its solution. A Transformer trained on CROHME recognizes the drawing and converts to LaTeX; equations are solved using SymPy.',
    tags: [
      { name: 'pytorch',   color: 'blue-text-gradient' },
      { name: 'streamlit', color: 'green-text-gradient' },
      { name: 'sympy',     color: 'pink-text-gradient' },
    ],
    letter: 'ME',
    accent: 'rgba(244,114,182,0.7)',
    image: mathImg as string | null,
    source_code_link: 'https://github.com/Michalmaciej/Math-Equation-Solver',
    live_link: 'https://mathequation.michalmaciej.com',
    inProgress: false,
  },
  {
    name: 'CT Brain Scan Segmentation',
    description:
      'Automated brain tumour segmentation on CT scans using deep learning. Medical imaging pipeline built with MONAI and PyTorch, served via a Flask API.',
    tags: [
      { name: 'pytorch', color: 'blue-text-gradient' },
      { name: 'monai',   color: 'green-text-gradient' },
      { name: 'flask',   color: 'pink-text-gradient' },
    ],
    letter: 'CT',
    accent: 'rgba(167,139,250,0.7)',
    image: brainImg as string | null,
    source_code_link: 'https://github.com/Michalmaciej/CT-Brain-Scan-Segmentation',
    live_link: 'https://ctbrainscan.michalmaciej.com',
    inProgress: true,
  },
  {
    name: 'Crypto Trading Bot',
    description:
      'Automated cryptocurrency trading system with a TensorFlow-based prediction model, Django backend and React dashboard for real-time monitoring.',
    tags: [
      { name: 'tensorflow', color: 'blue-text-gradient' },
      { name: 'django',     color: 'green-text-gradient' },
      { name: 'react',      color: 'pink-text-gradient' },
    ],
    letter: 'CB',
    accent: 'rgba(251,191,36,0.7)',
    image: cryptoImg as string | null,
    source_code_link: 'https://github.com/Michalmaciej/Crypto-currency-trading-bot',
    live_link: 'https://cryptotrading.michalmaciej.com',
    inProgress: true,
  },
  {
    name: 'Network Attacks Detection',
    description:
      'Tested generative language models (ChatGPT) for network anomaly detection, comparing accuracy against logistic regression, decision trees, naive Bayes, k-NN, autoencoders, GANs, VAEs and the OpenAI API.',
    tags: [
      { name: 'scikit-learn', color: 'blue-text-gradient' },
      { name: 'keras',        color: 'green-text-gradient' },
      { name: 'tensorflow',   color: 'pink-text-gradient' },
    ],
    letter: 'NA',
    accent: 'rgba(239,68,68,0.7)',
    image: null as string | null,
    source_code_link: 'https://github.com/Michalmaciej/ML-models-in-attacts-detection',
    live_link: null,
    inProgress: false,
  },
  {
    name: 'Online Library',
    description:
      'A web platform where you can catalogue books, films, manhwa and series you have read or watched, leave reviews and ratings, and receive personalised recommendations generated by a machine learning model.',
    tags: [
      { name: 'django',     color: 'blue-text-gradient' },
      { name: 'react',      color: 'green-text-gradient' },
      { name: 'tensorflow', color: 'pink-text-gradient' },
    ],
    letter: 'OL',
    accent: 'rgba(52,211,153,0.7)',
    image: libraryImg as string | null,
    source_code_link: 'https://github.com/Michalmaciej/bookslibrary',
    live_link: 'https://bookslibrary.michalmaciej.com',
    inProgress: true,
  },
]

/* ─── GitHub icon ────────────────────────────────────────────────────── */

function GithubIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

/* ─── Project Card ───────────────────────────────────────────────────── */

function ProjectCard({
  project,
  isDark,
  order,
}: {
  project: typeof PROJECTS[number]
  isDark: boolean
  order: number
}) {
  const [hovered,  setHovered]  = useState(false)
  const [visible,  setVisible]  = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Small column stagger so same-row cards don't pop in simultaneously
  const delay = (order % 3) * 0.07

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s, border-color 0.25s, box-shadow 0.25s`,
        background: isDark ? '#14141e' : '#f6f6f9',
        border: `1px solid ${hovered ? project.accent.replace('0.7', '0.5') : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'}`,
        boxShadow: hovered
          ? `0 0 0 1px ${project.accent.replace('0.7', '0.08')}, 0 12px 36px ${project.accent.replace('0.7', '0.12')}`
          : isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image / accent area */}
      <div style={{
        height: 140,
        position: 'relative',
        background: isDark ? '#0d0d18' : '#e8e8f0',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {project.image ? (
          /* Photo */
          <>
            <img
              src={project.image}
              alt={project.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: hovered ? 0.9 : 0.75,
                transition: 'opacity 0.3s',
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            {/* Dark overlay so buttons stay readable */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
            }} />
          </>
        ) : (
          /* Letter placeholder */
          <>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(ellipse at 30% 50%, ${project.accent.replace('0.7', '0.18')}, transparent 70%)`,
              transition: 'opacity 0.3s',
              opacity: hovered ? 1 : 0.6,
            }} />
            <span style={{
              position: 'absolute',
              bottom: -10,
              left: 16,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 72,
              lineHeight: 1,
              color: project.accent.replace('0.7', hovered ? '0.2' : '0.12'),
              transition: 'color 0.3s',
              userSelect: 'none',
              letterSpacing: '-2px',
            }}>
              {project.letter}
            </span>
          </>
        )}

        {/* Top accent line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: hovered
            ? `linear-gradient(90deg, ${project.accent}, transparent)`
            : 'transparent',
          transition: 'background 0.3s',
        }} />

        {/* In Progress badge */}
        {project.inProgress && (
          <span style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontFamily: "'Space Grotesk', monospace",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(251,191,36,0.9)',
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: 2,
            padding: '2px 7px',
          }}>
            In Progress
          </span>
        )}

        {/* Buttons row — always visible, bottom of image area */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: 12,
          display: 'flex',
          gap: 6,
        }}>
          {/* GitHub */}
          <a
            href={project.source_code_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 11px',
              borderRadius: 2,
              background: 'rgba(10,10,16,0.72)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.88)',
              textDecoration: 'none',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(30,30,46,0.9)'
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.35)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(10,10,16,0.72)'
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.18)'
            }}
          >
            <GithubIcon size={11} color="currentColor" />
            Source
          </a>

          {/* Live */}
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 11px',
                borderRadius: 2,
                background: project.accent.replace('0.7', '0.28'),
                border: `1px solid ${project.accent.replace('0.7', '0.7')}`,
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', monospace",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = project.accent.replace('0.7', '0.5')
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = project.accent.replace('0.7', '0.28')
              }}
            >
              <span style={{ fontSize: 8, lineHeight: 1 }}>●</span>
              Live
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Name */}
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          color: isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.82)',
          lineHeight: 1.25,
        }}>
          {project.name}
        </p>

        {/* Description */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 300,
          fontSize: 12,
          color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.45)',
          lineHeight: 1.65,
          flex: 1,
        }}>
          {project.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {project.tags.map(tag => (
            <span
              key={tag.name}
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.06em',
                color: TAG_COLORS[tag.color],
                opacity: 0.8,
              }}
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Section ────────────────────────────────────────────────────────── */

export function ProjectsSection({ isDark, visible }: Props) {
  const isMobile = useIsMobile()
  const labelRef = useRef<HTMLParagraphElement>(null)
  const [headerIn, setHeaderIn] = useState(false)

  useEffect(() => {
    const el = labelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderIn(true) },
      { threshold: 0.15 }
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
      id="projects"
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
          Selected Work
        </p>
        <h2
          className="text-4xl md:text-5xl dark:text-white text-gray-900 mb-5 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, ...fadeIn(0.1) }}
        >
          Projects.
        </h2>

        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            lineHeight: 1.75,
            color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.45)',
            maxWidth: 580,
            marginBottom: 48,
            ...fadeIn(0.18),
          }}
        >
          The projects presented below demonstrate my skills and knowledge of specific technologies.
          All of them are based on real-world problems and needs. Each project is briefly described
          with links to code repositories. It reflects my ability to solve complex problems, work
          with diverse technologies, and manage projects effectively.
        </p>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              isDark={isDark}
              order={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
