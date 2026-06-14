'use client'
import { useEffect, useRef } from 'react'

// Violet dominant (60%), amber accent (20%), lichen (5%), white (5%), violet variants (10%)
const PALETTE = [
  '#8052ff', '#8052ff', '#8052ff', '#8052ff',
  '#9b6fff', '#6a3de8',
  '#ffb829', '#ffb829',
  '#15846e',
  '#ffffff',
]
const CEREBELLUM_PALETTE = ['#ffb829', '#8052ff', '#15846e', '#9b6fff']

type Shape = 'triangle' | 'circle' | 'diamond'
// Mostly triangles (like Dala's little arrow glyphs), some circles & diamonds
const SHAPES: Shape[] = ['triangle', 'triangle', 'triangle', 'circle', 'diamond']

interface Particle {
  x: number; y: number; ox: number; oy: number
  size: number; color: string; vx: number; vy: number
  shape: Shape; opacity: number; phase: number
  rotation: number; rotSpeed: number
  isBoundary: boolean
}

function brainDensity(snx: number, ny: number): number {
  const g = (cx: number, cy: number, sx: number, sy: number, w: number) => {
    const d = (snx - cx) ** 2 / (sx * sx) + (ny - cy) ** 2 / (sy * sy)
    return d < 1 ? w * (1 - d) : 0
  }
  return (
    g(0.00,  -0.02, 0.80, 0.62, 1.00) +
    g(0.45,  -0.08, 0.42, 0.54, 0.82) +
    g(-0.40,  0.10, 0.38, 0.52, 0.72) +
    g(0.28,   0.56, 0.46, 0.30, 0.78) +
    g(-0.34,  0.84, 0.40, 0.28, 0.92)
  )
}

function buildParticles(w: number, h: number, rtl: boolean): Particle[] {
  const COUNT = 1600
  const bCx = rtl ? 0.25 : 0.75
  const bCy = 0.44
  const bW = Math.min(w * 0.21, 205)
  const bH = Math.min(h * 0.29, 215)

  const out: Particle[] = []
  let tries = 0

  while (out.length < COUNT && tries < COUNT * 28) {
    tries++
    const nx = Math.random() * 2.8 - 1.4
    const ny = Math.random() * 2.6 - 1.3
    const snx = rtl ? -nx : nx
    const d = brainDensity(snx, ny)

    if (d > 0.03 && Math.random() < d * 0.82) {
      const x = bCx * w + nx * bW
      const y = bCy * h + ny * bH
      const isBoundary = d < 0.22
      const isDeepInterior = d > 0.70
      const isCerebellum = ny > 0.60 && snx < -0.08

      out.push({
        x, y, ox: x, oy: y,
        size: isBoundary
          ? 1.4 + Math.random() * 2.2    // edge: 1.4–3.6px — small & sharp
          : isDeepInterior
            ? 0.8 + Math.random() * 1.4  // core: 0.8–2.2px — very fine
            : 1.0 + Math.random() * 1.8, // mid: 1.0–2.8px
        color: isCerebellum
          ? CEREBELLUM_PALETTE[Math.floor(Math.random() * CEREBELLUM_PALETTE.length)]
          : PALETTE[Math.floor(Math.random() * PALETTE.length)],
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        opacity: isBoundary
          ? 0.82 + Math.random() * 0.18  // edge: 0.82–1.0
          : isDeepInterior
            ? 0.15 + Math.random() * 0.25 // core: 0.15–0.40 (fades inward)
            : 0.30 + Math.random() * 0.35, // mid: 0.30–0.65
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.018,
        isBoundary,
      })
    }
  }
  return out
}

function drawShape(ctx: CanvasRenderingContext2D, p: Particle, frame: number) {
  ctx.save()
  ctx.globalAlpha = p.opacity
  ctx.fillStyle = p.color

  // Glow — key to Dala's luminous particle look
  if (p.isBoundary) {
    ctx.shadowColor = p.color
    ctx.shadowBlur = p.size * 5
  } else if (p.opacity > 0.45) {
    ctx.shadowColor = p.color
    ctx.shadowBlur = p.size * 2.5
  }

  ctx.translate(p.x, p.y)
  // Slow rotation so triangles drift like little arrows tumbling in space
  ctx.rotate(p.rotation + frame * p.rotSpeed * 0.3)

  const s = p.size / 2
  switch (p.shape) {
    case 'circle':
      ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); break
    case 'triangle':
      ctx.beginPath()
      ctx.moveTo(0, -s * 1.3)
      ctx.lineTo(s * 0.9, s * 0.85)
      ctx.lineTo(-s * 0.9, s * 0.85)
      ctx.closePath()
      ctx.fill()
      break
    case 'diamond':
      ctx.beginPath()
      ctx.moveTo(0, -s * 1.1)
      ctx.lineTo(s * 0.8, 0)
      ctx.lineTo(0, s * 1.1)
      ctx.lineTo(-s * 0.8, 0)
      ctx.closePath()
      ctx.fill()
      break
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

      // Very subtle neural lines — only between nearby boundary particles
      if (frame % 3 === 0) {
        ctx.lineWidth = 0.5
        const boundary = particles.filter(p => p.isBoundary)
        for (let i = 0; i < boundary.length; i += 2) {
          for (let j = i + 1; j < Math.min(i + 12, boundary.length); j++) {
            const dx = boundary[i].x - boundary[j].x
            const dy = boundary[i].y - boundary[j].y
            const d2 = dx * dx + dy * dy
            if (d2 < 900) {  // 30px range — tighter than before
              ctx.strokeStyle = boundary[i].color
              ctx.globalAlpha = (1 - Math.sqrt(d2) / 30) * 0.12
              ctx.beginPath()
              ctx.moveTo(boundary[i].x, boundary[i].y)
              ctx.lineTo(boundary[j].x, boundary[j].y)
              ctx.stroke()
            }
          }
        }
        ctx.globalAlpha = 1
      }

      for (const p of particles) {
        const dx = p.ox - p.x
        const dy = p.oy - p.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d > 8) {
          p.vx += dx * 0.0012
          p.vy += dy * 0.0012
        }
        p.vx += Math.sin(frame * 0.006 + p.phase) * 0.004
        p.vy += Math.cos(frame * 0.005 + p.phase * 0.8) * 0.004
        p.vx *= 0.989
        p.vy *= 0.989
        p.x += p.vx
        p.y += p.vy
        drawShape(ctx, p, frame)
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
