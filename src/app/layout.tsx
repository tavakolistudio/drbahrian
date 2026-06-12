import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://drmaryambahrian.ir'),
}

// Root layout passes children directly — [locale]/layout.tsx owns <html> and <body>
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
