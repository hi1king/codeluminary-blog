'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeletePostButton({ postId, title }: { postId: string, title?: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async () => {
        if (!confirm(`确定要删除文章 "${title || '这篇内容'}" 吗？此操作不可恢复。`)) return

        setLoading(true)
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)

        if (error) {
            alert(`删除失败: ${error.message}`)
        } else {
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3.5 py-1.5 text-[11px] tracking-[0.5px] border border-[#e2d9cc] text-[#8a7e6e] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors disabled:opacity-50 cursor-pointer"
        >
            {loading ? '...' : '删除'}
        </button>
    )
}
