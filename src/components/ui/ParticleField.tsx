'use client'
import { useEffect, useRef } from 'react'

// Colors visible on warm-white (#F0EEE9) background
const PALETTE = ['#2C4A3E', '#2C4A3E', '#3d6b5a', '#8052ff', '#15846e', '#1e3429', '#4a4a4a']
type Shape = 'circle' | 'triangle' | 'diamond' | 'square'
const SHAPES: Shape[] = ['circle', 'triangle', 'diamond', 'square']

interface Particle {
  x: number; y: number; size: number
  color: string; vx: number; vy: number
  shape: Shape; opacity: number
  cfx: number; cfy: number; cr: number
  phase: number
}

// Brain clusters — lateral (side) view anatomy
// Frontal, Parietal, Occipital, Temporal lobes + Cerebellum
// LTR: brain on right | RTL: brain on left (mirrored)
const BRAIN_LTR = [
  { fx: 0.60, fy: 0.36, r: 125 }, // Frontal lobe (large, center-front)
  { fx: 0.74, fy: 0.29, r: 112 }, // Parietal lobe (top)
  { fx: 0.87, fy: 0.38, r: 72  }, // Occipital lobe (back)
  { fx: 0.65, fy: 0.55, r: 85  }, // Temporal lobe (lower)
  { fx: 0.83, fy: 0.63, r: 60  }, // Cerebellum (lower-back)
  { fx: 0.71, fy: 0.20, r: 48  }, // Superior gyri (top edge)
  { fx: 0.53, fy: 0.46, r: 42  }, // Frontal pole
  { fx: 0.78, fy: 0.48, r: 50  }, // Parieto-temporal junction
]
const BRAIN_RTL = BRAIN_LTR.map(c => ({ ...c, fx: 1 - c.fx }))

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

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const CLUSTERS = rtl ? BRAIN_RTL : BRAIN_LTR
    let raf: number
    let particles: Particle[] = []
    let frame = 0

    const getW = () => canvas.offsetWidth || canvas.parentElement?.offsetWidth || window.innerWidth || 1200
    const getH = () => canvas.offsetHeight || canvas.parentElement?.offsetHeight || window.innerHeight || 800

    const setSize = () => {
      canvas.width = getW()
      canvas.height = getH()
    }

    const initParticles = () => {
      const w = getW()
      const h = getH()
      const total = 750
      const totalR = CLUSTERS.reduce((s, c) => s + c.r, 0)

      particles = CLUSTERS.flatMap(c => {
        const n = Math.round((c.r / totalR) * total)
        return Array.from({ length: n }, () => {
          const angle = Math.random() * Math.PI * 2
          // power < 1 = denser toward center (brain lobe mass)
          const dist = Math.pow(Math.random(), 0.6) * c.r
          return {
            x: c.fx * w + Math.cos(angle) * dist,
            y: c.fy * h + Math.sin(angle) * dist,
            size: 1.5 + Math.random() * 3.5,
            color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            opacity: 0.12 + Math.random() * 0.65,
            cfx: c.fx, cfy: c.fy, cr: c.r,
            phase: Math.random() * Math.PI * 2,
          }
        })
      })
    }

    setSize()
    initParticles()

    const tick = () => {
      const w = canvas.width
      const h = canvas.height
      if (w === 0 || h === 0) { raf = requestAnimationFrame(tick); return }

      frame++
      ctx.clearRect(0, 0, w, h)

      // Neural-like connections between nearby particles (every 3rd frame)
      if (frame % 3 === 0) {
        const step = 3
        for (let i = 0; i < particles.length; i += step) {
          for (let j = i + 1; j < Math.min(i + step * 5, particles.length); j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const d2 = dx * dx + dy * dy
            if (d2 < 1024) { // ~32px threshold
              ctx.beginPath()
              ctx.strokeStyle = particles[i].color
              ctx.globalAlpha = (1 - Math.sqrt(d2) / 32) * 0.08
              ctx.lineWidth = 0.5
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
        ctx.globalAlpha = 1
      }

      for (const p of particles) {
        const cx = p.cfx * w
        const cy = p.cfy * h
        const dx = cx - p.x
        const dy = cy - p.y
        const d = Math.sqrt(dx * dx + dy * dy)
        // Gentle gravity back to cluster center when too far
        if (d > p.cr * 1.2) {
          p.vx += dx * 0.00012
          p.vy += dy * 0.00012
        }
        // Organic breathing motion
        p.vx += Math.sin(frame * 0.005 + p.phase) * 0.002
        p.vy += Math.cos(frame * 0.004 + p.phase * 0.7) * 0.002
        p.vx *= 0.997
        p.vy *= 0.997
        p.x += p.vx
        p.y += p.vy
        drawShape(ctx, p)
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    const ro = new ResizeObserver(() => { setSize(); initParticles() })
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
