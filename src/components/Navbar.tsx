import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const NAV_LINKS = ['About', 'Education', 'Work', 'Skills', 'Projects', 'Contact']

interface Props {
  isDark: boolean
  onToggle: () => void
  visible: boolean
}

export function Navbar({ isDark, onToggle, visible }: Props) {
  const [popping, setPopping] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleToggle = () => {
    setPopping(true)
    onToggle()
  }

  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <nav
          className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-16px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            pointerEvents: visible ? 'auto' : 'none',
            backgroundColor: isDark ? '#12121a' : '#ffffff',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
          }}
        >
          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #10b98150 25%, #10b981 50%, #10b98150 75%, transparent 100%)',
            }}
          />

          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 flex items-center justify-center rotate-45 border border-emerald-400/80 shrink-0"
              style={{
                boxShadow: isDark
                  ? '0 0 14px rgba(16,185,129,0.3), inset 0 0 6px rgba(16,185,129,0.08)'
                  : '0 0 8px rgba(16,185,129,0.15)',
              }}
            >
              <span
                className="-rotate-45 text-emerald-400 text-[10px] select-none leading-none"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
              >
                MM
              </span>
            </div>
            <span
              className="text-[13px] tracking-tight"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
              }}
            >
              Michał Maciej
            </span>
          </a>

          {/* Right side: toggle + hamburger */}
          <div className="flex items-center gap-3">
            {/* Dark/light toggle pill — compact */}
            <button
              onClick={handleToggle}
              onAnimationEnd={() => setPopping(false)}
              aria-label="Toggle dark mode"
              className={`relative w-7 h-13.5 rounded-full border transition-all duration-400 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${popping ? 'toggle-pop' : ''}`}
              style={{
                background: isDark ? '#071f12' : '#ecfdf5',
                borderColor: isDark ? 'rgba(16,185,129,0.45)' : 'rgba(5,150,105,0.35)',
                boxShadow: isDark ? '0 0 14px rgba(16,185,129,0.22)' : 'none',
              }}
            >
              <svg
                className="absolute top-1.75 left-1/2 -translate-x-1/2 transition-all duration-300"
                style={{ opacity: isDark ? 0.25 : 1, width: 12, height: 12 }}
                viewBox="0 0 24 24" fill="none" stroke={isDark ? '#10b981' : '#059669'} strokeWidth="2.5" strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2"  x2="12" y2="5"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="2"  y1="12" x2="5"  y2="12"/>
                <line x1="19" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="4.93"   x2="7.05" y2="7.05"/>
                <line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/>
                <line x1="4.93" y1="19.07"  x2="7.05" y2="16.95"/>
                <line x1="16.95" y1="7.05"  x2="19.07" y2="4.93"/>
              </svg>
              <svg
                className="absolute bottom-1.75 left-1/2 -translate-x-1/2 transition-all duration-300"
                style={{ opacity: isDark ? 1 : 0.25, width: 12, height: 12 }}
                viewBox="0 0 24 24" fill="none" stroke={isDark ? '#10b981' : '#059669'} strokeWidth="2.5" strokeLinecap="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <span
                className="absolute left-0.75 w-5.5 h-5.5 rounded-full transition-all duration-400 shadow-md"
                style={{
                  top: isDark ? 'calc(100% - 25px)' : '3px',
                  background: isDark
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #059669, #047857)',
                  boxShadow: isDark ? '0 2px 8px rgba(16,185,129,0.5)' : '0 2px 6px rgba(5,150,105,0.3)',
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Open menu"
              className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="block h-0.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === 1 ? (menuOpen ? '20px' : '14px') : '20px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                    transform: menuOpen
                      ? i === 0 ? 'translateY(8px) rotate(45deg)'
                      : i === 2 ? 'translateY(-8px) rotate(-45deg)'
                      : 'scaleX(0)'
                      : 'none',
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>

        {/* Mobile overlay menu */}
        <div
          className="fixed inset-0 z-20 flex flex-col"
          style={{
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
            transition: 'opacity 0.25s ease',
            backgroundColor: isDark ? 'rgba(18,18,26,0.97)' : 'rgba(255,255,255,0.97)',
            paddingTop: '56px',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-2xl tracking-wide transition-all duration-200"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 500,
                  color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
                  transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 0.3s ease ${i * 0.05}s, opacity 0.3s ease ${i * 0.05}s, color 0.2s ease`,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#10b981')}
                onMouseLeave={e => (e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </>
    )
  }

  // Desktop sidebar (unchanged)
  return (
    <nav
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed top-0 right-0 h-full z-30 flex flex-col items-center py-8 transition-all duration-700 overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
        pointerEvents: visible ? 'auto' : 'none',
        width: expanded ? '160px' : '56px',
        transition: 'opacity 0.7s ease, transform 0.7s ease, width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Solid background */}
      <div
        className="absolute inset-0 border-l"
        style={{
          backgroundColor: isDark ? '#12121a' : '#ffffff',
          borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
        }}
      />

      {/* Left accent line */}
      <div
        className="absolute top-0 left-0 bottom-0 w-px"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, #10b98150 25%, #10b981 50%, #10b98150 75%, transparent 100%)',
        }}
      />

      {/* Top: logo + toggle */}
      <div className="relative flex flex-col items-center gap-5">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 overflow-hidden" style={{ width: expanded ? '148px' : '36px', transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
          <div
            className="w-9 h-9 flex items-center justify-center rotate-45 border border-emerald-400/80 shrink-0 transition-transform duration-300 hover:scale-110"
            style={{
              boxShadow: isDark
                ? '0 0 14px rgba(16,185,129,0.3), inset 0 0 6px rgba(16,185,129,0.08)'
                : '0 0 8px rgba(16,185,129,0.15)',
            }}
          >
            <span
              className="-rotate-45 text-emerald-400 text-[10px] select-none leading-none"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              MM
            </span>
          </div>
          <span
            className="whitespace-nowrap text-[11px] tracking-tight shrink-0 transition-opacity duration-300"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
              opacity: expanded ? 1 : 0,
            }}
          >
            Michał Maciej
          </span>
        </a>

        {/* Divider */}
        <div className="w-5 h-px dark:bg-white/10 bg-black/10" />

        {/* Toggle */}
        <button
          onClick={handleToggle}
          onAnimationEnd={() => setPopping(false)}
          aria-label="Toggle dark mode"
          className={`relative w-7 h-13.5 rounded-full border transition-all duration-400 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${popping ? 'toggle-pop' : ''}`}
          style={{
            background: isDark ? '#071f12' : '#ecfdf5',
            borderColor: isDark ? 'rgba(16,185,129,0.45)' : 'rgba(5,150,105,0.35)',
            boxShadow: isDark ? '0 0 14px rgba(16,185,129,0.22)' : 'none',
          }}
        >
          <svg
            className="absolute top-1.75 left-1/2 -translate-x-1/2 transition-all duration-300"
            style={{ opacity: isDark ? 0.25 : 1, width: 12, height: 12 }}
            viewBox="0 0 24 24" fill="none" stroke={isDark ? '#10b981' : '#059669'} strokeWidth="2.5" strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2"  x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="2"  y1="12" x2="5"  y2="12"/>
            <line x1="19" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="4.93"   x2="7.05" y2="7.05"/>
            <line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/>
            <line x1="4.93" y1="19.07"  x2="7.05" y2="16.95"/>
            <line x1="16.95" y1="7.05"  x2="19.07" y2="4.93"/>
          </svg>
          <svg
            className="absolute bottom-1.75 left-1/2 -translate-x-1/2 transition-all duration-300"
            style={{ opacity: isDark ? 1 : 0.25, width: 12, height: 12 }}
            viewBox="0 0 24 24" fill="none" stroke={isDark ? '#10b981' : '#059669'} strokeWidth="2.5" strokeLinecap="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span
            className="absolute left-0.75 w-5.5 h-5.5 rounded-full transition-all duration-400 shadow-md"
            style={{
              top: isDark ? 'calc(100% - 25px)' : '3px',
              background: isDark
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #059669, #047857)',
              boxShadow: isDark ? '0 2px 8px rgba(16,185,129,0.5)' : '0 2px 6px rgba(5,150,105,0.3)',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </button>
      </div>

      <div className="flex-1" />

      {/* Nav links */}
      <div className="relative flex flex-col items-start gap-5 px-3">
        {NAV_LINKS.map(link => {
          const linkColor = hoveredLink === link
            ? '#10b981'
            : isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)'
          return (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onMouseEnter={() => setHoveredLink(link)}
              onMouseLeave={() => setHoveredLink(null)}
              className="flex items-center gap-1.5 transition-all duration-200"
            >
              <span
                className="shrink-0 w-1 h-1 rounded-full bg-emerald-400 transition-all duration-200"
                style={{ opacity: hoveredLink === link && expanded ? 1 : 0 }}
              />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: hoveredLink === link ? 500 : 400,
                  color: linkColor,
                  fontSize: 12,
                  lineHeight: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {link[0]}
                <span
                  style={{
                    display: 'inline-block',
                    maxWidth: expanded ? '100px' : '0px',
                    overflow: 'hidden',
                    opacity: expanded ? 1 : 0,
                    whiteSpace: 'nowrap',
                    transition: 'max-width 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease',
                  }}
                >{link.slice(1)}</span>
              </span>
            </a>
          )
        })}
      </div>

      <div className="h-8" />
    </nav>
  )
}
