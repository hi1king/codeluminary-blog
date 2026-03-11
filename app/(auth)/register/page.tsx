import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-6 md:p-20">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

        {/* Auth Info */}
        <div className="order-2 md:order-1">
          <p className="text-[11px] tracking-[4px] uppercase text-[#c9a84c] font-semibold mb-2">加入我们</p>
          <h3 className="font-serif text-3xl md:text-[32px] font-bold text-[#0d0d0d] leading-[1.2] mb-5 tracking-[-1px]">
            开启你的<br />创作之旅
          </h3>
          <p className="text-[15px] text-[#8a7e6e] leading-[1.8] mb-6">
            注册 Luminary 账号，开始分享你的思想。
          </p>
        </div>

        {/* Register Mockup */}
        <div className="order-1 md:order-2 bg-[#0d0d0d] p-8 md:p-12 relative">
          <div className="absolute top-[-1px] left-10 right-10 h-[3px] bg-gradient-to-r from-[#c9a84c] via-[#d4792a] to-[#c9a84c]"></div>

          <div className="font-serif text-[28px] font-black text-[#faf7f2] mb-2 tracking-[-1px]">
            Luminary<span className="text-[#c9a84c]">.</span>
          </div>
          <p className="text-[13px] text-[#faf7f2]/40 mb-9">创建新账号</p>

          <RegisterForm />

          <p className="text-center mt-5 text-[13px] text-[#faf7f2]/30">
            已有账号？<Link href="/login" className="text-[#c9a84c] cursor-pointer">立即登录</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
