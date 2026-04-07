import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { revalidatePath } from "next/cache"

export default async function CommunityPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    // fetch posts
    const { data: posts } = await supabase
        .from("community_posts")
        .select(`
      *,
      profiles (id, full_name, avatar_url),
      community_likes (user_id)
    `)
        .order("created_at", { ascending: false })


    async function createPost(formData: FormData) {
        "use server"

        const supabase = await createClient()

        const content = formData.get("content") as string

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        await supabase.from("community_posts").insert({
            user_id: user.id,
            content,
        })
    }



    async function toggleLike(formData: FormData) {
        "use server"

        const supabase = await createClient()

        const postId = formData.get("post_id") as string

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // check existing like
        const { data: existing } = await supabase
            .from("community_likes")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", user.id)
            .maybeSingle()

        if (existing) {
            // unlike
            await supabase
                .from("community_likes")
                .delete()
                .eq("id", existing.id)
        } else {
            // like
            await supabase.from("community_likes").insert({
                post_id: postId,
                user_id: user.id,
            })
        }

        revalidatePath("/dashboard/community")
    }
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Community</h1>

            {/* Create Post */}
            <form action={createPost} className="space-y-2">
                <Textarea name="content" placeholder="Share something..." required />
                <Button type="submit">Post</Button>
            </form>

            {/* Posts */}
            {posts?.map((post) => (
                <Card key={post.id}>
                    <CardContent className="pt-4 space-y-2">
                        <div className="flex items-center gap-3 mb-2">
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

                        <p className="text-sm">{post.content}</p>

                        {/* 👍 LIKE BUTTON */}
                        <form action={toggleLike}>
                            <input type="hidden" name="post_id" value={post.id} />
                            <Button type="submit" variant="outline" size="sm">
                                👍 {post.community_likes?.length || 0}
                            </Button>
                        </form>

                    </CardContent>
                </Card>
            ))}
        </div>
    )
}