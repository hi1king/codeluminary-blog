import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeletePostButton from '@/components/blog/DeletePostButton'

export default async function PostsManagementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#0d0d0d]">文章管理</h2>
          <p className="text-sm text-[#8a7e6e] mt-1">管理你的所有草稿和已发布文章</p>
        </div>
        <Link href="/dashboard/posts/new" className="px-6 py-2.5 bg-[#0d0d0d] text-[#faf7f2] font-serif text-[13px] font-semibold flex items-center gap-2 transition-colors hover:bg-[#c9a84c] hover:text-[#0d0d0d]">
          <span>✦</span> 撰写新文章
        </Link>
      </div>

      <div className="bg-white border border-[#e2d9cc] overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 p-5 bg-[#f5f0e8] border-b border-[#e2d9cc]">
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">标题</span>
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">状态</span>
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">阅读量</span>
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">发布时间</span>
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">操作</span>
        </div>

        {posts?.length === 0 ? (
          <div className="p-12 text-center text-[#8a7e6e]">
            <p className="mb-4">你还没有写过任何文章</p>
            <Link href="/dashboard/posts/new" className="text-[#c9a84c] hover:underline">开始写作 →</Link>
          </div>
        ) : (
          posts?.map((post) => (
            <div key={post.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 p-5 items-center border-b border-[#e2d9cc] hover:bg-[#f5f0e8] transition-colors last:border-b-0">
              <span className="text-sm font-semibold text-[#0d0d0d] truncate">{post.title}</span>
              <span>
                {post.status === 'published' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] tracking-[0.5px] font-semibold uppercase bg-[#3d7a5e]/10 text-[#3d7a5e]">● 已发布</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] tracking-[0.5px] font-semibold uppercase bg-[#8a7e6e]/10 text-[#8a7e6e]">○ 草稿</span>
                )}
              </span>
              <span className="text-[13px] text-[#8a7e6e]">{post.views || 0}</span>
              <span className="text-[13px] text-[#8a7e6e]">
                {post.published_at ? new Date(post.published_at).toLocaleDateString() : '未发布'}
              </span>
              <div className="flex gap-2">
                <Link href={`/dashboard/posts/${post.id}/edit`} className="px-3.5 py-1.5 text-[11px] tracking-[0.5px] border border-[#e2d9cc] text-[#8a7e6e] hover:border-[#0d0d0d] hover:text-[#0d0d0d] transition-colors">编辑</Link>
                <DeletePostButton postId={post.id} title={post.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
