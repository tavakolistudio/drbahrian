'use client'
import { useEffect, useRef } from 'react'

const PALETTE = ['#8052ff', '#8052ff', '#8052ff', '#ffb829', '#15846e', '#ffffff', '#bdbdbd']
type Shape = 'circle' | 'triangle' | 'diamond' | 'square'
const SHAPES: Shape[] = ['circle', 'triangle', 'diamond', 'square']

// Cluster centers stored as canvas FRACTIONS — resize-safe
const CLUSTERS = [
  { fx: 0.72, fy: 0.35, r: 150 },
  { fx: 0.55, fy: 0.68, r: 95 },
  { fx: 0.88, fy: 0.70, r: 75 },
  { fx: 0.65, fy: 0.18, r: 55 },
]

interface Particle {
  x: number; y: number; size: number
  color: string; vx: number; vy: number
  shape: Shape; opacity: number
  cfx: number; cfy: number; cr: number
}

function drawP(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save()
  ctx.globalAlpha = p.opacity
  ctx.fillStyle = p.color
  ctx.translate(p.x, p.y)
  const s = p.size / 2
  if (p.shape === 'circle') {
    ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill()
  } else if (p.shape === 'triangle') {
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s, s); ctx.lineTo(-s, s); ctx.closePath(); ctx.fill()
  } else if (p.shape === 'diamond') {
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s, 0); ctx.lineTo(0, s); ctx.lineTo(-s, 0); ctx.closePath(); ctx.fill()
  } else {
    ctx.fillRect(-s, -s, p.size, p.size)
  }
  ctx.restore()
}

export function ParticleField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let particles: Particle[] = []

    // Fallback to window size if canvas hasn't been laid out yet
    const getW = () => canvas.offsetWidth || canvas.parentElement?.offsetWidth || window.innerWidth || 1200
    const getH = () => canvas.offsetHeight || canvas.parentElement?.offsetHeight || window.innerHeight || 800

    const setSize = () => {
      canvas.width = getW()
      canvas.height = getH()
    }

    const initParticles = () => {
      const w = getW()
      const h = getH()
      particles = Array.from({ length: 750 }, () => {
        const c = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)]
        const angle = Math.random() * Math.PI * 2
        const dist = Math.pow(Math.random(), 0.5) * c.r  // sqrt distribution — denser at center
        return {
          x: c.fx * w + Math.cos(angle) * dist,
          y: c.fy * h + Math.sin(angle) * dist,
          size: 1 + Math.random() * 4,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          opacity: 0.15 + Math.random() * 0.85,
          cfx: c.fx, cfy: c.fy, cr: c.r,
        }
      })
    }

    setSize()
    initParticles()

    const tick = () => {
      const w = canvas.width
      const h = canvas.height
      if (w === 0 || h === 0) { raf = requestAnimationFrame(tick); return }

      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        // Compute absolute cluster center from fraction × current dims
        const cx = p.cfx * w
        const cy = p.cfy * h
        const dx = cx - p.x
        const dy = cy - p.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d > p.cr * 1.5) {
          p.vx += dx * 0.00012
          p.vy += dy * 0.00012
        }
        p.vx *= 0.997
        p.vy *= 0.997
        p.x += p.vx
        p.y += p.vy
        drawP(ctx, p)
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    const ro = new ResizeObserver(() => {
      setSize()
      initParticles()
    })
    ro.observe(canvas.parentElement || canvas)

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
