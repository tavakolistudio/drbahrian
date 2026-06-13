'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface PostData {
  id?: string
  slug: string
  locale: 'fa' | 'en'
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  status: 'DRAFT' | 'PUBLISHED'
  metaTitle: string
  metaDescription: string
}

const EMPTY: PostData = {
  slug: '', locale: 'fa', title: '', excerpt: '',
  content: '', category: '', tags: [], status: 'DRAFT',
  metaTitle: '', metaDescription: '',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^؀-ۿa-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Minimal markdown → HTML preview
function renderPreview(md: string): string {
  const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  return esc(md)
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.1rem;font-weight:600;margin:1.2rem 0 0.4rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.25rem;font-weight:600;margin:1.5rem 0 0.5rem">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.5rem;font-weight:700;margin:2rem 0 0.6rem">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(44,74,62,0.08);padding:0.15em 0.4em;border-radius:3px">$1</code>')
    .replace(/^&gt; (.+)$/gm, '<blockquote style="border-right:3px solid #2C4A3E;padding-right:1rem;color:#4a4a4a;margin:1rem 0">$1</blockquote>')
    .replace(/^[-*] (.+)$/gm, '<li style="margin-right:1.5rem;list-style:disc">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#2C4A3E;text-decoration:underline">$1</a>')
    .split(/\n\n+/).map(block => {
      if (block.startsWith('<h') || block.startsWith('<li') || block.startsWith('<blockquote')) return block
      return `<p style="line-height:1.8;margin-bottom:1rem">${block.replace(/\n/g, '<br>')}</p>`
    }).join('\n')
}

export function PostEditor({ initial }: { initial?: Partial<PostData> }) {
  const router = useRouter()
  const [data, setData] = useState<PostData>({ ...EMPTY, ...initial })
  const [tagInput, setTagInput] = useState(initial?.tags?.join(', ') ?? '')
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugEdited, setSlugEdited] = useState(!!initial?.id)

  const set = useCallback((k: keyof PostData, v: unknown) => setData(d => ({ ...d, [k]: v })), [])

  function handleTitle(v: string) {
    set('title', v)
    if (!slugEdited) set('slug', slugify(v))
  }

  function handleTagsBlur() {
    const tags = tagInput.split(/[,،\n]+/).map(t => t.trim()).filter(Boolean)
    set('tags', tags)
  }

  async function save(status: 'DRAFT' | 'PUBLISHED') {
    setSaving(true)
    setError('')
    const payload = { ...data, status, tags: tagInput.split(/[,،\n]+/).map(t=>t.trim()).filter(Boolean) }
    try {
      const url = data.id ? `/api/admin/posts/${data.id}` : '/api/admin/posts'
      const method = data.id ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'خطا در ذخیره') }
      router.push('/admin/posts')
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'خطا')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-[#1a1a1a]">
          {data.id ? 'ویرایش مقاله' : 'مقاله جدید'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-[#6b6b6b] border border-[#E8E5DF] rounded-lg hover:bg-[#F0EEE9]"
          >
            انصراف
          </button>
          <button
            onClick={() => save('DRAFT')}
            disabled={saving || !data.title || !data.slug}
            className="px-4 py-2 text-sm border border-[#2C4A3E] text-[#2C4A3E] rounded-lg hover:bg-[#2C4A3E]/5 disabled:opacity-40"
          >
            {saving ? '...' : 'ذخیره پیش‌نویس'}
          </button>
          <button
            onClick={() => save('PUBLISHED')}
            disabled={saving || !data.title || !data.slug || !data.content}
            className="px-4 py-2 text-sm bg-[#2C4A3E] text-white rounded-lg hover:bg-[#1e3429] disabled:opacity-40"
          >
            {saving ? '...' : 'انتشار'}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[#6b6b6b] mb-1">عنوان مقاله *</label>
            <input
              value={data.title}
              onChange={e => handleTitle(e.target.value)}
              placeholder="عنوان مقاله را بنویسید..."
              className="w-full px-3 py-2.5 border border-[#E8E5DF] rounded-lg text-[#1a1a1a] text-base focus:outline-none focus:border-[#2C4A3E] bg-white"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-medium text-[#6b6b6b] mb-1">
              شناسه URL (slug) *
              <span className="font-normal text-[10px] mr-1 text-[#9a9a9a]">— فقط حروف، عدد، خط تیره (مثال: lacan-va-zaban)</span>
            </label>
            <input
              value={data.slug}
              onChange={e => { setSlugEdited(true); set('slug', e.target.value) }}
              placeholder="lacan-va-zaban"
              dir="ltr"
              className="w-full px-3 py-2 border border-[#E8E5DF] rounded-lg text-[#1a1a1a] text-sm font-mono focus:outline-none focus:border-[#2C4A3E] bg-white"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-medium text-[#6b6b6b] mb-1">خلاصه مقاله</label>
            <textarea
              value={data.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              rows={2}
              placeholder="یک جمله یا دو جمله کوتاه درباره این مقاله..."
              className="w-full px-3 py-2 border border-[#E8E5DF] rounded-lg text-[#1a1a1a] text-sm focus:outline-none focus:border-[#2C4A3E] bg-white resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-[#6b6b6b]">متن مقاله (Markdown) *</label>
              <div className="flex gap-1">
                {(['write', 'preview'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1 text-xs rounded ${tab === t ? 'bg-[#2C4A3E] text-white' : 'text-[#6b6b6b] hover:bg-[#F0EEE9]'}`}
                  >
                    {t === 'write' ? 'نوشتن' : 'پیش‌نمایش'}
                  </button>
                ))}
              </div>
            </div>
            {tab === 'write' ? (
              <textarea
                value={data.content}
                onChange={e => set('content', e.target.value)}
                rows={20}
                dir={data.locale === 'fa' ? 'rtl' : 'ltr'}
                placeholder={`# عنوان اصلی\n\nمتن مقاله را اینجا بنویسید...\n\n## بخش دوم\n\nادامه متن...`}
                className="w-full px-3 py-3 border border-[#E8E5DF] rounded-lg text-[#1a1a1a] text-sm font-mono leading-relaxed focus:outline-none focus:border-[#2C4A3E] bg-white resize-y"
              />
            ) : (
              <div
                className="w-full min-h-[400px] px-4 py-3 border border-[#E8E5DF] rounded-lg bg-white overflow-auto text-sm text-[#1a1a1a]"
                dir={data.locale === 'fa' ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: data.content ? renderPreview(data.content) : '<p style="color:#9a9a9a">متنی وجود ندارد...</p>' }}
              />
            )}
            <p className="text-[10px] text-[#9a9a9a] mt-1 text-left" dir="ltr">
              {data.content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Locale */}
          <div className="bg-white border border-[#E8E5DF] rounded-xl p-4">
            <label className="block text-xs font-medium text-[#6b6b6b] mb-2">زبان</label>
            <div className="flex gap-2">
              {(['fa', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => set('locale', l)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    data.locale === l
                      ? 'bg-[#2C4A3E] text-white border-[#2C4A3E]'
                      : 'border-[#E8E5DF] text-[#4a4a4a] hover:border-[#2C4A3E]'
                  }`}
                >
                  {l === 'fa' ? 'فارسی' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Category + Tags */}
          <div className="bg-white border border-[#E8E5DF] rounded-xl p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#6b6b6b] mb-1">دسته‌بندی</label>
              <input
                value={data.category}
                onChange={e => set('category', e.target.value)}
                placeholder="مثال: روانکاوی"
                className="w-full px-3 py-2 border border-[#E8E5DF] rounded-lg text-sm text-[#1a1a1a] focus:outline-none focus:border-[#2C4A3E]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b6b6b] mb-1">
                برچسب‌ها <span className="font-normal text-[10px] text-[#9a9a9a]">(با کاما جدا کنید)</span>
              </label>
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onBlur={handleTagsBlur}
                placeholder="لاکان، روانکاوی، زبان"
                className="w-full px-3 py-2 border border-[#E8E5DF] rounded-lg text-sm text-[#1a1a1a] focus:outline-none focus:border-[#2C4A3E]"
              />
            </div>
          </div>

          {/* Meta */}
          <details className="bg-white border border-[#E8E5DF] rounded-xl p-4">
            <summary className="text-xs font-medium text-[#6b6b6b] cursor-pointer select-none">
              تنظیمات سئو (اختیاری)
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-[10px] text-[#6b6b6b] mb-1">Meta Title</label>
                <input
                  value={data.metaTitle}
                  onChange={e => set('metaTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E5DF] rounded-lg text-xs text-[#1a1a1a] focus:outline-none focus:border-[#2C4A3E]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#6b6b6b] mb-1">Meta Description</label>
                <textarea
                  value={data.metaDescription}
                  onChange={e => set('metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E8E5DF] rounded-lg text-xs text-[#1a1a1a] focus:outline-none focus:border-[#2C4A3E] resize-none"
                />
              </div>
            </div>
          </details>

          {/* Status info */}
          <div className="bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl p-4">
            <p className="text-xs text-[#6b6b6b] leading-relaxed">
              <strong className="text-[#1a1a1a]">پیش‌نویس:</strong> فقط در پنل مدیریت دیده می‌شود.
              <br />
              <strong className="text-[#1a1a1a]">انتشار:</strong> بلافاصله روی سایت نمایش داده می‌شود.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
