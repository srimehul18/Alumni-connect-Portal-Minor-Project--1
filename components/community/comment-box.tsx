"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function CommentBox({ postId }: { postId: string }) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const handleComment = async () => {
    if (!text.trim()) return

    setLoading(true)

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Login required")
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from("community_comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: text,
      })

    if (error) {
      toast.error("Failed to comment")
    } else {
      toast.success("Comment added")
      setText("")
      window.location.reload() // temporary (we'll replace with realtime later)
    }

    setLoading(false)
  }

  return (
    <div className="flex gap-2 mt-3">
      <Input
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={handleComment} disabled={loading}>
        Post
      </Button>
    </div>
  )
}