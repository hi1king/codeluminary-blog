import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteCommentButton from '@/components/blog/DeleteCommentButton'

export default async function CommentsManagementPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 查询当前用户发布的所有文章下的所有评论
    if (!user) return null;

    // 获取该作者名下的所有文章的 ID
    const { data: userPosts } = await supabase
        .from('posts')
        .select('id, title')
        .eq('author_id', user.id)

    const postIds = userPosts?.map(p => p.id) || []

    // 查询这些文章名下的所有评论，并且获取发表评论的用户的名字
    let allComments: any[] = []
    if (postIds.length > 0) {
        const { data } = await supabase
            .from('comments')
            .select('*, profiles:profiles!comments_author_id_fkey(display_name), posts:posts!comments_post_id_fkey(title, slug)')
            .in('post_id', postIds)
            .order('created_at', { ascending: false })

        allComments = data || []
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-[#0d0d0d]">评论管理</h2>
                    <p className="text-sm text-[#8a7e6e] mt-1">审核与管理你的文章收到的所有评论</p>
                </div>
            </div>

            <div className="bg-white border border-[#e2d9cc] overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_120px] gap-4 p-5 bg-[#f5f0e8] border-b border-[#e2d9cc]">
                    <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">评论内容</span>
                    <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">评论者</span>
                    <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold">所属文章</span>
                    <span className="text-[11px] tracking-[1.5px] uppercase text-[#8a7e6e] font-semibold flex justify-end">操作</span>
                </div>

                {allComments.length === 0 ? (
                    <div className="p-12 text-center text-[#8a7e6e]">
                        <p className="mb-4">你的文章暂时还没有收到评论</p>
                    </div>
                ) : (
                    allComments.map((comment) => (
                        <div key={comment.id} className="grid grid-cols-[2fr_1fr_1fr_120px] gap-4 p-5 items-center border-b border-[#e2d9cc] hover:bg-[#f5f0e8] transition-colors last:border-b-0">
                            <div className="pr-4">
                                <span className="text-xs text-[#8a7e6e] mb-1 block">
                                    {new Date(comment.created_at).toLocaleString()}
                                </span>
                                <p className="text-sm font-semibold text-[#0d0d0d] line-clamp-2">
                                    {comment.content}
                                </p>
                            </div>
                            <span className="text-[13px] text-[#8a7e6e] font-medium truncate">
                                {comment.profiles?.display_name || 'Anonymous'}
                            </span>
                            <span className="text-[13px] text-[#8a7e6e]">
                                <Link href={`/${comment.posts?.slug}`} className="hover:text-[#c9a84c] hover:underline truncate block" target="_blank" title={comment.posts?.title}>
                                    《{comment.posts?.title}》
                                </Link>
                            </span>
                            <div className="flex gap-2 justify-end">
                                <DeleteCommentButton
                                    commentId={comment.id}
                                    postId={comment.post_id}
                                    contentPreview={comment.content.substring(0, 10)}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
