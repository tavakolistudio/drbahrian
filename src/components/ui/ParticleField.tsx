'use client'
import { useEffect, useRef } from 'react'

// Colors visible on warm-white (#F0EEE9) background
const PALETTE = ['#2C4A3E', '#2C4A3E', '#3d6b5a', '#8052ff', '#15846e', '#ffb829', '#1e3429', '#4a3000']
type Shape = 'circle' | 'triangle' | 'diamond' | 'square'
const SHAPES: Shape[] = ['circle', 'triangle', 'diamond', 'square']

interface Particle {
  x: number; y: number; size: number
  color: string; vx: number; vy: number
  shape: Shape; opacity: number
  cfx: number; cfy: number; cr: number
}

// LTR clusters: right side  |  RTL clusters: left side
const CLUSTERS_LTR = [
  { fx: 0.72, fy: 0.35, r: 150 },
  { fx: 0.55, fy: 0.68, r: 95 },
  { fx: 0.88, fy: 0.70, r: 75 },
  { fx: 0.65, fy: 0.18, r: 55 },
]
const CLUSTERS_RTL = [
  { fx: 0.28, fy: 0.35, r: 150 },
  { fx: 0.45, fy: 0.68, r: 95 },
  { fx: 0.12, fy: 0.70, r: 75 },
  { fx: 0.35, fy: 0.18, r: 55 },
]

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

export function ParticleField({ className, rtl = false }: { className?: string; rtl?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const CLUSTERS = rtl ? CLUSTERS_RTL : CLUSTERS_LTR
    let raf: number
    let particles: Particle[] = []

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
        const dist = Math.pow(Math.random(), 0.5) * c.r
        return {
          x: c.fx * w + Math.cos(angle) * dist,
          y: c.fy * h + Math.sin(angle) * dist,
          size: 1 + Math.random() * 4,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          opacity: 0.15 + Math.random() * 0.7,
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
