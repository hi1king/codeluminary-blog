'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LikeButton({ postId }: { postId: string }) {
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
            if (data.user) {
                checkLikeStatus(data.user.id)
            }
        })
        fetchLikesCount()
    }, [])

    const fetchLikesCount = async () => {
        const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId)

        setLikesCount(count || 0)
    }

    const checkLikeStatus = async (userId: string) => {
        const { data } = await supabase
            .from('likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .single()

        if (data) setIsLiked(true)
    }

    const handleToggleLike = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        if (loading) return
        setLoading(true)

        if (isLiked) {
            await supabase
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', user.id)
            setLikesCount(prev => Math.max(0, prev - 1))
            setIsLiked(false)
        } else {
            await supabase
                .from('likes')
                .insert({ post_id: postId, user_id: user.id })
            setLikesCount(prev => prev + 1)
            setIsLiked(true)
        }

        setLoading(false)
    }

    return (
        <div className="flex items-center gap-4 mt-12 mb-8">
            <button
                onClick={handleToggleLike}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 font-serif text-[15px] font-semibold border transition-all duration-300 ${isLiked
                        ? 'bg-[#c9a84c] border-[#c9a84c] text-[#0d0d0d] shadow-[0_4px_14px_rgba(201,168,76,0.4)] hover:-translate-y-0.5'
                        : 'bg-transparent border-[#e2d9cc] text-[#0d0d0d] hover:border-[#c9a84c] hover:text-[#c9a84c]'
                    }`}
            >
                <span className="text-xl leading-none">{isLiked ? '♥' : '♡'}</span>
                <span>{isLiked ? '已赞' : '点赞'}</span>
            </button>
            <span className="text-[#8a7e6e] text-sm font-serif">
                已有 <strong className="text-[#0d0d0d] font-bold">{likesCount}</strong> 人觉得很赞
            </span>
        </div>
    )
}
