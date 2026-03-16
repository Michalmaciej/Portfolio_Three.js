import { useEffect, useRef } from 'react'

const COUNT = 75
const MAX_DIST = 155
const SPEED = 0.22

interface Particle { x: number; y: number; vx: number; vy: number }

interface Props { isDark: boolean }

export function BackgroundScene({ isDark }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDarkRef = useRef(isDark)

  useEffect(() => { isDarkRef.current = isDark }, [isDark])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * SPEED * 2,
      vy: (Math.random() - 0.5) * SPEED * 2,
    }))

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    let animId: number
    let paused = false
    const onVisibilityChange = () => {
      if (document.hidden) { paused = true; cancelAnimationFrame(animId) }
      else { paused = false; tick() }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const tick = () => {
      if (paused) return
      animId = requestAnimationFrame(tick)
      ctx.clearRect(0, 0, w, h)

      const rgb = isDarkRef.current ? '16,185,129' : '5,150,105'

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},0.65)`
        ctx.fill()
      }

      for (let i = 0; i < particles.length - 1; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / MAX_DIST) * 0.18})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #10b98122 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />

      {/* Floating glow orbs */}
      <div
        className="orb-a absolute -top-40 right-[10%] w-[520px] h-[520px] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)' }}
      />
      <div
        className="orb-b absolute bottom-[-80px] left-[5%] w-[480px] h-[480px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.09), transparent 70%)' }}
      />
      <div
        className="absolute top-[40%] left-[60%] w-[320px] h-[320px] rounded-full blur-[90px]"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)' }}
      />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
