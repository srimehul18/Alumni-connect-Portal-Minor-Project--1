import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VerifyAlumniList } from "@/components/dashboard/verify-alumni-list"

export default async function VerifyAlumniPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch unverified alumni
  const { data: unverifiedAlumni } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "alumni")
    .eq("is_verified", false)
    .order("created_at", { ascending: false })
    console.log("UNVERIFIED ALUMNI:", unverifiedAlumni)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verify Alumni</h1>
        <p className="text-muted-foreground">Review and verify alumni profiles</p>
      </div>

      <VerifyAlumniList alumni={unverifiedAlumni || []} />
    </div>
  )
}
