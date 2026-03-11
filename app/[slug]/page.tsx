import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import Comments from '@/components/blog/Comments'
import LikeButton from '@/components/blog/LikeButton'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles:profiles!posts_author_id_fkey(display_name, avatar_url)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  // 更新阅读量
  await supabase.from('posts')
    .update({ views: (post.views || 0) + 1 })
    .eq('id', post.id)

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#0d0d0d] font-serif">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5f0e8]/90 backdrop-blur-md border-b border-[#e2d9cc] px-10 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-[22px] font-black tracking-[-0.5px] text-[#0d0d0d]">
          Luminary<span className="text-[#c9a84c]">.</span>
        </Link>
        <Link href="/" className="text-[13px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold hover:text-[#0d0d0d] transition-colors">
          返回首页
        </Link>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-20 max-w-4xl mx-auto">
        <article>
          <header className="mb-16 text-center">
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 justify-center mb-6">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 text-[10px] tracking-[1.5px] uppercase text-white bg-[#0d0d0d] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-serif text-4xl md:text-[52px] font-bold leading-[1.1] tracking-[-1px] mb-8">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-[#8a7e6e] text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0d0d0d] font-bold text-xs">
                  {post.profiles?.display_name?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="font-semibold text-[#0d0d0d]">{post.profiles?.display_name || 'Anonymous'}</span>
              </div>
              <span>·</span>
              <time className="italic">{new Date(post.published_at || post.created_at).toLocaleDateString()}</time>
              <span>·</span>
              <span>{post.views || 0} 阅读</span>
            </div>
          </header>

          <div className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-[#c9a84c] prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <LikeButton postId={post.id} />

        <Comments postId={post.id} />
      </main>
    </div>
  )
}
