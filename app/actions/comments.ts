'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteComment(commentId: string, postId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: '未登录' }
    }

    // 1. 验证用户是否是该文章的作者，或者是该评论的发布者
    // 首先获取评论信息
    const { data: comment } = await supabase
        .from('comments')
        .select('author_id, posts(author_id)')
        .eq('id', commentId)
        .single()

    if (!comment) return { error: '评论不存在' }

    // ts ignore 是因为 json 联查的类型推导可能有点复杂
    // @ts-ignore
    const isPostAuthor = comment.posts?.author_id === user.id
    const isCommentAuthor = comment.author_id === user.id

    if (!isPostAuthor && !isCommentAuthor) {
        return { error: '无权限删除此评论' }
    }

    // 2. 使用 Service Role Key 绕过 RLS 删除（因为默认 RLS 只有评论者自己可删）
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabaseAdmin
        .from('comments')
        .delete()
        .eq('id', commentId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/comments')
    return { success: true }
}
