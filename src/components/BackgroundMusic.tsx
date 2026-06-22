'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Volume2, VolumeX } from 'lucide-react'

const STORAGE_KEY = 'bgm-muted'

export function BackgroundMusic() {
  const t = useTranslations('music')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35

    if (localStorage.getItem(STORAGE_KEY) === 'true') return

    const tryPlay = () => audio.play().catch(() => {})
    tryPlay()

    window.addEventListener('pointerdown', tryPlay, { once: true })
    window.addEventListener('keydown', tryPlay, { once: true })

    return () => {
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown', tryPlay)
    }
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play().catch(() => {})
      localStorage.setItem(STORAGE_KEY, 'false')
    } else {
      audio.pause()
      localStorage.setItem(STORAGE_KEY, 'true')
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/quiet-mind.mp3"
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? t('pause') : t('play')}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all hover:opacity-90 hover:scale-105 active:scale-95"
        style={{ backgroundColor: '#0071e3' }}
      >
        {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>
    </>
  )
}
