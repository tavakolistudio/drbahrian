'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function PostDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function del() {
    if (!confirm(`مقاله "${title}" حذف شود؟`)) return
    setBusy(true)
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={del}
      disabled={busy}
      className="px-3 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 disabled:opacity-40"
    >
      حذف
    </button>
  )
}
