'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Email/Password 注册
    const handleRegister = async () => {
        setLoading(true)
        setError(null)
        setSuccess(null)
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${location.origin}/api/auth/callback` }
        })

        if (error) {
            setError(error.message)
        } else {
            // 检查是否需要验证邮箱
            if (data?.user?.identities?.length === 0) {
                setError('该邮箱已被注册')
            } else if (data?.session) {
                // 如果没有开启邮箱验证，可以直接登录并跳转
                router.push('/dashboard')
            } else {
                setSuccess('注册成功！请检查您的邮箱并点击验证链接。')
            }
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

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleRegister() }} className="space-y-4">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-[#c9a84c] text-sm mb-4 font-semibold">{success}</p>}
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
                {loading ? '注册中...' : '注册账号 →'}
            </button>

            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-[11px] tracking-widest text-white/30 uppercase">或使用</span>
                <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <button type="button" onClick={handleGitHub} className="w-full p-3 bg-white/5 border border-white/10 text-white/80 font-serif text-[13px] cursor-pointer flex items-center justify-center gap-2.5 transition-colors hover:bg-white/10 hover:border-white/25">
                <span>⬡</span> 使用 GitHub 账号继续
            </button>
        </form>
    )
}
