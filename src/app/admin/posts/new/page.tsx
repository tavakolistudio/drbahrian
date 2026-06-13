import { requireAdminSession } from '@/lib/auth'
import { PostEditor } from '@/components/admin/PostEditor'

export default async function NewPostPage() {
  await requireAdminSession()
  return (
    <div className="p-6">
      <PostEditor />
    </div>
  )
}
