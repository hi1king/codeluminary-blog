'use client'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function PostEditor({ post }: { post?: any }) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [tags, setTags] = useState<string[]>(post?.tags ?? [])
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      title,
      content,
      tags,
      status,
      slug: slugify(title),
      author_id: user.id,
      updated_at: new Date().toISOString(),
      ...(status === 'published' ? { published_at: new Date().toISOString() } : {}),
    }

    if (post?.id) {
      await supabase.from('posts').update(payload).eq('id', post.id)
    } else {
      await supabase.from('posts').insert(payload)
    }

    router.push('/dashboard/posts')
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-[#0d0d0d]">{post ? '编辑文章' : '撰写新文章'}</h2>
        <div className="flex gap-4">
          <button onClick={() => handleSave('draft')} disabled={saving} className="px-6 py-2.5 bg-white border border-[#e2d9cc] text-[#0d0d0d] font-serif text-[13px] font-semibold transition-colors hover:border-[#c9a84c]">
            保存草稿
          </button>
          <button onClick={() => handleSave('published')} disabled={saving} className="px-6 py-2.5 bg-[#0d0d0d] text-[#faf7f2] font-serif text-[13px] font-semibold transition-colors hover:bg-[#c9a84c] hover:text-[#0d0d0d]">
            发布文章
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#e2d9cc] p-6">
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="文章标题" 
          className="w-full text-3xl font-serif font-bold text-[#0d0d0d] outline-none placeholder:text-[#8a7e6e]/50 mb-6"
        />
        <div data-color-mode="light">
          <MDEditor 
            value={content} 
            onChange={v => setContent(v ?? '')} 
            height={500}
            className="border-[#e2d9cc] shadow-none"
          />
        </div>
      </div>
    </div>
  )
}
