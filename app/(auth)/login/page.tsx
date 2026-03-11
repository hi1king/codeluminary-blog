import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-6 md:p-20">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        
        {/* Auth Info */}
        <div className="order-2 md:order-1">
          <p className="text-[11px] tracking-[4px] uppercase text-[#c9a84c] font-semibold mb-2">安全鉴权</p>
          <h3 className="font-serif text-3xl md:text-[32px] font-bold text-[#0d0d0d] leading-[1.2] mb-5 tracking-[-1px]">
            由 Supabase Auth<br />保驾护航
          </h3>
          <p className="text-[15px] text-[#8a7e6e] leading-[1.8] mb-6">
            完整的身份认证系统，支持多种登录方式。基于 JWT 的无状态鉴权，结合 HTTP-only Cookie 防止 XSS 攻击。
          </p>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#c9a84c] flex items-center justify-center text-base shrink-0">🔑</div>
            <div>
              <div className="font-semibold text-[#0d0d0d] text-sm">多种登录方式</div>
              <div className="text-sm text-[#8a7e6e]">Email/Password、Magic Link、GitHub、Google OAuth</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#c9a84c] flex items-center justify-center text-base shrink-0">🛡️</div>
            <div>
              <div className="font-semibold text-[#0d0d0d] text-sm">中间件路由保护</div>
              <div className="text-sm text-[#8a7e6e]">Next.js Middleware 自动拦截未授权访问，重定向登录页</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#c9a84c] flex items-center justify-center text-base shrink-0">🔒</div>
            <div>
              <div className="font-semibold text-[#0d0d0d] text-sm">行级安全 (RLS)</div>
              <div className="text-sm text-[#8a7e6e]">数据库层面的访问控制，用户只能操作自己的数据</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#c9a84c] flex items-center justify-center text-base shrink-0">⚡</div>
            <div>
              <div className="font-semibold text-[#0d0d0d] text-sm">会话自动刷新</div>
              <div className="text-sm text-[#8a7e6e]">Supabase 客户端自动处理 Token 续签，无感刷新</div>
            </div>
          </div>
        </div>

        {/* Login Mockup */}
        <div className="order-1 md:order-2 bg-[#0d0d0d] p-8 md:p-12 relative">
          <div className="absolute top-[-1px] left-10 right-10 h-[3px] bg-gradient-to-r from-[#c9a84c] via-[#d4792a] to-[#c9a84c]"></div>
          
          <div className="font-serif text-[28px] font-black text-[#faf7f2] mb-2 tracking-[-1px]">
            Luminary<span className="text-[#c9a84c]">.</span>
          </div>
          <p className="text-[13px] text-[#faf7f2]/40 mb-9">继续你的写作之旅</p>

          <LoginForm />

          <p className="text-center mt-5 text-[13px] text-[#faf7f2]/30">
            没有账号？<Link href="/register" className="text-[#c9a84c] cursor-pointer">立即注册</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
