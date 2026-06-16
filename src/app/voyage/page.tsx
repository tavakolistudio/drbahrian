'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Play, Clock, Globe } from 'lucide-react'

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4'
const CAPABILITIES_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4'

const FADE_MS = 500
const FADE_OUT_LEAD = 0.55

const ICON_PATHS = {
  scenery: 'M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z',
  movie: 'M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z',
  lightbulb: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z',
} as const

// ── FadingVideo — rAF-driven crossfade loop (no CSS transitions) ──────────
function FadingVideo({ src, className, style }: { src: string; className?: string; style?: CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef(0)
  const fadingOutRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function fadeTo(target: number, duration: number) {
      cancelAnimationFrame(rafRef.current)
      const start = parseFloat(video!.style.opacity) || 0
      const startTime = performance.now()
      function step(now: number) {
        const t = Math.min((now - startTime) / duration, 1)
        video!.style.opacity = String(start + (target - start) * t)
        if (t < 1) rafRef.current = requestAnimationFrame(step)
      }
      rafRef.current = requestAnimationFrame(step)
    }

    function handleLoadedData() {
      video!.style.opacity = '0'
      video!.play().catch(() => {})
      fadeTo(1, FADE_MS)
    }
    function handleTimeUpdate() {
      const remaining = video!.duration - video!.currentTime
      if (!fadingOutRef.current && remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true
        fadeTo(0, FADE_MS)
      }
    }
    function handleEnded() {
      video!.style.opacity = '0'
      setTimeout(() => {
        video!.currentTime = 0
        video!.play().catch(() => {})
        fadingOutRef.current = false
        fadeTo(1, FADE_MS)
      }, 100)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      preload="auto"
      src={src}
      className={className}
      style={{ opacity: 0, ...style }}
    />
  )
}

// ── useInView — IntersectionObserver, fires once ──────────────────────────
function useInView<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

// ── Reveal — shared blur/opacity/y entrance used across both sections ─────
function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <motion.div
      ref={ref}
      initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
      animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── BlurText — word-by-word blur-in headline ───────────────────────────────
function BlurText({ text, className }: { text: string; className?: string }) {
  const [ref, inView] = useInView<HTMLParagraphElement>(0.1)
  const words = text.split(' ')

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: '0.1em' }}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={
            inView
              ? { filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'], opacity: [0, 0.5, 1], y: [50, -5, 0] }
              : {}
          }
          transition={{ duration: 0.7, times: [0, 0.5, 1], ease: 'easeOut', delay: (i * 100) / 1000 }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

function MaterialIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={path} />
    </svg>
  )
}

// ── Navbar ──────────────────────────────────────────────────────────────
function Navbar() {
  const links = ['Home', 'Voyages', 'Worlds', 'Innovation', 'Plan Launch']
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
      <div className="liquid-glass h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="font-heading italic text-white text-2xl leading-none">a</span>
      </div>

      <div className="hidden lg:flex liquid-glass rounded-full px-1.5 py-1.5 items-center gap-1">
        {links.map((l) => (
          <a key={l} href="#" className="px-3 py-2 text-sm font-medium text-white/90 font-body">
            {l}
          </a>
        ))}
        <button className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium font-body flex items-center gap-1 whitespace-nowrap">
          Claim a Spot <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="h-12 w-12 invisible flex-shrink-0" />
    </nav>
  )
}

function StatCard({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="liquid-glass rounded-[1.25rem] p-5 w-[220px] flex flex-col justify-between">
      {icon}
      <div>
        <div className="font-heading italic text-white text-4xl tracking-[-1px] leading-none">{value}</div>
        <div className="text-xs text-white font-body font-light mt-2">{label}</div>
      </div>
    </div>
  )
}

function Partners() {
  const names = ['Aeon', 'Vela', 'Apex', 'Orbit', 'Zeno']
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: 1.4 }}
      className="flex flex-col items-center gap-4 pb-8"
    >
      <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
        Collaborating with top aerospace pioneers globally
      </span>
      <div className="flex gap-12 md:gap-16">
        {names.map((n) => (
          <span key={n} className="font-heading italic text-white text-2xl md:text-3xl tracking-tight">
            {n}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Section 1 — Hero ────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative h-screen overflow-hidden flex flex-col bg-black">
      <FadingVideo
        src={HERO_VIDEO}
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
        style={{ width: '120%', height: '120%' }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center pt-24 px-4">
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
            className="liquid-glass rounded-full flex items-center pr-3 pl-1 py-1"
          >
            <span className="rounded-full bg-white text-black px-3 py-1 text-xs font-semibold font-body">New</span>
            <span className="text-sm text-white/90 font-body pr-0 pl-2">Maiden Crewed Voyage to Mars Arrives 2026</span>
          </motion.div>

          <BlurText
            text="Venture Past Our Sky Across the Universe"
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-2xl tracking-[-4px] mt-6"
          />

          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.8 }}
            className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight text-center"
          >
            Discover the universe in ways once unimaginable. Our pioneering vessels and breakthrough engineering bring
            deep-space exploration within reach—secure and extraordinary.
          </motion.p>

          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 1.1 }}
            className="flex items-center gap-6 mt-6"
          >
            <button className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white font-body flex items-center gap-2">
              Start Your Voyage <ArrowUpRight className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-white font-body">
              View Liftoff <Play className="h-4 w-4 fill-white" />
            </button>
          </motion.div>

          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 1.3 }}
            className="flex items-stretch gap-4 mt-8"
          >
            <StatCard icon={<Clock className="h-7 w-7 text-white" />} value="34.5 Min" label="Average Videos Watch Time" />
            <StatCard icon={<Globe className="h-7 w-7 text-white" />} value="2.8B+" label="Users Across the Globe" />
          </motion.div>
        </div>

        <Partners />
      </div>
    </section>
  )
}

// ── Section 2 — Capabilities ────────────────────────────────────────────
const CARDS = [
  {
    icon: ICON_PATHS.scenery,
    tags: ['Natural Context', 'Photo Realism', 'Infinite Settings', 'Eco-Vibe'],
    title: 'AI Scenery',
    body: 'AI analyzes your product to create indistinguishable natural environments — from Icelandic cliffs to misty forests.',
  },
  {
    icon: ICON_PATHS.movie,
    tags: ['Scale Fast', 'Visual Consistency', 'Time Saver', 'Ready to Post'],
    title: 'Batch Production',
    body: 'Style your entire product line in minutes. Create a unified visual identity for catalogues and social media without weeks of retouching.',
  },
  {
    icon: ICON_PATHS.lightbulb,
    tags: ['Ray Tracing', 'Physical Shadows', 'Studio Quality', 'Sunlight Sync'],
    title: 'Smart Lighting',
    body: 'Automatic lighting and material adjustment. Achieve flawless integration with realistic shadows and sunlight.',
  },
]

function CapabilityCard({ icon, tags, title, body }: { icon: string; tags: string[]; title: string; body: string }) {
  return (
    <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center flex-shrink-0">
          <MaterialIcon path={icon} className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
          {tags.map((t) => (
            <span key={t} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="mt-6">
        <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none">{title}</h3>
        <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">{body}</p>
      </div>
    </div>
  )
}

function Capabilities() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <FadingVideo src={CAPABILITIES_VIDEO} className="absolute inset-0 w-full h-full object-cover z-0" />

      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen">
        <Reveal className="mb-auto">
          <p className="text-sm font-body text-white/80 mb-6">// Capabilities</p>
          <h2 className="font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
            Production
            <br />
            evolved
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <CapabilityCard {...c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function VoyagePage() {
  return (
    <main className="bg-black">
      <Hero />
      <Capabilities />
    </main>
  )
}
