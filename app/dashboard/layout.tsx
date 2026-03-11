import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d0d0d] text-[#faf7f2] p-6 flex flex-col">
        <div className="font-serif text-2xl font-black mb-10 tracking-[-1px]">
          Luminary<span className="text-[#c9a84c]">.</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            数据概览
          </Link>
          <Link href="/dashboard/posts" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            文章管理
          </Link>
          <Link href="/dashboard/comments" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            评论管理
          </Link>
          <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            个人资料
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="text-xs text-white/50 mb-2 truncate">{user.email}</div>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-sm text-[#c9a84c] hover:text-[#e8c97a] transition-colors">
              退出登录
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
