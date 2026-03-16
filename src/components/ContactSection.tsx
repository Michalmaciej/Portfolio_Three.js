import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useIsMobile } from '../hooks/useIsMobile'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import chessModelUrl from '../assets/models/chess.glb?url'

interface Props {
  isDark: boolean
  visible: boolean
}

/* ─── Helpers ────────────────────────────────────────────────────────── */

function centerAndScale(model: THREE.Object3D, targetSize: number) {
  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = maxDim > 0 ? targetSize / maxDim : 1
  model.scale.setScalar(scale)
  model.updateMatrixWorld(true)
  const box2 = new THREE.Box3().setFromObject(model)
  const center = box2.getCenter(new THREE.Vector3())
  model.position.x -= center.x
  model.position.y -= center.y
  model.position.z -= center.z
}

function applyChessColors(obj: THREE.Object3D, isDark: boolean) {
  const color = isDark ? 0xf2f2f2 : 0x111111
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.color.set(color)
          m.roughness = isDark ? 0.65 : 0.2
          m.metalness = isDark ? 0.0 : 0.08
          m.needsUpdate = true
        }
      })
    }
  })
}

function applyLights(
  ambient: THREE.AmbientLight,
  key: THREE.DirectionalLight,
  fill: THREE.DirectionalLight,
  rim: THREE.DirectionalLight,
  top: THREE.DirectionalLight,
  isDark: boolean,
) {
  if (isDark) {
    ambient.intensity = 0.4
    key.intensity = 3.0; key.color.set(0xffffff)
    fill.intensity = 0.6; fill.color.set(0xd0e8ff)
    rim.intensity = 1.8;  rim.color.set(0x10b981)
    top.intensity = 2.5;  top.color.set(0xffffff)
  } else {
    ambient.intensity = 1.2
    key.intensity = 3.0; key.color.set(0xffffff)
    fill.intensity = 1.0; fill.color.set(0xffffff)
    rim.intensity = 0.5;  rim.color.set(0xffffff)
    top.intensity = 1.5;  top.color.set(0xffffff)
  }
}

/* ─── Contact form ───────────────────────────────────────────────────── */

type SendStatus = 'idle' | 'sending' | 'sent'

function ContactForm({ isDark, visible }: { isDark: boolean; visible: boolean }) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState<SendStatus>('idle')
  const [dots,    setDots]    = useState('')

  const fg      = isDark ? '#fff'                   : '#111'
  const fgMuted = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.42)'
  const border  = isDark ? 'rgba(255,255,255,0.1)'  : 'rgba(0,0,0,0.1)'
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
  const focusBorder = '#10b981'

  // Animate dots while sending
  useEffect(() => {
    if (status !== 'sending') { setDots(''); return }
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 320)
    return () => clearInterval(id)
  }, [status])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: inputBg,
    border: `1px solid ${border}`,
    borderRadius: 10,
    padding: '13px 15px',
    color: fg,
    fontSize: 14,
    fontFamily: "'Space Grotesk', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, opacity 0.4s',
    opacity: status !== 'idle' ? 0.35 : 1,
    pointerEvents: status !== 'idle' ? 'none' : 'auto',
  }

  const handleSubmit = () => {
    if (!name || !email || !message || status !== 'idle') return
    setStatus('sending')
    emailjs.send(
      'service_zznbvjw',
      'template_ir7jajy',
      {
        from_name: name,
        to_name: 'Michał Maciej',
        from_email: email,
        to_email: 'mich.kowa.01@gmail.com',
        message,
      },
      'aE7cy2XOGEDRPJfdD'
    ).then(
      () => {
        setStatus('sent')
        setTimeout(() => {
          setStatus('idle')
          setName(''); setEmail(''); setMessage('')
        }, 4000)
      },
      (err) => {
        console.error(err)
        setStatus('idle')
        alert('Something went wrong. Please try again.')
      }
    )
  }

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
  })

  return (
    <div style={{ position: 'relative', width: '100%' }}>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
        <div style={fadeUp(0)}>
          <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: fgMuted, marginBottom: 6 }}>Name</label>
          <input required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inputStyle}
            onFocus={e => { if (status === 'idle') e.target.style.borderColor = focusBorder }}
            onBlur={e => (e.target.style.borderColor = border)} />
        </div>

        <div style={fadeUp(0.06)}>
          <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: fgMuted, marginBottom: 6 }}>Email</label>
          <input required type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
            onFocus={e => { if (status === 'idle') e.target.style.borderColor = focusBorder }}
            onBlur={e => (e.target.style.borderColor = border)} />
        </div>

        <div style={fadeUp(0.12)}>
          <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: fgMuted, marginBottom: 6 }}>Message</label>
          <textarea required placeholder="What's on your mind?" value={message} onChange={e => setMessage(e.target.value)} rows={5}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
            onFocus={e => { if (status === 'idle') e.target.style.borderColor = focusBorder }}
            onBlur={e => (e.target.style.borderColor = border)} />
        </div>

        <div style={{ display: 'flex', gap: 10, ...fadeUp(0.18) }}>
          <button onClick={handleSubmit} type="button" style={{
            flex: 1, position: 'relative', overflow: 'hidden',
            background: status === 'sent' ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.45)',
            borderRadius: 10, color: '#10b981',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '13px 0', cursor: status === 'idle' ? 'pointer' : 'default',
            transition: 'background 0.3s',
          }}>
            {status === 'idle'    && 'Send Message'}
            {status === 'sending' && `Sending${dots}`}
            {status === 'sent'    && '✓ Sent!'}
          </button>

          <a href="/michal_maciej_CV.pdf" download="michal_maciej_CV.pdf" style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: inputBg, border: `1px solid ${border}`, borderRadius: 10,
            color: fgMuted, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
            fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '13px 0', textDecoration: 'none', transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = focusBorder)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
          >
            ↓ CV
          </a>
        </div>
      </div>

      {/* Sending / Sent overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
        pointerEvents: status === 'idle' ? 'none' : 'auto',
        opacity: status === 'idle' ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}>
        {status === 'sending' && (
          <>
            {/* Animated ring */}
            <div style={{ position: 'relative', width: 56, height: 56 }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%',
                border: '2px solid rgba(16,185,129,0.15)',
              }} />
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: '#10b981',
                animation: 'spin 0.9s linear infinite',
              }} />
              {/* envelope icon */}
              <svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, margin: 'auto', width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: fgMuted, letterSpacing: '0.05em' }}>
              Preparing message{dots}
            </span>
          </>
        )}
        {status === 'sent' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: fg, margin: 0 }}>Message sent!</p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: fgMuted, margin: '4px 0 0' }}>I will get back to you as soon as possible.</p>
            </div>
          </>
        )}
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes popIn { from { transform: scale(0.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  )
}

/* ─── Section ────────────────────────────────────────────────────────── */

const CAMERA_Z = 6
const FOV_DEG  = 42

export function ContactSection({ isDark, visible }: Props) {
  const isMobile = useIsMobile()
  const containerRef  = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const labelRef      = useRef<HTMLParagraphElement>(null)
  const isDarkRef     = useRef(isDark)
  const colorDirtyRef = useRef(true)
  const [headerIn,    setHeaderIn]    = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    isDarkRef.current = isDark
    colorDirtyRef.current = true
  }, [isDark])

  // Header scroll-in — bidirectional so animations replay on re-entry
  useEffect(() => {
    const el = labelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderIn(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Lazy init — start Three.js only when section is close to viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInitialized(true); obs.disconnect() } },
      { rootMargin: '400px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!initialized) return
    const container = containerRef.current
    const canvas    = canvasRef.current
    if (!container || !canvas) return

    const w = container.clientWidth  || window.innerWidth
    const h = container.clientHeight || window.innerHeight

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(FOV_DEG, w / h, 0.1, 100)
    camera.position.set(0, 0, CAMERA_Z)
    camera.lookAt(0, 0, 0)
    camera.updateMatrixWorld()

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const pmrem = new THREE.PMREMGenerator(renderer)
    pmrem.compileEquirectangularShader()
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()

    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xffffff, 3.0)
    key.position.set(3, 6, 4); scene.add(key)
    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.6)
    fill.position.set(-4, 1, 3); scene.add(fill)
    const rim = new THREE.DirectionalLight(0x10b981, 1.8)
    rim.position.set(-2, 0, -4); scene.add(rim)
    const top = new THREE.DirectionalLight(0xffffff, 2.5)
    top.position.set(0, 6, 0); scene.add(top)
    applyLights(ambient, key, fill, rim, top, isDarkRef.current)

    const wrapperChess = new THREE.Group()
    wrapperChess.position.x = 0.5
    scene.add(wrapperChess)

    let chessModel: THREE.Object3D | null = null
    let rotY = 0.3, rotX = 0.1
    let isDragging = false, lastX = 0, lastY = 0

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      lastX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      lastY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
    }
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const y = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
      rotY += (x - lastX) * 0.009
      rotX += (y - lastY) * 0.009
      wrapperChess.rotation.y = rotY
      wrapperChess.rotation.x = rotX
      lastX = x; lastY = y
    }
    const onUp = () => { isDragging = false }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('touchstart', onDown, { passive: true })
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)

    const loader = new GLTFLoader()
    loader.load(chessModelUrl, (gltf) => {
      const model = gltf.scene
      centerAndScale(model, 2.6)
      chessModel = model
      wrapperChess.add(model)
      applyChessColors(model, isDarkRef.current)
      colorDirtyRef.current = false
    }, undefined, (err) => console.warn('Chess:', err))

    const resizeObs = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          const w2 = container.clientWidth, h2 = container.clientHeight
          camera.aspect = w2 / h2
          camera.updateProjectionMatrix()
          renderer.setSize(w2, h2)
        })
      : null
    if (resizeObs) resizeObs.observe(container)

    let paused = false, sectionVisible = false
    const onVisibilityChange = () => {
      if (document.hidden) { paused = true; cancelAnimationFrame(animId) }
      else { paused = false; animate() }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const sectionObs = new IntersectionObserver(
      ([e]) => { sectionVisible = e.isIntersecting },
      { threshold: 0 }
    )
    sectionObs.observe(container)

    let animId: number
    const animate = () => {
      if (paused) return
      animId = requestAnimationFrame(animate)
      if (!sectionVisible) return

      if (colorDirtyRef.current && chessModel) {
        applyChessColors(chessModel, isDarkRef.current)
        applyLights(ambient, key, fill, rim, top, isDarkRef.current)
        colorDirtyRef.current = false
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      resizeObs?.disconnect()
      sectionObs.disconnect()
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('touchstart', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
      scene.environment?.dispose()
      renderer.dispose()
    }
  }, [initialized])

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: headerIn ? 1 : 0,
    transform: headerIn ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  })

  return (
    <section
      id="contact"
      className="relative z-10"
      style={{
        minHeight: '100vh',
        background: isDark ? '#12121a' : '#ffffff',
        pointerEvents: visible ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div className="flex justify-center px-5 md:px-12 lg:px-20" style={{ flexShrink: 0, paddingTop: 32, paddingBottom: 36 }}>
        <div style={{ width: '100%', maxWidth: 860 }}>
          <p
            ref={labelRef}
            className="font-mono text-[11px] tracking-[0.45em] text-emerald-400 uppercase mb-2"
            style={fadeIn(0)}
          >
            Get in touch
          </p>
          <h2
            className="dark:text-white text-gray-900"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, ...fadeIn(0.08) }}
          >
            Contact.
          </h2>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.45)',
              marginTop: 8,
              ...fadeIn(0.16),
            }}
          >
            Send me an email or download my CV.
          </p>
        </div>
      </div>

      {/* Main — form left, chess right */}
      <div
        className="flex justify-center px-5 md:px-12 lg:px-20"
        style={{ flex: 1, paddingBottom: 48 }}
      >
        <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 48, alignItems: isMobile ? 'stretch' : 'center' }}>

          {/* Contact form */}
          <div style={{ flex: 1, ...fadeIn(0.1) }}>
            <ContactForm isDark={isDark} visible={headerIn} />
          </div>

          {/* Chess canvas — hidden on mobile */}
          <div
            ref={containerRef}
            style={{ flex: 1, position: 'relative', height: isMobile ? 280 : 440, borderRadius: 16, overflow: 'hidden', display: isMobile ? 'none' : 'block' }}
          >
            <canvas
              ref={canvasRef}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
            />
            <span style={{
              position: 'absolute',
              bottom: 14,
              left: '62%',
              transform: 'translateX(-50%)',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}>
              drag to rotate
            </span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '20px 20px 24px 20px' : '20px 96px 24px 40px',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: 11, letterSpacing: '0.06em', color: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.25)' }}>
          © 2026 Michał Maciej
        </span>
        <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: 11, letterSpacing: '0.06em', color: isDark ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.5)' }}>
          Built with React + Three.js
        </span>
      </div>
    </section>
  )
}
