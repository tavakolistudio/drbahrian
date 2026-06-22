'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Volume2, VolumeX } from 'lucide-react'

const STORAGE_KEY = 'bgm-muted'
export const BGM_ENTER_EVENT = 'bgm:enter'
export const BGM_STATE_EVENT = 'bgm:state'

export function BackgroundMusic() {
  const t = useTranslations('music')
  const audioRef = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [audible, setAudible] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35
    const userMuted = localStorage.getItem(STORAGE_KEY) === 'true'
    audio.muted = userMuted

    if (userMuted) return

    // Browsers always allow autoplay when muted; unmuting right away works
    // for returning visitors, and the listeners below catch everyone else
    // on their very first interaction with the page. Skip clicks on the
    // button itself — it handles its own toggle, and unmuting here first
    // would make toggle() immediately re-mute on the very first click.
    const unmute = (e: Event) => {
      if (buttonRef.current?.contains(e.target as Node)) return
      audio.muted = false
      audio.play().catch(() => {})
    }
    // The homepage hero's "enter" gate dispatches this once clicked —
    // a guaranteed user gesture, so it always unmutes regardless of target.
    const unmuteFromGate = () => {
      audio.muted = false
      audio.play().catch(() => {})
    }
    window.addEventListener('pointerdown', unmute, { once: true })
    window.addEventListener('keydown', unmute, { once: true })
    window.addEventListener(BGM_ENTER_EVENT, unmuteFromGate)

    return () => {
      window.removeEventListener('pointerdown', unmute)
      window.removeEventListener('keydown', unmute)
      window.removeEventListener(BGM_ENTER_EVENT, unmuteFromGate)
    }
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return

    const next = !audio.muted
    audio.muted = next
    if (!next) audio.play().catch(() => {})
    localStorage.setItem(STORAGE_KEY, String(next))
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/quiet-mind.mp3"
        loop
        autoPlay
        muted
        preload="auto"
        onVolumeChange={(e) => {
          const isAudible = !e.currentTarget.muted
          setAudible(isAudible)
          window.dispatchEvent(new CustomEvent(BGM_STATE_EVENT, { detail: { audible: isAudible } }))
        }}
      />
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-pressed={audible}
        aria-label={audible ? t('pause') : t('play')}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all hover:opacity-90 hover:scale-105 active:scale-95"
        style={{ backgroundColor: '#0071e3' }}
      >
        {audible ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>
    </>
  )
}
