import { useCallback, useEffect, useRef, useState } from 'react'
import { LoadingScreen } from './components/LoadingScreen'
import { IPhoneScene } from './components/IPhoneScene'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { BackgroundScene } from './components/BackgroundScene'
import { AboutSection } from './components/AboutSection'
import { RubiksCubeSection } from './components/RubiksCubeSection'
import { EducationSection } from './components/EducationSection'
import { WorkSection } from './components/WorkSection'
import { SkillsSection } from './components/SkillsSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ContactSection } from './components/ContactSection'

const MIN_LOAD_MS = 1500
const FADE_DURATION_MS = 700
const PHONE_DISPLAY_MS = 19500

type CurtainPhase = 'hidden' | 'ready' | 'in' | 'out'

function App() {
  const [modelLoaded, setModelLoaded] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [shouldSlide, setShouldSlide] = useState(false)
  const [shrinkPhone, setShrinkPhone] = useState(false)
  const [showHero, setShowHero] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [heroActive, setHeroActive] = useState(true)
  const [phoneOpacity, setPhoneOpacity] = useState(1)
  const [curtainPhase, setCurtainPhase] = useState<CurtainPhase>('hidden')
  const [curtainBg, setCurtainBg] = useState('#12121a')
  const slideTriggered = useRef(false)
  const shrinkTriggered = useRef(false)
  const curtainAnimating = useRef(false)
  const isDarkRef = useRef(isDark)
  useEffect(() => { isDarkRef.current = isDark }, [isDark])

  // Fade + disable iPhone canvas when scrolled away from hero
  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.55))
      setPhoneOpacity(1 - progress)
      setHeroActive(window.scrollY < window.innerHeight * 0.4)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Minimum load timer
  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), MIN_LOAD_MS)
    return () => clearTimeout(t)
  }, [])

  // Fade out loader → slide phone in
  useEffect(() => {
    if (modelLoaded && minTimeElapsed && !slideTriggered.current) {
      slideTriggered.current = true
      setShowLoader(false)
      setTimeout(() => setShouldSlide(true), FADE_DURATION_MS)
    }
  }, [modelLoaded, minTimeElapsed])

  const triggerShrink = useCallback(() => {
    if (shrinkTriggered.current) return
    shrinkTriggered.current = true
    setShrinkPhone(true)
    setTimeout(() => setShowHero(true), 800)
  }, [])

  // Auto-trigger after PHONE_DISPLAY_MS
  useEffect(() => {
    if (!shouldSlide) return
    const t = setTimeout(triggerShrink, PHONE_DISPLAY_MS)
    return () => clearTimeout(t)
  }, [shouldSlide, triggerShrink])

  const handleModelLoaded = useCallback(() => setModelLoaded(true), [])

  const handleToggle = useCallback(() => {
    if (curtainAnimating.current) return
    curtainAnimating.current = true
    const newDark = !isDarkRef.current
    setCurtainBg(newDark ? '#12121a' : '#f0fdf4')
    setCurtainPhase('ready')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCurtainPhase('in')
        setTimeout(() => {
          setIsDark(d => !d)
          setCurtainPhase('out')
          setTimeout(() => {
            setCurtainPhase('hidden')
            curtainAnimating.current = false
          }, 420)
        }, 380)
      })
    })
  }, [])

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="relative w-full min-h-screen bg-white dark:bg-[#12121a] transition-colors duration-500">
        <BackgroundScene isDark={isDark} />
        <IPhoneScene
          onLoaded={handleModelLoaded}
          shouldSlide={shouldSlide}
          shrink={shrinkPhone}
          interactive={heroActive}
          opacity={phoneOpacity}
        />
        <LoadingScreen isVisible={showLoader} />

        <Navbar isDark={isDark} onToggle={handleToggle} visible={showHero} />
        <HeroSection visible={showHero} />
        <AboutSection visible={showHero} isDark={isDark} />
        <RubiksCubeSection isDark={isDark} visible={showHero} />
        <EducationSection isDark={isDark} visible={showHero} />
        <WorkSection isDark={isDark} visible={showHero} />
        <SkillsSection isDark={isDark} visible={showHero} />
        <ProjectsSection isDark={isDark} visible={showHero} />
        <ContactSection isDark={isDark} visible={showHero} />

        {/* Skip button — visible after phone slides in, disappears on shrink */}
        {shouldSlide && !shrinkPhone && (
          <button
            onClick={triggerShrink}
            className="fixed bottom-7 right-7 z-20 px-4 py-2 font-mono text-xs tracking-widest text-emerald-400/50 border border-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 backdrop-blur-sm transition-all duration-200"
          >
            Skip →
          </button>
        )}

        {/* Theme curtain */}
        {curtainPhase !== 'hidden' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 300,
              background: curtainBg,
              transform:
                curtainPhase === 'in' ? 'translateX(0)'
                : curtainPhase === 'out' ? 'translateX(100%)'
                : 'translateX(-100%)',
              transition:
                curtainPhase === 'in' || curtainPhase === 'out'
                  ? 'transform 0.38s cubic-bezier(0.4,0,0.2,1)'
                  : 'none',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App
