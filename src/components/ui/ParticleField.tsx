'use client'
import { useEffect, useRef } from 'react'

const PALETTE = ['#8052ff', '#8052ff', '#ffb829', '#15846e', '#ffffff', '#bdbdbd']
type Shape = 'circle' | 'triangle' | 'diamond' | 'square'

interface Particle {
  x: number; y: number; size: number
  color: string; vx: number; vy: number
  shape: Shape; opacity: number
  cx: number; cy: number; cr: number
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
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

    const setSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    setSize()

    const clusterDefs = [
      { fx: 0.72, fy: 0.35, r: 160 },
      { fx: 0.55, fy: 0.68, r: 100 },
      { fx: 0.88, fy: 0.70, r: 80 },
      { fx: 0.62, fy: 0.20, r: 60 },
    ]

    const SHAPES: Shape[] = ['circle', 'triangle', 'diamond', 'square']
    let particles: Particle[] = []

    const init = () => {
      const w = canvas.width, h = canvas.height
      particles = Array.from({ length: 800 }, () => {
        const c = clusterDefs[Math.floor(Math.random() * clusterDefs.length)]
        const angle = Math.random() * Math.PI * 2
        const dist = Math.random() * c.r
        return {
          x: c.fx * w + Math.cos(angle) * dist,
          y: c.fy * h + Math.sin(angle) * dist,
          size: 1.2 + Math.random() * 4,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          opacity: 0.2 + Math.random() * 0.8,
          cx: c.fx * w, cy: c.fy * h, cr: c.r,
        }
      })
    }
    init()

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        const dx = p.cx - p.x
        const dy = p.cy - p.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d > p.cr * 1.4) {
          p.vx += dx * 0.00015
          p.vy += dy * 0.00015
        }
        p.vx *= 0.996
        p.vy *= 0.996
        p.x += p.vx
        p.y += p.vy
        drawParticle(ctx, p)
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    const ro = new ResizeObserver(() => { setSize(); init() })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={ref} className={className} style={{ width: '100%', height: '100%' }} />
}
