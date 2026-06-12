import { redirect } from 'next/navigation'

// Fallback: if middleware doesn't rewrite / → /fa, this page handles it
export default function RootPage() {
  redirect('/fa')
}
