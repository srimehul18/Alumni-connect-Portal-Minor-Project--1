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

  // ✅ CREATE POST
  const handlePost = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !content.trim()) return

    await supabase.from("community_posts").insert({
      user_id: user.id,
      content,
    })

    setContent("")
    fetchPosts()
  }

  // ✅ TOGGLE POST LIKE
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
      await supabase.from("community_likes").delete().eq("id", existing.id)
    } else {
      await supabase.from("community_likes").insert({
        post_id: postId,
        user_id: user.id,
      })
    }

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Community</h1>

      {/* CREATE POST */}
      <div className="space-y-2">
        <Textarea
          placeholder="Share something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={handlePost}>Post</Button>
      </div>

      {/* POSTS */}
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="pt-4 space-y-2">

            {/* USER */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {post.profiles?.full_name?.charAt(0) || "U"}
              </div>

              <div>
                <p className="text-sm font-medium">
                  {post.profiles?.full_name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <p className="text-sm">{post.content}</p>

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
                <div key={c.id} className="text-sm bg-muted p-2 rounded">
                  <p className="font-medium">
                    {c.profiles?.full_name || "User"}
                  </p>

                  <p>{c.content}</p>

                  {/* COMMENT LIKE */}
                  <button
                    onClick={() => toggleCommentLike(c.id)}
                    className="text-xs mt-1 hover:text-red-500"
                  >
                    ❤️ {c.community_comment_likes?.length || 0}
                  </button>
                </div>
              ))}
            </div>

            <CommentBox postId={post.id} />

          </CardContent>
        </Card>
      ))}
    </div>
  )
}