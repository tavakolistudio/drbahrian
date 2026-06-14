'use client'
import { useEffect, useRef } from 'react'

const PALETTE = [
  '#8052ff', '#8052ff', '#8052ff', '#8052ff',
  '#ffb829', '#ffb829',
  '#15846e',
  '#ffffff', '#ffffff',
]
type Shape = 'circle' | 'triangle' | 'diamond' | 'square'
const SHAPES: Shape[] = ['circle', 'triangle', 'diamond', 'square']

interface Particle {
  x: number; y: number; ox: number; oy: number
  size: number; color: string; vx: number; vy: number
  shape: Shape; opacity: number; phase: number
}

// Lateral brain view density (positive snx = front/frontal, negative snx = back/occipital)
// ny > 0 = bottom, ny < 0 = top
function brainDensity(snx: number, ny: number): number {
  const g = (cx: number, cy: number, sx: number, sy: number, w: number) => {
    const d = (snx - cx) ** 2 / (sx * sx) + (ny - cy) ** 2 / (sy * sy)
    return d < 1 ? w * (1 - d) : 0
  }
  return (
    g(0.00,  -0.02, 0.80, 0.62, 1.00) +  // main cerebrum
    g(0.45,  -0.08, 0.42, 0.54, 0.82) +  // frontal lobe (positive = front)
    g(-0.40,  0.10, 0.38, 0.52, 0.72) +  // occipital (negative = back)
    g(0.28,   0.56, 0.46, 0.30, 0.78) +  // temporal (below frontal)
    g(-0.34,  0.84, 0.40, 0.28, 0.92)    // cerebellum (back-bottom, distinct)
  )
}

function buildParticles(w: number, h: number, rtl: boolean): Particle[] {
  const COUNT = 2800
  // Brain position: right side for LTR, left side for RTL
  const bCx = rtl ? 0.24 : 0.76
  const bCy = 0.44
  // Smaller bounding box = higher particle density = more visible shape
  const bW = Math.min(w * 0.195, 190)
  const bH = Math.min(h * 0.27, 200)

  const out: Particle[] = []
  let tries = 0

  while (out.length < COUNT && tries < COUNT * 22) {
    tries++
    const nx = Math.random() * 2.8 - 1.4
    const ny = Math.random() * 2.6 - 1.3
    // Mirror the density field for RTL so the frontal lobe faces the text
    const snx = rtl ? -nx : nx
    const d = brainDensity(snx, ny)

    if (d > 0.04 && Math.random() < d * 0.78) {
      const x = bCx * w + nx * bW
      const y = bCy * h + ny * bH
      // Boundary particles (outline/gyri) are larger and more opaque
      const isBoundary = d < 0.24
      // Cerebellum at back-bottom: use purple tones for visual distinction
      const isCerebellum = ny > 0.60 && snx < -0.08

      out.push({
        x, y, ox: x, oy: y,
        size: isBoundary
          ? 3.2 + Math.random() * 3.8   // outline: 3.2–7.0px
          : 2.0 + Math.random() * 2.8,   // interior: 2.0–4.8px
        color: isCerebellum
          ? ['#ffb829', '#8052ff', '#15846e'][Math.floor(Math.random() * 3)]
          : PALETTE[Math.floor(Math.random() * PALETTE.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        opacity: isBoundary
          ? 0.72 + Math.random() * 0.28   // boundary: 0.72–1.00
          : 0.38 + Math.random() * 0.37,  // interior: 0.38–0.75
        phase: Math.random() * Math.PI * 2,
      })
    }
  }
  return out
}

function drawShape(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save()
  ctx.globalAlpha = p.opacity
  ctx.fillStyle = p.color
  ctx.translate(p.x, p.y)
  const s = p.size / 2
  switch (p.shape) {
    case 'circle':
      ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); break
    case 'triangle':
      ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s, s); ctx.lineTo(-s, s); ctx.closePath(); ctx.fill(); break
    case 'diamond':
      ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s, 0); ctx.lineTo(0, s); ctx.lineTo(-s, 0); ctx.closePath(); ctx.fill(); break
    default:
      ctx.fillRect(-s, -s, p.size, p.size)
  }
  ctx.restore()
}

export function ParticleField({ className, rtl = false }: { className?: string; rtl?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const rtlRef = useRef(rtl)
  rtlRef.current = rtl

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let particles: Particle[] = []
    let frame = 0

    const getW = () => canvas.offsetWidth || canvas.parentElement?.offsetWidth || window.innerWidth || 1200
    const getH = () => canvas.offsetHeight || canvas.parentElement?.offsetHeight || window.innerHeight || 800

    const init = () => {
      canvas.width = getW()
      canvas.height = getH()
      particles = buildParticles(canvas.width, canvas.height, rtlRef.current)
    }

    init()

    const tick = () => {
      const w = canvas.width
      const h = canvas.height
      if (w === 0 || h === 0) { raf = requestAnimationFrame(tick); return }

      frame++
      ctx.clearRect(0, 0, w, h)

      // Neural connection lines — every 2 frames for smoother appearance
      if (frame % 2 === 0) {
        ctx.lineWidth = 0.7
        for (let i = 0; i < particles.length; i += 3) {
          for (let j = i + 1; j < Math.min(i + 20, particles.length); j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const d2 = dx * dx + dy * dy
            if (d2 < 1600) {  // 40px connection range
              ctx.strokeStyle = particles[i].color
              ctx.globalAlpha = (1 - Math.sqrt(d2) / 40) * 0.20
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
        ctx.globalAlpha = 1
      }

      for (const p of particles) {
        // Spring force back to original brain position
        const dx = p.ox - p.x
        const dy = p.oy - p.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d > 10) {
          p.vx += dx * 0.001
          p.vy += dy * 0.001
        }
        // Organic breathing motion
        p.vx += Math.sin(frame * 0.006 + p.phase) * 0.005
        p.vy += Math.cos(frame * 0.005 + p.phase * 0.8) * 0.005
        p.vx *= 0.988
        p.vy *= 0.988
        p.x += p.vx
        p.y += p.vy
        drawShape(ctx, p)
      }

      raf = requestAnimationFrame(tick)
    }
    tick()

    const ro = new ResizeObserver(init)
    ro.observe(canvas.parentElement || canvas)

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [rtl])

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
