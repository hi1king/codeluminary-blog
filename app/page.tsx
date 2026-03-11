import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

function stripMarkdown(str: string) {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, '') // html
    .replace(/^#+\s+/gm, '') // headers
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/~~(.*?)~~/g, '$1') // strikethrough
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // images
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/^\s*>\s+/gm, '') // blockquotes
    .replace(/^\s*[-*+]\s+/gm, '') // unordered lists
    .replace(/^\s*\d+\.\s+/gm, '') // ordered lists
    .replace(/\n+/g, ' ') // newlines to space
    .trim();
}

export default async function HomePage() {
  const supabase = await createClient()

  // 获取当前登录用户
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('display_name').eq('id', user.id).single()
    profile = data
  }

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profiles:profiles!posts_author_id_fkey(display_name, avatar_url)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching posts:", error)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0d0d0d] font-serif selection:bg-[#c9a84c] selection:text-[#0d0d0d]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5f0e8]/90 backdrop-blur-md border-b border-[#e2d9cc] px-10 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-[22px] font-black tracking-[-0.5px] text-[#0d0d0d]">
          Luminary<span className="text-[#c9a84c]">.</span>
        </Link>
        <ul className="hidden md:flex gap-8 list-none">
          <li><Link href="#posts" className="text-[13px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold hover:text-[#0d0d0d] transition-colors">文章</Link></li>
          <li><Link href="/explore" className="text-[13px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold hover:text-[#0d0d0d] transition-colors">分类浏览</Link></li>
          <li><Link href="#arch" className="text-[13px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold hover:text-[#0d0d0d] transition-colors">架构</Link></li>
          <li><Link href="#auth" className="text-[13px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold hover:text-[#0d0d0d] transition-colors">鉴权</Link></li>
          <li><Link href="/dashboard" className="text-[13px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold hover:text-[#0d0d0d] transition-colors">控制台</Link></li>
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

      {/* Hero */}
      <section className="mt-16 min-h-[92vh] grid grid-cols-1 md:grid-cols-2 bg-[#0d0d0d] overflow-hidden relative">
        <div className="p-16 md:p-20 flex flex-col justify-center relative">
          <p className="text-[11px] tracking-[4px] uppercase text-[#c9a84c] mb-7 font-semibold animate-fadeInUp opacity-0" style={{ animationDelay: '0.1s' }}>Next.js + Supabase 博客系统</p>
          <h1 className="font-serif text-[clamp(52px,5vw,80px)] font-black leading-none text-[#faf7f2] mb-7 tracking-[-2px] animate-fadeInUp opacity-0" style={{ animationDelay: '0.25s' }}>
            分享<br />你的<br /><em className="not-italic text-[#e8c97a]">思想</em>
          </h1>
          <p className="text-base text-[#faf7f2]/60 max-w-[420px] leading-[1.8] mb-12 animate-fadeInUp opacity-0" style={{ animationDelay: '0.4s' }}>
            一个现代化的全栈博客平台。
            优雅的阅读体验，强大的写作工具，
            完善的身份鉴权系统。
          </p>
          <div className="flex gap-4 flex-wrap animate-fadeInUp opacity-0" style={{ animationDelay: '0.55s' }}>
            <Link href="#posts" className="px-9 py-3.5 bg-[#c9a84c] text-[#0d0d0d] font-serif text-sm font-semibold tracking-[0.5px] border-none cursor-pointer transition-all hover:bg-[#e8c97a] hover:-translate-y-0.5">开始探索 →</Link>
            <Link href="https://github.com" className="px-9 py-3.5 bg-transparent text-[#faf7f2] font-serif text-sm font-semibold border border-[#faf7f2]/30 cursor-pointer transition-all hover:border-[#c9a84c] hover:text-[#c9a84c]">查看源码</Link>
          </div>
        </div>

        <div className="relative overflow-hidden hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(201,168,76,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
          <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-[#0d0d0d]/85 via-[#0d0d0d]/40 to-transparent">
            <div className="absolute top-12 right-12 flex gap-2 flex-wrap justify-end max-w-[200px]">
              <span className="px-3.5 py-1 text-[11px] tracking-[1px] uppercase text-[#e8c97a] border border-[#c9a84c]/40 bg-[#c9a84c]/10 font-mono">Next.js 14</span>
              <span className="px-3.5 py-1 text-[11px] tracking-[1px] uppercase text-[#e8c97a] border border-[#c9a84c]/40 bg-[#c9a84c]/10 font-mono">Supabase</span>
              <span className="px-3.5 py-1 text-[11px] tracking-[1px] uppercase text-[#e8c97a] border border-[#c9a84c]/40 bg-[#c9a84c]/10 font-mono">TypeScript</span>
              <span className="px-3.5 py-1 text-[11px] tracking-[1px] uppercase text-[#e8c97a] border border-[#c9a84c]/40 bg-[#c9a84c]/10 font-mono">Tailwind</span>
            </div>
            <p className="text-[11px] tracking-[2px] uppercase text-[#c9a84c] mb-3">精选文章</p>
            <h2 className="font-serif text-[32px] font-bold text-[#faf7f2] leading-[1.25] mb-4">为什么 Supabase 是<br />下一代 BaaS 首选</h2>
            <p className="text-sm text-[#faf7f2]/70 leading-[1.7] mb-6">开放源码、实时数据库、内置鉴权——探索 Supabase 如何改变全栈开发的工作流...</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center font-serif font-bold text-[#0d0d0d] text-sm">L</div>
              <div className="text-[#faf7f2]/80 text-[13px]">
                <div className="font-semibold text-[#faf7f2]">Luminary Editor</div>
                <div className="text-[12px] text-[#faf7f2]/50">3 分钟前 · 5 min 阅读</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <div id="posts" className="py-20 px-6 md:px-20 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-12 pb-6 border-b border-[#e2d9cc]">
          <div>
            <p className="text-[11px] tracking-[4px] uppercase text-[#c9a84c] font-semibold mb-2">最新发布</p>
            <h2 className="font-serif text-4xl font-bold text-[#0d0d0d] tracking-[-1px]">近期文章</h2>
          </div>
          <Link href="/dashboard/posts" className="text-[13px] tracking-[1px] text-[#8a7e6e] no-underline border-b border-[#e2d9cc] pb-0.5 transition-all hover:text-[#c9a84c] hover:border-[#c9a84c]">查看全部 →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      </div>

      {/* Architecture Section */}
      <div id="arch" className="bg-[#0d0d0d] py-20 px-6 md:px-20 my-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-12 pb-6 border-b border-[#faf7f2]/10">
            <div>
              <p className="text-[11px] tracking-[4px] uppercase text-[#c9a84c] font-semibold mb-2">系统设计</p>
              <h2 className="font-serif text-4xl font-bold text-[#faf7f2] tracking-[-1px]">技术架构</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-[2px] bg-[#faf7f2]/5">
            <div className="bg-[#0d0d0d]/80 p-8 border-l-4 border-transparent transition-all duration-300 hover:bg-[#c9a84c]/5 hover:border-[#c9a84c]">
              <div className="text-[28px] mb-4">⚡</div>
              <p className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-semibold mb-2">前端框架</p>
              <h3 className="font-serif text-xl font-bold text-[#faf7f2] mb-3">Next.js 14</h3>
              <p className="text-[13px] text-[#faf7f2]/50 leading-[1.7]">App Router、Server Components、流式渲染。SEO 友好的 SSR/SSG 混合渲染模式，极致性能。</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">App Router</span>
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">RSC</span>
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">SSG/ISR</span>
              </div>
            </div>

            <div className="bg-[#0d0d0d]/80 p-8 border-l-4 border-transparent transition-all duration-300 hover:bg-[#c9a84c]/5 hover:border-[#c9a84c]">
              <div className="text-[28px] mb-4">🔐</div>
              <p className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-semibold mb-2">身份鉴权</p>
              <h3 className="font-serif text-xl font-bold text-[#faf7f2] mb-3">Supabase Auth</h3>
              <p className="text-[13px] text-[#faf7f2]/50 leading-[1.7]">Email/Password、Magic Link、GitHub/Google OAuth。JWT 存储于 HTTP-only Cookie，中间件验证。</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">JWT</span>
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">OAuth 2.0</span>
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">RLS</span>
              </div>
            </div>

            <div className="bg-[#0d0d0d]/80 p-8 border-l-4 border-transparent transition-all duration-300 hover:bg-[#c9a84c]/5 hover:border-[#c9a84c]">
              <div className="text-[28px] mb-4">🗄️</div>
              <p className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-semibold mb-2">数据存储</p>
              <h3 className="font-serif text-xl font-bold text-[#faf7f2] mb-3">Supabase DB</h3>
              <p className="text-[13px] text-[#faf7f2]/50 leading-[1.7]">PostgreSQL 数据库，实时订阅，Row Level Security 行级安全策略，自动生成 REST/GraphQL API。</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">PostgreSQL</span>
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">Realtime</span>
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">REST API</span>
              </div>
            </div>

            <div className="bg-[#0d0d0d]/80 p-8 border-l-4 border-transparent transition-all duration-300 hover:bg-[#c9a84c]/5 hover:border-[#c9a84c]">
              <div className="text-[28px] mb-4">🚀</div>
              <p className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-semibold mb-2">部署 & CDN</p>
              <h3 className="font-serif text-xl font-bold text-[#faf7f2] mb-3">Vercel</h3>
              <p className="text-[13px] text-[#faf7f2]/50 leading-[1.7]">全球边缘网络，自动 HTTPS，Preview Deployments，与 GitHub 深度集成，零配置部署。</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">Edge Network</span>
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">CI/CD</span>
                <span className="px-2.5 py-1 text-[10px] tracking-[0.5px] font-mono text-[#e8c97a] border border-[#c9a84c]/25 bg-[#c9a84c]/5">Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0d0d0d] py-16 px-6 md:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12 pb-12 border-b border-[#faf7f2]/10">
            <div>
              <div className="font-serif text-[28px] font-black text-[#faf7f2] tracking-[-1px] mb-4">Luminary<span className="text-[#c9a84c]">.</span></div>
              <p className="text-sm text-[#faf7f2]/40 leading-[1.7] max-w-[260px]">一个现代化的全栈博客平台。专注于写作体验与内容分享，由 Next.js 和 Supabase 强力驱动。</p>
            </div>
            <div>
              <div className="text-[11px] tracking-[3px] uppercase text-[#c9a84c] font-semibold mb-5">页面导航</div>
              <ul className="list-none space-y-2.5">
                <li><Link href="#" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">首页</Link></li>
                <li><Link href="#posts" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">文章列表</Link></li>
                <li><Link href="/explore" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">分类浏览</Link></li>
                <li><Link href="#" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">关于本站</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] tracking-[3px] uppercase text-[#c9a84c] font-semibold mb-5">开发者</div>
              <ul className="list-none space-y-2.5">
                <li><Link href="#arch" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">架构文档</Link></li>
                <li><Link href="#" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">API 参考</Link></li>
                <li><Link href="#" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">部署指南</Link></li>
                <li><Link href="#" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">GitHub 源码</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] tracking-[3px] uppercase text-[#c9a84c] font-semibold mb-5">账号</div>
              <ul className="list-none space-y-2.5">
                <li><Link href="/login" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">登录</Link></li>
                <li><Link href="/register" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">注册</Link></li>
                <li><Link href="/dashboard" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">写作控制台</Link></li>
                <li><Link href="/dashboard/profile" className="text-sm text-[#faf7f2]/50 no-underline transition-colors hover:text-[#faf7f2]">个人设置</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between text-[13px] text-[#faf7f2]/30">
            <span>© 2026 Luminary Blog · 架构规划预览</span>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#faf7f2]/5 border border-[#faf7f2]/10 text-[11px] font-mono text-[#faf7f2]/40">Next.js 14</span>
              <span className="px-3 py-1 bg-[#faf7f2]/5 border border-[#faf7f2]/10 text-[11px] font-mono text-[#faf7f2]/40">Supabase</span>
              <span className="px-3 py-1 bg-[#faf7f2]/5 border border-[#faf7f2]/10 text-[11px] font-mono text-[#faf7f2]/40">TypeScript</span>
              <span className="px-3 py-1 bg-[#faf7f2]/5 border border-[#faf7f2]/10 text-[11px] font-mono text-[#faf7f2]/40">Vercel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
