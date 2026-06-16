import type { Metadata } from 'next'
import { Instrument_Serif, Barlow } from 'next/font/google'
import '../globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Venture Past Our Sky — Across the Universe',
  description: 'Discover the universe in ways once unimaginable. Pioneering vessels and breakthrough engineering bring deep-space exploration within reach.',
}

export default function VoyageLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${barlow.variable}`}>
      <body className="bg-black antialiased" style={{ overflowX: 'clip' }}>
        {children}
      </body>
    </html>
  )
}
