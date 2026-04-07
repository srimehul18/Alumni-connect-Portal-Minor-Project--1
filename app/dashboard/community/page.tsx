import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
      profiles (full_name, avatar_url)
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
                    <CardContent className="pt-4">
                        <p className="font-semibold">
                            {post.profiles?.full_name || "User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleString()}
                        </p>
                        <p className="mt-2">{post.content}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}