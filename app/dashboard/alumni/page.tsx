import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AlumniList } from "@/components/dashboard/alumni-list"

export default async function AlumniPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch all verified alumni with their profiles
  const { data: alumni } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "alumni")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })

  // Fetch saved alumni for current user
  const { data: savedAlumni } = await supabase.from("saved_alumni").select("alumni_id").eq("student_id", user.id)

  const savedAlumniIds = savedAlumni?.map((s) => s.alumni_id) || []

  const {data: profile} = await supabase.from("profiles").select("role").eq("id", user.id).single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Discover Alumni</h1>
        <p className="text-muted-foreground">Connect with verified alumni from your college</p>
      </div>

      <AlumniList alumni={alumni || []} savedAlumniIds={savedAlumniIds} currentUserId={user.id}
      currentUserRole = {profile?.role || "student"} />
    </div>
  )
}
