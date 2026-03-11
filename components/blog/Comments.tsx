'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Comments({ postId }: { postId: string }) {
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState('')
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user))
        fetchComments()
    }, [])

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select('*, profiles(display_name, avatar_url)')
            .eq('post_id', postId)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setComments(data)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !user) return

        setLoading(true)
        const { error } = await supabase.from('comments').insert({
            post_id: postId,
            author_id: user.id,
            content: newComment.trim()
        })

        if (!error) {
            setNewComment('')
            fetchComments()
        } else {
            console.error(error)
            alert('评论发送失败！')
        }
        setLoading(false)
    }

    return (
        <div className="mt-20 pt-16 border-t border-[#e2d9cc]">
            <h3 className="font-serif text-2xl font-bold mb-10 text-[#0d0d0d]">评论区</h3>

            {/* 评论输入框 */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-12">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="写下你的想法..."
                        rows={4}
                        className="w-full p-5 bg-white border border-[#e2d9cc] text-[#0d0d0d] font-serif outline-none transition-colors focus:border-[#c9a84c] resize-y mb-4"
                    />
                    <button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="px-8 py-3 bg-[#0d0d0d] text-[#faf7f2] font-serif text-[13px] font-semibold tracking-wide border-none cursor-pointer transition-colors hover:bg-[#c9a84c] hover:text-[#0d0d0d] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '发送中...' : '发表评论'}
                    </button>
                </form>
            ) : (
                <div className="bg-[#f5f0e8] p-8 text-center border border-[#e2d9cc] mb-12">
                    <p className="text-[#8a7e6e] mb-4">登录后即可参与互动体验</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-6 py-2 bg-transparent text-[#0d0d0d] border border-[#0d0d0d] font-serif text-[13px] font-semibold transition-colors hover:bg-[#0d0d0d] hover:text-[#faf7f2]"
                    >
                        前往登录
                    </button>
                </div>
            )}

            {/* 评论列表 */}
            <div className="space-y-8">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#0d0d0d] font-serif font-bold">
                                {comment.profiles?.display_name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-[#0d0d0d] text-sm">{comment.profiles?.display_name || 'Anonymous'}</span>
                                    <span className="text-xs text-[#8a7e6e]">· {new Date(comment.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[#0d0d0d]/80 leading-relaxed text-[15px] whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-[#8a7e6e] italic text-sm text-center">暂无评论，来做第一个发言的人吧！</p>
                )}
            </div>
        </div>
    )
}
