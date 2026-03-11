'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Email/Password 登录
  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('邮箱未注册或密码错误，请检查输入。')
      } else if (error.message.includes('Email not confirmed')) {
        setError('该账号尚未验证邮箱，请前往邮箱点击验证链接。')
      } else {
        setError(error.message)
      }
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  // GitHub OAuth 登录
  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${location.origin}/api/auth/callback` }
    })
  }

  // Magic Link 无密码登录
  const handleMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` }
    })
    if (!error) alert('检查你的邮箱！')
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin() }} className="space-y-4">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div>
        <label className="block text-xs tracking-widest uppercase text-white/50 mb-2 font-semibold">邮箱地址</label>
        <input
          type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com" required
          className="w-full p-3 bg-white/5 border border-white/10 text-white font-serif text-sm outline-none transition-colors focus:border-[#c9a84c] placeholder:text-white/20"
        />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-white/50 mb-2 font-semibold">密码</label>
        <input
          type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••" required
          className="w-full p-3 bg-white/5 border border-white/10 text-white font-serif text-sm outline-none transition-colors focus:border-[#c9a84c] placeholder:text-white/20"
        />
      </div>
      <button type="submit" disabled={loading} className="w-full p-3.5 bg-[#c9a84c] text-[#0d0d0d] border-none font-serif text-sm font-bold tracking-wide cursor-pointer mt-2 transition-colors hover:bg-[#e8c97a]">
        {loading ? '登录中...' : '登录 →'}
      </button>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="text-[11px] tracking-widest text-white/30 uppercase">或使用</span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      <button type="button" onClick={handleGitHub} className="w-full p-3 bg-white/5 border border-white/10 text-white/80 font-serif text-[13px] cursor-pointer flex items-center justify-center gap-2.5 transition-colors mb-2.5 hover:bg-white/10 hover:border-white/25">
        <span>⬡</span> 使用 GitHub 账号登录
      </button>
      <button type="button" onClick={handleMagicLink} className="w-full p-3 bg-white/5 border border-white/10 text-white/80 font-serif text-[13px] cursor-pointer flex items-center justify-center gap-2.5 transition-colors mb-2.5 hover:bg-white/10 hover:border-white/25">
        <span>✉</span> 发送 Magic Link
      </button>
    </form>
  )
}
