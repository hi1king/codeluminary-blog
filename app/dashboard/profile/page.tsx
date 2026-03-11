import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  async function updateProfile(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const updates = {
      id: user.id,
      username: formData.get('username') as string,
      display_name: formData.get('display_name') as string,
      bio: formData.get('bio') as string,
      website: formData.get('website') as string,
    }

    await supabase.from('profiles').upsert(updates)
    revalidatePath('/dashboard/profile')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-[#0d0d0d]">个人资料</h2>
        <p className="text-sm text-[#8a7e6e] mt-1">管理你的公开个人信息</p>
      </div>

      <form action={updateProfile} className="bg-white border border-[#e2d9cc] p-8 space-y-6">
        <div>
          <label className="block text-xs tracking-[1.5px] uppercase text-[#8a7e6e] mb-2 font-semibold">用户名</label>
          <input
            name="username"
            defaultValue={profile?.username || ''}
            placeholder="username"
            className="w-full p-3 bg-[#f5f0e8] border border-[#e2d9cc] text-[#0d0d0d] font-serif text-sm outline-none transition-colors focus:border-[#c9a84c]"
          />
        </div>
        
        <div>
          <label className="block text-xs tracking-[1.5px] uppercase text-[#8a7e6e] mb-2 font-semibold">显示名称</label>
          <input
            name="display_name"
            defaultValue={profile?.display_name || ''}
            placeholder="Display Name"
            className="w-full p-3 bg-[#f5f0e8] border border-[#e2d9cc] text-[#0d0d0d] font-serif text-sm outline-none transition-colors focus:border-[#c9a84c]"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[1.5px] uppercase text-[#8a7e6e] mb-2 font-semibold">个人简介</label>
          <textarea
            name="bio"
            defaultValue={profile?.bio || ''}
            placeholder="一句话介绍自己..."
            rows={4}
            className="w-full p-3 bg-[#f5f0e8] border border-[#e2d9cc] text-[#0d0d0d] font-serif text-sm outline-none transition-colors focus:border-[#c9a84c] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[1.5px] uppercase text-[#8a7e6e] mb-2 font-semibold">个人网站</label>
          <input
            name="website"
            defaultValue={profile?.website || ''}
            placeholder="https://..."
            className="w-full p-3 bg-[#f5f0e8] border border-[#e2d9cc] text-[#0d0d0d] font-serif text-sm outline-none transition-colors focus:border-[#c9a84c]"
          />
        </div>

        <div className="pt-4 border-t border-[#e2d9cc]">
          <button type="submit" className="px-8 py-3 bg-[#0d0d0d] text-[#faf7f2] font-serif text-[13px] font-semibold transition-colors hover:bg-[#c9a84c] hover:text-[#0d0d0d]">
            保存修改
          </button>
        </div>
      </form>
    </div>
  )
}
