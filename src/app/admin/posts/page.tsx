import { requireAdminSession } from '@/lib/auth'
import { adminGetAllPosts } from '@/lib/posts-db'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { PostDeleteButton } from './PostDeleteButton'

export default async function AdminPostsPage() {
  await requireAdminSession()
  const posts = await adminGetAllPosts()

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-[#1a1a1a]">مقالات</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#2C4A3E] text-white text-sm rounded-lg hover:bg-[#1e3429] transition-colors"
        >
          + مقاله جدید
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-[#6b6b6b]">
          <p className="text-4xl mb-3">✍️</p>
          <p className="text-sm">هنوز مقاله‌ای نوشته نشده.</p>
          <Link href="/admin/posts/new" className="mt-4 inline-block text-[#2C4A3E] text-sm underline">
            اولین مقاله را بنویسید
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#E8E5DF] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E5DF] bg-[#F9F8F5]">
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6b6b6b]">عنوان</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6b6b6b]">زبان</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6b6b6b]">دسته‌بندی</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6b6b6b]">وضعیت</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#6b6b6b]">تاریخ</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DF]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[#F9F8F5] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1a1a1a] leading-snug line-clamp-1">{post.title}</p>
                    <p className="text-[10px] text-[#9a9a9a] font-mono mt-0.5" dir="ltr">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#F0EEE9] text-[#4a4a4a]">
                      {post.locale === 'fa' ? 'فا' : 'EN'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#4a4a4a] text-xs">{post.category ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                      post.status === 'PUBLISHED'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {post.status === 'PUBLISHED' ? 'منتشر شده' : 'پیش‌نویس'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6b6b6b]" dir="ltr">
                    {formatDate(post.createdAt.toISOString(), 'fa')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="px-3 py-1 text-xs text-[#2C4A3E] border border-[#2C4A3E]/30 rounded hover:bg-[#2C4A3E]/5"
                      >
                        ویرایش
                      </Link>
                      <PostDeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
