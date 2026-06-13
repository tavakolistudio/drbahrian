'use client'
import { useEffect, useRef } from 'react'

const PALETTE = ['#2C4A3E', '#2C4A3E', '#2C4A3E', '#3d6b5a', '#8052ff', '#15846e', '#1e3429', '#5a3a8a']
type Shape = 'circle' | 'triangle' | 'diamond' | 'square'
const SHAPES: Shape[] = ['circle', 'triangle', 'diamond', 'square']

interface Particle {
  x: number; y: number; ox: number; oy: number
  size: number; color: string; vx: number; vy: number
  shape: Shape; opacity: number; phase: number
}

// Mathematical brain density field — lateral (side) view
// Returns 0–1+; higher = denser brain tissue region
function brainDensity(nx: number, ny: number): number {
  // Main cerebrum — large dominant oval
  const main = 1 - (nx * nx * 0.88 + ny * ny * 1.35)
  // Frontal lobe — forward bulge
  const frontal = 0.82 - (Math.pow(nx + 0.73, 2) * 1.1 + Math.pow(ny + 0.02, 2) * 2.0)
  // Temporal lobe — extends downward from center
  const temporal = 0.72 - (Math.pow(nx + 0.08, 2) * 1.4 + Math.pow(ny - 0.68, 2) * 3.2)
  // Cerebellum — distinct lower-back lobe
  const cerebellum = 0.72 - (Math.pow(nx - 0.64, 2) * 1.9 + Math.pow(ny - 0.58, 2) * 2.8)
  // Parietal — top extension
  const parietal = 0.48 - (Math.pow(nx - 0.22, 2) * 1.7 + Math.pow(ny + 0.62, 2) * 3.8)

  return (
    Math.max(0, main) * 1.0 +
    Math.max(0, frontal) * 0.9 +
    Math.max(0, temporal) * 0.8 +
    Math.max(0, cerebellum) * 0.8 +
    Math.max(0, parietal) * 0.6
  )
}

function buildParticles(w: number, h: number, rtl: boolean, count = 1400): Particle[] {
  const bCx = rtl ? 0.26 : 0.72    // brain center x
  const bCy = 0.46                   // brain center y
  const bW = Math.min(w * 0.23, 240) // half-width in px
  const bH = Math.min(h * 0.30, 230) // half-height in px

  const out: Particle[] = []
  let tries = 0

  while (out.length < count && tries < count * 14) {
    tries++
    const nx = Math.random() * 2.9 - 1.45
    const ny = Math.random() * 2.5 - 1.25
    // Mirror brain for RTL
    const snx = rtl ? -nx : nx
    const d = brainDensity(snx, ny)

    if (d > 0 && Math.random() < d * 0.88) {
      const x = bCx * w + nx * bW
      const y = bCy * h + ny * bH
      // Edge particles (gyri) are more opaque and slightly larger
      const isEdge = d < 0.28
      out.push({
        x, y, ox: x, oy: y,
        size: isEdge ? 2.2 + Math.random() * 2.8 : 1.5 + Math.random() * 2.2,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        opacity: isEdge ? 0.50 + Math.random() * 0.45 : 0.22 + Math.random() * 0.45,
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

      // Neural-like connections every 3 frames (nearby particles in array = same region)
      if (frame % 3 === 0) {
        ctx.lineWidth = 0.6
        for (let i = 0; i < particles.length; i += 4) {
          for (let j = i + 1; j < Math.min(i + 22, particles.length); j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const d2 = dx * dx + dy * dy
            if (d2 < 900) {
              ctx.strokeStyle = particles[i].color
              ctx.globalAlpha = (1 - Math.sqrt(d2) / 30) * 0.12
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
        // Gentle gravity back to original brain position
        const dx = p.ox - p.x
        const dy = p.oy - p.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d > 15) {
          p.vx += dx * 0.0009
          p.vy += dy * 0.0009
        }
        // Organic breathing motion
        p.vx += Math.sin(frame * 0.006 + p.phase) * 0.003
        p.vy += Math.cos(frame * 0.005 + p.phase * 0.8) * 0.003
        p.vx *= 0.990
        p.vy *= 0.990
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
