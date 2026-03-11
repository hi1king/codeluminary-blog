import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeletePostButton from '@/components/blog/DeletePostButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: allUserPosts } = await supabase
    .from('posts')
    .select('views, status')
    .eq('author_id', user?.id)

  const totalViews = allUserPosts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0
  const publishedCount = allUserPosts?.filter(post => post.status === 'published').length || 0
  const postsCount = allUserPosts?.length || 0

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <div className="mb-10 flex items-center justify-between bg-white border border-[#e2d9cc] border-t-4 border-t-[#c9a84c] p-7 shadow-sm">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#0d0d0d]">早上好，{profile?.display_name || user?.email?.split('@')[0]} 👋</h2>
          <p className="text-sm text-[#8a7e6e] mt-1">你有 {postsCount || 0} 篇文章</p>
        </div>
        <Link href="/dashboard/posts/new" className="px-7 py-3 bg-[#0d0d0d] text-[#faf7f2] font-serif text-[13px] font-semibold flex items-center gap-2 transition-colors hover:bg-[#c9a84c] hover:text-[#0d0d0d]">
          <span>✦</span> 撰写新文章
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        <div className="bg-white border border-[#e2d9cc] p-6 transition-colors hover:border-[#c9a84c]">
          <p className="text-[11px] tracking-[2px] uppercase text-[#8a7e6e] font-semibold mb-3">总阅读量</p>
          <div className="font-serif text-[40px] font-black text-[#0d0d0d] leading-none mb-2 tracking-[-2px]">{totalViews}</div>
          <span className="text-xs flex items-center gap-1 text-[#8a7e6e]">—</span>
        </div>
        <div className="bg-white border border-[#e2d9cc] p-6 transition-colors hover:border-[#c9a84c]">
          <p className="text-[11px] tracking-[2px] uppercase text-[#8a7e6e] font-semibold mb-3">已发布文章</p>
          <div className="font-serif text-[40px] font-black text-[#0d0d0d] leading-none mb-2 tracking-[-2px]">{publishedCount}</div>
          <span className="text-xs flex items-center gap-1 text-[#8a7e6e]">—</span>
        </div>
      </div>

      <h3 className="font-serif text-xl font-bold text-[#0d0d0d] mb-4">最近文章</h3>
      <div className="bg-white border border-[#e2d9cc] overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 p-5 bg-[#f5f0e8] border-b border-[#e2d9cc]">
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">标题</span>
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">状态</span>
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">阅读量</span>
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">发布时间</span>
          <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">操作</span>
        </div>

        {posts?.length === 0 ? (
          <div className="p-8 text-center text-[#8a7e6e] text-sm">暂无文章</div>
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
