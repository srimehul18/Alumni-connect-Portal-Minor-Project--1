import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AlumniList } from "@/components/dashboard/alumni-list"

export default async function AlumniPage() {
  const supabase = await createClient()

  // ✅ Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // ✅ Fetch current user's profile (for role)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // ✅ Fetch all verified alumni WITH alumni_profiles (IMPORTANT FIX)
  const { data: alumni } = await supabase
    .from("profiles")
    .select(`
      *,
      alumni_profiles (*)
    `)
    .eq("role", "alumni")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })

  // ✅ Fetch saved alumni for current user
  const { data: savedAlumni } = await supabase
    .from("saved_alumni")
    .select("alumni_id")
    .eq("student_id", user.id)

  const savedAlumniIds = savedAlumni?.map((s) => s.alumni_id) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Discover Alumni</h1>
        <p className="text-muted-foreground">
          Connect with verified alumni from your college
        </p>
      </div>

      <AlumniList
        alumni={alumni || []}
        savedAlumniIds={savedAlumniIds}
        currentUserId={user.id}
        currentUserRole={profile?.role || "student"} // ✅ SAFE fallback
      />
    </div>
  )
}