import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  isDark: boolean
  visible: boolean
}

// Face color palette
const C = {
  R: 0x23c55e, // emerald green  (right +x)
  L: 0x3b82f6, // blue           (left  -x)
  U: 0xf0f0f0, // white          (up    +y)
  D: 0xfbbf24, // yellow         (down  -y)
  F: 0xef4444, // red            (front +z)
  B: 0xf97316, // orange         (back  -z)
  X: 0x0d0d0d, // black          (inner faces)
}

// BoxGeometry face order: +x, -x, +y, -y, +z, -z
function faceColors(x: number, y: number, z: number): number[] {
  return [
    x ===  1 ? C.R : C.X,
    x === -1 ? C.L : C.X,
    y ===  1 ? C.U : C.X,
    y === -1 ? C.D : C.X,
    z ===  1 ? C.F : C.X,
    z === -1 ? C.B : C.X,
  ]
}

type Axis = 'x' | 'y' | 'z'

interface Move {
  label: string
  axis: Axis
  layer: number
  angle: number
}

const MOVES: Move[] = [
  { label: 'U',  axis: 'y', layer:  1, angle:  Math.PI / 2 },
  { label: "U'", axis: 'y', layer:  1, angle: -Math.PI / 2 },
  { label: 'D',  axis: 'y', layer: -1, angle: -Math.PI / 2 },
  { label: "D'", axis: 'y', layer: -1, angle:  Math.PI / 2 },
  { label: 'R',  axis: 'x', layer:  1, angle: -Math.PI / 2 },
  { label: "R'", axis: 'x', layer:  1, angle:  Math.PI / 2 },
  { label: 'L',  axis: 'x', layer: -1, angle:  Math.PI / 2 },
  { label: "L'", axis: 'x', layer: -1, angle: -Math.PI / 2 },
  { label: 'F',  axis: 'z', layer:  1, angle:  Math.PI / 2 },
  { label: "F'", axis: 'z', layer:  1, angle: -Math.PI / 2 },
  { label: 'B',  axis: 'z', layer: -1, angle: -Math.PI / 2 },
  { label: "B'", axis: 'z', layer: -1, angle:  Math.PI / 2 },
]

function MoveButton({ move, onMove, isDark }: { move: Move; onMove: (m: Move) => void; isDark: boolean }) {
  const isPrime = move.label.includes("'")
  return (
    <button
      onClick={() => onMove(move)}
      style={{
        fontFamily: "'Space Grotesk', monospace",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.05em',
        padding: '6px 10px',
        border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.5)'}`,
        background: isPrime
          ? isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)'
          : isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)',
        color: '#10b981',
        cursor: 'pointer',
        borderRadius: 2,
        minWidth: 36,
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        ;(e.target as HTMLButtonElement).style.background = 'rgba(16,185,129,0.22)'
        ;(e.target as HTMLButtonElement).style.borderColor = 'rgba(16,185,129,0.8)'
      }}
      onMouseLeave={e => {
        ;(e.target as HTMLButtonElement).style.background = isPrime
          ? isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)'
          : isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)'
        ;(e.target as HTMLButtonElement).style.borderColor = isDark
          ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.5)'
      }}
    >
      {move.label}
    </button>
  )
}

export function RubiksCubeSection({ isDark, visible }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const queueRef = useRef<Move[]>([])
  const doMoveRef = useRef<((m: Move) => void) | null>(null)
  const resetRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const W = canvas.clientWidth
    const H = canvas.clientHeight
    canvas.width = W * Math.min(devicePixelRatio, 2)
    canvas.height = H * Math.min(devicePixelRatio, 2)

    // Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100)
    camera.position.set(0, 0, 10)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.shadowMap.enabled = false

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.4))
    const key = new THREE.DirectionalLight(0xffffff, 1.8)
    key.position.set(4, 6, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 0.6)
    fill.position.set(-3, -2, -3)
    scene.add(fill)

    // Cube group (handles whole-cube orbit drag)
    const cubeGroup = new THREE.Group()
    cubeGroup.rotation.x = 0.4
    cubeGroup.rotation.y =  0.65
    scene.add(cubeGroup)

    // Build 27 cubies
    interface Cubie { mesh: THREE.Mesh; pos: THREE.Vector3 }
    const cubies: Cubie[] = []

    const geo = new THREE.BoxGeometry(0.925, 0.925, 0.925)

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const colors = faceColors(x, y, z)
          const mats = colors.map(col =>
            new THREE.MeshStandardMaterial({
              color: col,
              roughness: col === C.X ? 0.95 : 0.25,
              metalness: col === C.X ? 0   : 0.05,
            })
          )
          const mesh = new THREE.Mesh(geo, mats)
          mesh.position.set(x, y, z)
          cubeGroup.add(mesh)
          cubies.push({ mesh, pos: new THREE.Vector3(x, y, z) })
        }
      }
    }

    // ── Face rotation animation ──────────────────────────────────────
    let animating = false
    let pivot: THREE.Group | null = null
    let pivotCubies: Cubie[] = []
    let pivotAxis: Axis = 'y'
    let pivotTarget = 0
    let pivotCurrent = 0

    function finalizePivot() {
      if (!pivot) return
      pivotCubies.forEach(c => {
        cubeGroup.attach(c.mesh)
        c.pos.set(
          Math.round(c.mesh.position.x),
          Math.round(c.mesh.position.y),
          Math.round(c.mesh.position.z),
        )
      })
      cubeGroup.remove(pivot)
      pivot = null
      pivotCubies = []
      animating = false

      if (queueRef.current.length > 0) {
        const next = queueRef.current.shift()!
        startMove(next)
      }
    }

    function startMove(move: Move) {
      if (animating) {
        queueRef.current.push(move)
        return
      }
      const face = cubies.filter(c => Math.round(c.pos[move.axis]) === move.layer)
      pivot = new THREE.Group()
      cubeGroup.add(pivot)
      face.forEach(c => pivot!.attach(c.mesh))
      pivotCubies = face
      pivotAxis = move.axis
      pivotTarget = move.angle
      pivotCurrent = 0
      animating = true
    }

    doMoveRef.current = startMove

    function buildSolvedCubies() {
      // Detach all, reset positions and materials
      cubies.forEach(c => {
        // Remove from wherever it is
        if (c.mesh.parent) c.mesh.parent.remove(c.mesh)
      })
      // Re-add all to cubeGroup with original positions
      let idx = 0
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const c = cubies[idx++]
            c.mesh.position.set(x, y, z)
            c.mesh.rotation.set(0, 0, 0)
            c.mesh.quaternion.identity()
            c.pos.set(x, y, z)
            // Reset materials
            const colors = faceColors(x, y, z)
            ;(c.mesh.material as THREE.MeshStandardMaterial[]).forEach((mat, i) => {
              mat.color.setHex(colors[i])
            })
            cubeGroup.add(c.mesh)
          }
        }
      }
      queueRef.current = []
      animating = false
      if (pivot) { cubeGroup.remove(pivot); pivot = null }
      pivotCubies = []
    }

    resetRef.current = buildSolvedCubies

    // ── Drag to orbit ────────────────────────────────────────────────
    let isDragging = false
    let lastX = 0
    let lastY = 0

    const onMouseDown = (e: MouseEvent) => { isDragging = true; lastX = e.clientX; lastY = e.clientY }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      cubeGroup.rotation.y += dx * 0.012
      cubeGroup.rotation.x += dy * 0.012
      lastX = e.clientX; lastY = e.clientY
    }
    const onMouseUp = () => { isDragging = false }

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      isDragging = true
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const dx = e.touches[0].clientX - lastX
      const dy = e.touches[0].clientY - lastY
      cubeGroup.rotation.y += dx * 0.012
      cubeGroup.rotation.x += dy * 0.012
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY
    }
    const onTouchEnd = () => { isDragging = false }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)

    // ── Pause when off-screen or tab hidden ──────────────────────────
    let sectionVisible = false
    let paused = false

    const sectionObs = new IntersectionObserver(
      ([entry]) => { sectionVisible = entry.isIntersecting },
      { threshold: 0.01 }
    )
    sectionObs.observe(canvas)

    const onVisibilityChange = () => {
      if (document.hidden) { paused = true; cancelAnimationFrame(animId) }
      else { paused = false; animate() }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // ── Animation loop ───────────────────────────────────────────────
    let animId: number
    const animate = () => {
      if (paused) return
      animId = requestAnimationFrame(animate)

      // Skip render when section fully scrolled out of view
      if (!sectionVisible) return

      if (animating && pivot) {
        pivotCurrent += (pivotTarget - pivotCurrent) * 0.28
        if (Math.abs(pivotTarget - pivotCurrent) < 0.002) {
          pivotCurrent = pivotTarget
          pivot.rotation[pivotAxis] = pivotCurrent
          finalizePivot()
        } else {
          pivot.rotation[pivotAxis] = pivotCurrent
        }
      }


      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      sectionObs.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      renderer.dispose()
    }
  }, [])

  const handleMove = useCallback((move: Move) => {
    doMoveRef.current?.(move)
  }, [])

  const handleScramble = useCallback(() => {
    const count = 20
    for (let i = 0; i < count; i++) {
      const m = MOVES[Math.floor(Math.random() * MOVES.length)]
      doMoveRef.current?.(m)
    }
  }, [])

  const handleReset = useCallback(() => {
    resetRef.current?.()
  }, [])

  const textColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)'
  const subTextColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'

  return (
    <section
      id="rubiks"
      className="relative z-10 flex flex-col items-center justify-center py-24 px-8"
      style={{
        minHeight: '100vh',
        background: isDark ? '#12121a' : '#ffffff',
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: visible ? 'auto' : 'none', width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Label */}
        <p className="font-mono text-[11px] tracking-[0.45em] text-emerald-400 uppercase mb-3">
          Interactive
        </p>

        {/* Heading */}
        <h2
          className="mb-2 leading-tight text-center"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: textColor,
          }}
        >
          Rubik's Cube
        </h2>

        <p
          className="mb-10 text-center text-sm"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 300,
            color: subTextColor,
          }}
        >
          Drag to orbit · Use buttons to rotate faces
        </p>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: 420,
            height: 420,
            maxWidth: '100%',
            cursor: 'grab',
            display: 'block',
            marginBottom: 28,
          }}
        />

        {/* Move buttons — 6 pairs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, auto)', gap: 6, marginBottom: 16, maxWidth: '100%' }}>
          {MOVES.map(m => (
            <MoveButton key={m.label} move={m} onMove={handleMove} isDark={isDark} />
          ))}
        </div>

        {/* Scramble + Reset */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={handleScramble}
            style={{
              fontFamily: "'Space Grotesk', monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              padding: '8px 22px',
              border: '1px solid rgba(16,185,129,0.6)',
              background: 'rgba(16,185,129,0.14)',
              color: '#10b981',
              cursor: 'pointer',
              borderRadius: 2,
              textTransform: 'uppercase',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = 'rgba(16,185,129,0.28)' }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'rgba(16,185,129,0.14)' }}
          >
            Scramble
          </button>
          <button
            onClick={handleReset}
            style={{
              fontFamily: "'Space Grotesk', monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              padding: '8px 22px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)'}`,
              background: 'transparent',
              color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
              cursor: 'pointer',
              borderRadius: 2,
              textTransform: 'uppercase',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              ;(e.target as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
              ;(e.target as HTMLButtonElement).style.color = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)'
            }}
            onMouseLeave={e => {
              ;(e.target as HTMLButtonElement).style.background = 'transparent'
              ;(e.target as HTMLButtonElement).style.color = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
            }}
          >
            Reset
          </button>
        </div>

      </div>
    </section>
  )
}
