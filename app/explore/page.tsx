import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function stripMarkdown(str: string) {
    if (!str) return '';
    return str
        .replace(/<[^>]*>/g, '')
        .replace(/^#+\s+/gm, '')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/~~(.*?)~~/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^\s*>\s+/gm, '')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/\n+/g, ' ')
        .trim();
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
    const { tag } = await searchParams
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    let profile = null
    if (user) {
        const { data } = await supabase.from('profiles').select('display_name').eq('id', user.id).single()
        profile = data
    }

    // 1. 获取所有公开文章以提取全局标签
    const { data: allPublished } = await supabase
        .from('posts')
        .select('tags')
        .eq('status', 'published')

    // 去重所有的分类标签
    const uniqueTags = Array.from(new Set(allPublished?.flatMap(p => p.tags || []) || []))

    // 2. 获取当前分类的文章
    let query = supabase
        .from('posts')
        .select('*, profiles:profiles!posts_author_id_fkey(display_name, avatar_url)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

    if (tag) {
        query = query.contains('tags', [tag])
    }

    const { data: posts, error } = await query

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#0d0d0d] font-serif selection:bg-[#c9a84c] selection:text-[#0d0d0d]">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5f0e8]/90 backdrop-blur-md border-b border-[#e2d9cc] px-10 h-16 flex items-center justify-between">
                <Link href="/" className="font-serif text-[22px] font-black tracking-[-0.5px] text-[#0d0d0d]">
                    Luminary<span className="text-[#c9a84c]">.</span>
                </Link>
                <ul className="hidden md:flex gap-8 list-none">
                    <li><Link href="/#posts" className="text-[13px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold hover:text-[#0d0d0d] transition-colors">文章</Link></li>
                    <li><Link href="/explore" className="text-[13px] tracking-[1.5px] uppercase text-[#c9a84c] font-bold transition-colors">分类浏览</Link></li>
                </ul>
                <div className="flex gap-3 items-center">
                    {user ? (
                        <Link href="/dashboard" className="px-5 py-2 text-[13px] tracking-[0.5px] text-[#8a7e6e] bg-transparent border-none cursor-pointer font-serif transition-colors hover:text-[#0d0d0d]">
                            {profile?.display_name || user.email?.split('@')[0] || '控制台'}
                        </Link>
                    ) : (
                        <Link href="/login" className="px-5 py-2 text-[13px] tracking-[0.5px] text-[#8a7e6e] bg-transparent border-none cursor-pointer font-serif transition-colors hover:text-[#0d0d0d]">登录</Link>
                    )}
                    <Link href="/dashboard/posts/new" className="px-6 py-2 text-[13px] tracking-[0.5px] text-[#faf7f2] bg-[#0d0d0d] border-none cursor-pointer font-serif font-semibold transition-all hover:bg-[#c9a84c] hover:text-[#0d0d0d]">开始写作</Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 md:px-20 max-w-[1400px] mx-auto min-h-[80vh]">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* 左侧标签筛选目录 */}
                    <aside className="w-full md:w-64 shrink-0">
                        <h2 className="text-[11px] tracking-[4px] uppercase text-[#c9a84c] font-semibold mb-6">分类检索</h2>
                        <div className="flex flex-row md:flex-col gap-2 flex-wrap">
                            <Link
                                href="/explore"
                                className={`px-4 py-2 text-sm font-semibold transition-all border-l-2 ${!tag ? 'border-[#c9a84c] text-[#0d0d0d] bg-[#c9a84c]/10' : 'border-transparent text-[#8a7e6e] hover:bg-[#e2d9cc]/30 hover:text-[#0d0d0d]'}`}
                            >
                                全部文章
                            </Link>
                            {uniqueTags.map(t => (
                                <Link
                                    key={t}
                                    href={`/explore?tag=${encodeURIComponent(t)}`}
                                    className={`px-4 py-2 text-sm font-semibold transition-all border-l-2 ${tag === t ? 'border-[#c9a84c] text-[#0d0d0d] bg-[#c9a84c]/10' : 'border-transparent text-[#8a7e6e] hover:bg-[#e2d9cc]/30 hover:text-[#0d0d0d]'}`}
                                >
                                    # {t}
                                </Link>
                            ))}
                        </div>
                    </aside>

                    {/* 右侧文章列表 */}
                    <section className="flex-1">
                        <div className="mb-8">
                            <h1 className="font-serif text-3xl font-bold text-[#0d0d0d]">
                                {tag ? `标签：${tag}` : '全部文章'}
                            </h1>
                            <p className="text-sm text-[#8a7e6e] mt-2">共找到 {posts?.length || 0} 篇文章</p>
                        </div>

                        {posts?.length === 0 ? (
                            <div className="py-20 text-center text-[#8a7e6e] border border-dashed border-[#e2d9cc]">
                                没有找到相关的文章
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {posts?.map((post, i) => (
                                    <Link href={`/${post.slug}`} key={post.id} className="block group bg-white border border-[#e2d9cc] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(13,13,13,0.08)] hover:border-[#c9a84c]">
                                        <div className="h-[200px] relative overflow-hidden">
                                            <div className={`w-full h-full flex items-center justify-center font-serif text-5xl font-black tracking-[-3px] transition-transform duration-400 group-hover:scale-105 ${['bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] text-[#c9a84c]/40', 'bg-gradient-to-br from-[#2d1b00] to-[#5c3317] text-[#d4792a]/40', 'bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] text-[#2c5f8a]/40', 'bg-gradient-to-br from-[#0d1f0d] to-[#1e4d1e] text-[#3d7a5e]/40', 'bg-gradient-to-br from-[#1f0a0a] to-[#4d1e1e] text-[#c0392b]/40', 'bg-gradient-to-br from-[#1a0a2e] to-[#3d1f5f] text-[#c9a84c]/30'][i % 6]}`}>
                                                {post.tags?.[0]?.substring(0, 2).toUpperCase() || 'TX'}
                                            </div>
                                            {post.tags?.[0] && (
                                                <span className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[1.5px] uppercase text-[#faf7f2] bg-[#0d0d0d] font-semibold">
                                                    {post.tags[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-serif text-xl font-bold leading-[1.3] text-[#0d0d0d] mb-3 transition-colors group-hover:text-[#c9a84c]">
                                                {stripMarkdown(post.title)}
                                            </h3>
                                            <p className="text-sm text-[#8a7e6e] leading-[1.7] mb-5 line-clamp-3">
                                                {post.excerpt || stripMarkdown(post.content).substring(0, 100)}...
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-[#e2d9cc]">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-serif font-bold text-[11px] ${['bg-[#c9a84c] text-[#0d0d0d]', 'bg-[#d4792a] text-white', 'bg-[#2c5f8a] text-white', 'bg-[#3d7a5e] text-white'][i % 4]}`}>
                                                        {post.profiles?.display_name?.[0]?.toUpperCase() || 'A'}
                                                    </div>
                                                    <span className="text-[13px] text-[#8a7e6e] font-medium">{post.profiles?.display_name || 'Anonymous'}</span>
                                                </div>
                                                <div className="flex gap-3 items-center text-xs text-[#8a7e6e]">
                                                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                                                    <span>👁 {post.views > 0 ? post.views : '0'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}
