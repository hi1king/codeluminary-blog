'use client'

import { useState } from 'react'
import { deleteComment } from '@/app/actions/comments'

export default function DeleteCommentButton({ commentId, postId, contentPreview }: { commentId: string, postId: string, contentPreview: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`确定要删除评论 "${contentPreview}..." 吗？此操作不可恢复。`)) return

        setLoading(true)
        const result = await deleteComment(commentId, postId)

        if (result?.error) {
            alert(`删除失败: ${result.error}`)
        } else {
            // 成功，触发组件或页面刷新 (已经在 Server Action 使用了 revalidatePath)
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
