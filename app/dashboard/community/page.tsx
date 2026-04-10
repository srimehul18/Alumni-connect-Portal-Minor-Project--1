"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CommentBox } from "@/components/community/comment-box"

export default function CommunityPage() {
    const router = useRouter()
    const supabase = createClient()

    const [posts, setPosts] = useState<any[]>([])
    const [content, setContent] = useState("")
    const [image, setImage] = useState<File | null>(null)

    // ✅ FETCH POSTS
    const fetchPosts = async () => {
        const { data } = await supabase
            .from("community_posts")
            .select(`
        *,
        profiles (full_name, avatar_url),
        community_likes (user_id),
        community_comments (
          id,
          content,
          created_at,
          profiles (full_name),
          community_comment_likes (user_id)
        )
      `)
            .order("created_at", { ascending: false })

        setPosts(data || [])
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handlePost = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !content.trim()) return

  const { error } = await supabase.from("community_posts").insert({
    user_id: user.id,
    content,
  })

  if (error) {
    console.error(error)
    return
  }

  setContent("")
  fetchPosts()
}

    // ✅ TOGGLE COMMENT LIKE
    const toggleCommentLike = async (commentId: string) => {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data: existing } = await supabase
            .from("community_comment_likes")
            .select("id")
            .eq("comment_id", commentId)
            .eq("user_id", user.id)
            .maybeSingle()

        if (existing) {
            await supabase
                .from("community_comment_likes")
                .delete()
                .eq("id", existing.id)
        } else {
            await supabase
                .from("community_comment_likes")
                .insert({
                    comment_id: commentId,
                    user_id: user.id,
                })
        }

        fetchPosts()
    }
    const togglePostLike = async (postId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data: existing } = await supabase
    .from("community_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    await supabase
      .from("community_likes")
      .delete()
      .eq("id", existing.id)
  } else {
    await supabase
      .from("community_likes")
      .insert({
        post_id: postId,
        user_id: user.id,
      })
  }

  fetchPosts()
}

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-2xl mx-auto py-6 space-y-6">
                <h1 className="text-2xl font-bold">Community</h1>

                {/* CREATE POST */}
                <Card className="rounded-2xl shadow-sm">
                    <CardContent className="pt-4 space-y-3">

                        <Textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[80px] resize-none border-none focus-visible:ring-0"
                        />


                        <div className="flex justify-end">
                            <Button onClick={handlePost} className="rounded-full px-6">
                                Post
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                {/* POSTS */}
                {posts.map((post) => (
                    <Card key={post.id} className="border shadow-sm hover:shadow-md transition rounded-2xl">
                        <CardContent className="pt-4 space-y-3">

                            {/* USER */}
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center justify-center font-bold">
                                    {post.profiles?.full_name?.charAt(0) || "U"}
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        {post.profiles?.full_name || "User"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(post.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* CONTENT */}
                            <p className="text-sm">{post.content}</p>

                            {/* 🔥 IMAGE DISPLAY */}
                            {post.image_url && (
                                <img
                                    src={post.image_url}
                                    alt="post"
                                    className="rounded-lg mt-2 max-h-80 w-full object-cover"
                                />
                            )}

                            {/* POST LIKE */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => togglePostLike(post.id)}
                            >
                                👍 {post.community_likes?.length || 0}
                            </Button>

                            {/* COMMENTS */}
                            <div className="space-y-2">
                                {post.community_comments?.map((c: any) => (
                                    <div
                                        key={c.id}
                                        className="bg-muted/50 p-3 rounded-xl space-y-1"
                                    >
                                        <p className="text-xs font-semibold">
                                            {c.profiles?.full_name || "User"}
                                        </p>

                                        <p className="text-sm">{c.content}</p>

                                        <button
                                            onClick={() => toggleCommentLike(c.id)}
                                            className="text-xs flex items-center gap-1 mt-1 hover:text-red-500 transition"
                                        >
                                            ❤️ <span>{c.community_comment_likes?.length ?? 0}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <CommentBox postId={post.id} />

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}