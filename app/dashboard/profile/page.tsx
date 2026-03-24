import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StudentProfileForm } from "@/components/dashboard/student-profile-form"
import { AlumniProfileForm } from "@/components/dashboard/alumni-profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) redirect("/auth/login")

  // Get role-specific profile
  let roleProfile = null
  if (profile.role === "student") {
    const { data } = await supabase.from("student_profiles").select("*").eq("user_id", user.id)
    roleProfile = data && data.length > 0 ? data[0] : null
  } else if (profile.role === "alumni") {
    const { data } = await supabase.from("alumni_profiles").select("*").eq("user_id", user.id)
    roleProfile = data && data.length > 0 ? data[0] : null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your profile information</p>
      </div>

      {profile.role === "student" ? (
        <StudentProfileForm profile={profile} studentProfile={roleProfile} />
      ) : profile.role === "alumni" ? (
        <AlumniProfileForm profile={profile} alumniProfile={roleProfile} />
      ) : (
        <div className="text-muted-foreground">Admin profiles are managed separately.</div>
      )}
    </div>
  )
}
