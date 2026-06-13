import { requireAdminSession } from '@/lib/auth'
import { adminGetPostById } from '@/lib/posts-db'
import { PostEditor } from '@/components/admin/PostEditor'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
  await requireAdminSession()
  const { id } = await params
  const post = await adminGetPostById(id)
  if (!post) notFound()

  return (
    <div className="p-6">
      <PostEditor
        initial={{
          id: post.id,
          slug: post.slug,
          locale: post.locale as 'fa' | 'en',
          title: post.title,
          excerpt: post.excerpt ?? '',
          content: post.content,
          category: post.category ?? '',
          tags: post.tags,
          status: post.status,
          metaTitle: post.metaTitle ?? '',
          metaDescription: post.metaDescription ?? '',
        }}
      />
    </div>
  )
}
