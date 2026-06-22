'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Send, Instagram } from 'lucide-react'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { BGM_ENTER_EVENT, BGM_STATE_EVENT } from '@/components/BackgroundMusic'
import type { Locale } from '@/types'

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4'
const FADE_MS = 500
const FADE_OUT_LEAD = 0.55

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

    function handleCanPlay() {
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

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('canplay', handleCanPlay)
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

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations('home.hero')
  const tNav = useTranslations('nav')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const userMuted = localStorage.getItem('bgm-muted') === 'true'
    const audio = document.querySelector('audio')
    if (userMuted || (audio && !audio.muted)) setEntered(true)

    const onState = (e: Event) => {
      if ((e as CustomEvent<{ audible: boolean }>).detail.audible) setEntered(true)
    }
    window.addEventListener(BGM_STATE_EVENT, onState)
    return () => window.removeEventListener(BGM_STATE_EVENT, onState)
  }, [])

  function enterSite() {
    window.dispatchEvent(new Event(BGM_ENTER_EVENT))
    setEntered(true)
  }

  const navLinks = [
    { href: `${prefix}/`, label: tNav('home') },
    { href: `${prefix}/about`, label: tNav('about') },
    { href: `${prefix}/blog`, label: tNav('blog') },
  ]

  const socialLinks = [
    { href: 'mailto:bahriyanmaryam@gmail.com', icon: Mail, label: 'Email' },
    { href: 'https://t.me/psychofreepen', icon: Send, label: 'Telegram' },
    { href: 'https://instagram.com/dr.maryam.bahrian', icon: Instagram, label: 'Instagram' },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col bg-black">
      <FadingVideo src={HERO_VIDEO} className="absolute inset-0 w-full h-full object-cover object-bottom z-0" />

      {/* Entry gate — guarantees a user gesture so background music can start audibly */}
      {!entered && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center px-6">
          <button
            type="button"
            onClick={enterSite}
            className="liquid-glass-strong rounded-full px-8 py-3 text-white text-sm font-medium"
          >
            {t('enter')}
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav
        className={`fixed top-4 inset-x-0 z-50 px-6 transition-opacity duration-700 ${entered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="liquid-glass max-w-5xl mx-auto rounded-full px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href={`${prefix}/`} className="flex items-center gap-2 flex-shrink-0">
            <Image src="/logo.png" alt={isRTL ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'} width={32} height={32} className="object-contain" />
            <span className="hidden sm:inline text-white font-semibold text-base">
              {isRTL ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher className="text-white/80 border-white/20 hover:text-white hover:border-white/40" />
            <Link href={`${prefix}/contact`} className="hidden sm:inline text-white/80 hover:text-white text-sm font-medium transition-colors">
              {tNav('contact')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <div
        className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center transition-opacity duration-700 ${entered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <h1
          className="text-white tracking-tight"
          style={{
            fontFamily: isRTL ? 'var(--font-vazir), Tahoma, sans-serif' : 'var(--font-heading), serif',
            fontStyle: isRTL ? 'normal' : 'italic',
            fontWeight: isRTL ? 700 : 400,
            fontSize: isRTL ? 'clamp(1.25rem, 3vw, 1.75rem)' : 'clamp(1.25rem, 3vw, 2rem)',
            lineHeight: 1.05,
            letterSpacing: isRTL ? '-0.02em' : '-0.02em',
          }}
        >
          {t('name')}
        </h1>

        <p className="text-white/70 text-sm md:text-base mt-5" style={{ letterSpacing: isRTL ? '0.01em' : '-0.1px' }}>
          {t('subtitle')}
        </p>

        <p
          className="text-white text-sm md:text-base mt-4 max-w-xl leading-relaxed"
          style={{ lineHeight: isRTL ? 1.9 : 1.5 }}
        >
          {t('intro')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link href={`${prefix}/blog`} className="liquid-glass rounded-full px-6 py-3 text-white text-sm font-medium">
            {t('ctaPrimary')}
          </Link>
        </div>

        <Link href={`${prefix}/contact`} className="text-white/60 hover:text-white text-sm mt-6 transition-colors">
          {t('ctaSecondary')}
        </Link>
      </div>

      {/* Social icons */}
      <div
        className={`relative z-10 flex justify-center gap-4 pb-12 transition-opacity duration-700 ${entered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            aria-label={label}
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white transition-colors"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </section>
  )
}
