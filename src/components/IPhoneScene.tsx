import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import iphoneModelUrl from '../assets/models/iphone.glb?url'

interface Props {
  onLoaded: () => void
  shouldSlide: boolean
  shrink: boolean
  interactive: boolean
  opacity: number
}

const DRAG_RADIUS = 110

export function IPhoneScene({ onLoaded, shouldSlide, shrink, interactive, opacity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const grabZoneRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const displayMatRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const videoTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const shouldSlideRef = useRef(shouldSlide)
  const shrinkRef = useRef(shrink)
  const interactiveRef = useRef(interactive)
  const opacityRef = useRef(opacity)

  useEffect(() => { shouldSlideRef.current = shouldSlide }, [shouldSlide])
  useEffect(() => {
    if (!shrink) return
    videoTimersRef.current.forEach(clearTimeout)
    videoTimersRef.current = []
    const mat = displayMatRef.current
    if (!mat) return
    videoRef.current?.pause()
    new THREE.TextureLoader().load('/aparat.PNG', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.flipY = false
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      mat.map = tex
      mat.emissiveMap = tex
      mat.needsUpdate = true
    }, undefined, (err) => console.error('aparat.PNG load error:', err))
  }, [shrink])
  useEffect(() => {
    if (shouldSlide) {
      const t1 = setTimeout(() => {
        videoRef.current?.play().catch(() => {})
        const t2 = setTimeout(() => {
          const v = videoRef.current
          if (!v) return
          v.src = '/mess.mp4'
          v.load()
          v.addEventListener('canplay', () => {
            v.playbackRate = 2
            v.play().catch(() => {})
          }, { once: true })
        }, 4000)
        videoTimersRef.current.push(t2)
      }, 500)
      videoTimersRef.current.push(t1)
    }
  }, [shouldSlide])
  useEffect(() => { shrinkRef.current = shrink }, [shrink])
  useEffect(() => { interactiveRef.current = interactive }, [interactive])
  useEffect(() => { opacityRef.current = opacity }, [opacity])

  useEffect(() => {
    const canvas = canvasRef.current
    const grabZone = grabZoneRef.current
    if (!canvas || !grabZone) return

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 6)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputColorSpace = THREE.SRGBColorSpace

    // Environment map
    const pmrem = new THREE.PMREMGenerator(renderer)
    pmrem.compileEquirectangularShader()
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.0))
    const key = new THREE.DirectionalLight(0xffffff, 2.0)
    key.position.set(5, 8, 5)
    scene.add(key)
    const emeraldFill = new THREE.PointLight(0x10b981, 3.0, 15)
    emeraldFill.position.set(-4, -1, 4)
    scene.add(emeraldFill)
    const rimLight = new THREE.DirectionalLight(0x34d399, 0.8)
    rimLight.position.set(-5, 3, -3)
    scene.add(rimLight)

    // Video element — must be in DOM for autoplay to work in all browsers
    const video = document.createElement('video')
    video.src = '/hello.mp4'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none'
    document.body.appendChild(video)
    videoRef.current = video

    const videoTex = new THREE.VideoTexture(video)
    videoTex.colorSpace = THREE.SRGBColorSpace
    videoTex.flipY = false
    videoTex.minFilter = THREE.LinearFilter
    videoTex.magFilter = THREE.LinearFilter
    video.addEventListener('canplay', () => { videoTex.needsUpdate = true }, { once: true })

    // Model state
    let model: THREE.Object3D | null = null
    let currentY = 16
    let targetY = 16
    let currentRot = Math.PI
    let targetRot = Math.PI
    let rotationStarted = false
    let settled = false
    let autoRotating = false
    let baseScale = 1
    let scaleFactor = 1
    const SHRINK_TARGET = 0.42
    let basePosX = 0
    let currentX = 0
    let targetX = 0

    // Drag state
    let isDragging = false
    let lastMouseX = 0
    let dragResumeTimer: ReturnType<typeof setTimeout> | null = null

    const onMouseDown = (e: MouseEvent) => {
      if (!settled) return
      isDragging = true
      autoRotating = false
      lastMouseX = e.clientX
      if (dragResumeTimer) clearTimeout(dragResumeTimer)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !model) return
      const delta = e.clientX - lastMouseX
      currentRot += delta * 0.008
      targetRot = currentRot
      model.rotation.y = currentRot
      lastMouseX = e.clientX
    }
    const onMouseUp = () => {
      if (!isDragging) return
      isDragging = false
      dragResumeTimer = setTimeout(() => { autoRotating = true }, 2500)
    }

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (!settled) return
      isDragging = true
      autoRotating = false
      lastMouseX = e.touches[0].clientX
      if (dragResumeTimer) clearTimeout(dragResumeTimer)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !model) return
      const delta = e.touches[0].clientX - lastMouseX
      currentRot += delta * 0.008
      targetRot = currentRot
      model.rotation.y = currentRot
      lastMouseX = e.touches[0].clientX
    }

    // Events on grab zone div (not on the full canvas)
    grabZone.addEventListener('mousedown', onMouseDown)
    grabZone.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onMouseUp)

    // Load model
    const loader = new GLTFLoader()
    loader.load(
      iphoneModelUrl,
      (gltf) => {
        model = gltf.scene
        scene.add(model)
        model.updateMatrixWorld(true)

        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)

        if (maxDim > 0) {
          baseScale = 4.2 / maxDim
          model.scale.setScalar(baseScale)
          model.updateMatrixWorld(true)
          const box2 = new THREE.Box3().setFromObject(model)
          const center = box2.getCenter(new THREE.Vector3())
          model.position.x -= center.x
          model.position.z -= center.z
          basePosX = model.position.x
        }

        // Video screen — project vertex XY positions to UV (bypasses broken atlas UV)
        model.traverse((child) => {
          const mesh = child as THREE.Mesh
          if (!mesh.isMesh) return
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((m) => {
            if ((m as THREE.MeshStandardMaterial).name === 'Display') {
              const pos = mesh.geometry.attributes.position
              const uvAttr = mesh.geometry.attributes.uv as THREE.BufferAttribute
              if (pos && uvAttr) {
                let minX = Infinity, maxX = -Infinity
                let minY = Infinity, maxY = -Infinity
                for (let i = 0; i < pos.count; i++) {
                  const x = pos.getX(i), y = pos.getY(i)
                  if (x < minX) minX = x; if (x > maxX) maxX = x
                  if (y < minY) minY = y; if (y > maxY) maxY = y
                }
                const rX = maxX - minX, rY = maxY - minY
                for (let i = 0; i < pos.count; i++) {
                  const u =       (pos.getX(i) - minX) / rX
                  const v = 1.0 - (pos.getY(i) - minY) / rY  // flip V: top=0
                  uvAttr.setXY(i, u, v)
                }
                uvAttr.needsUpdate = true
              }

              const mat = m as THREE.MeshStandardMaterial
              mat.map = videoTex
              mat.emissiveMap = videoTex
              mat.emissive.set(0xffffff)
              mat.emissiveIntensity = 1.0
              mat.color.set(0xffffff)
              mat.roughness = 1.0
              mat.metalness = 0.0
              mat.roughnessMap = null
              mat.metalnessMap = null
              mat.normalMap = null
              mat.needsUpdate = true
              displayMatRef.current = mat
            }
          })
        })

        model.position.y = currentY
        model.rotation.y = Math.PI
        onLoaded()
      },
      undefined,
      (err) => {
        console.warn('Błąd ładowania modelu:', err)
        onLoaded()
      }
    )

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Pause when tab is hidden
    let paused = false
    const onVisibilityChange = () => {
      if (document.hidden) { paused = true; cancelAnimationFrame(animId) }
      else { paused = false; animate() }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // Animation loop
    let animId: number
    const animate = () => {
      if (paused) return
      animId = requestAnimationFrame(animate)

      // Skip GPU render when fully scrolled away (opacity driven to 0)
      if (opacityRef.current <= 0) return

      if (shouldSlideRef.current) targetY = 0

      if (model) {
        currentY = THREE.MathUtils.lerp(currentY, targetY, 0.04)
        model.position.y = currentY

        if (shouldSlideRef.current && !rotationStarted && currentY < 5) {
          rotationStarted = true
          targetRot = Math.PI * 2
        }

        if (rotationStarted && !isDragging) {
          currentRot = THREE.MathUtils.lerp(currentRot, targetRot, 0.05)
          model.rotation.y = currentRot
        }

        if (rotationStarted && !settled &&
          Math.abs(currentRot - targetRot) < 0.04 &&
          Math.abs(currentY - targetY) < 0.04) {
          settled = true
        }

        if (settled && autoRotating && !isDragging) {
          currentRot += 0.004
          targetRot = currentRot
          model.rotation.y = currentRot
        }

        if (shrinkRef.current) {
          targetX = 1.6
          scaleFactor = THREE.MathUtils.lerp(scaleFactor, SHRINK_TARGET, 0.06)
          model.scale.setScalar(baseScale * scaleFactor)
          if (!autoRotating && !isDragging) autoRotating = true
        }
        currentX = THREE.MathUtils.lerp(currentX, targetX, 0.05)
        model.position.x = basePosX + currentX

        renderer.render(scene, camera)

        // Update grab zone position directly via DOM (no React re-render)
        const wp = new THREE.Vector3()
        wp.setFromMatrixPosition(model.matrixWorld)
        wp.project(camera)
        const sx = (wp.x + 1) / 2 * window.innerWidth
        const sy = (-wp.y + 1) / 2 * window.innerHeight
        const active = shrinkRef.current && interactiveRef.current && settled
        grabZone.style.left = `${sx - DRAG_RADIUS}px`
        grabZone.style.top = `${sy - DRAG_RADIUS}px`
        grabZone.style.pointerEvents = active ? 'auto' : 'none'
        grabZone.style.cursor = active ? 'grab' : 'default'
      } else {
        renderer.render(scene, camera)
      }
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      if (dragResumeTimer) clearTimeout(dragResumeTimer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      grabZone.removeEventListener('mousedown', onMouseDown)
      grabZone.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onMouseUp)
      window.removeEventListener('resize', handleResize)
      scene.environment?.dispose()
      renderer.dispose()
      video.pause()
      video.src = ''
      if (video.parentNode) video.parentNode.removeChild(video)
    }
  }, [onLoaded])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{
          zIndex: 1,
          pointerEvents: 'none',
          opacity,
        }}
      />
      {/* Small grab zone that follows the phone — only this area is interactive */}
      <div
        ref={grabZoneRef}
        style={{
          position: 'fixed',
          zIndex: 2,
          width: DRAG_RADIUS * 2,
          height: DRAG_RADIUS * 2,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
