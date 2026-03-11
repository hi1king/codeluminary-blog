import PostEditor from '@/components/blog/PostEditor'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PostEditor post={post} />
    </div>
  )
}
