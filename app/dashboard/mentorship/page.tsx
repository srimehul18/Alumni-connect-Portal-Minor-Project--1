import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MentorshipList } from "@/components/dashboard/mentorship-list"

export default async function MentorshipPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    console.error("Profile fetch error:", profileError)
    redirect("/auth/login")
  }

  let requests: any[] = []

  try {
    if (profile.role === "student") {
      const { data, error } = await supabase
        .from("mentorship_requests")
        .select(`
          *,
          alumni:profiles!alumni_id (*)
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Student mentorship fetch error:", error)
      }

      requests = data || []
    } 
    
    else if (profile.role === "alumni") {
      const { data, error } = await supabase
        .from("mentorship_requests")
        .select(`
          *,
          student:profiles!student_id (*)
        `)
        .eq("alumni_id", user.id)
        // optional:
        // .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Alumni mentorship fetch error:", error)
      }

      requests = data || []
    } 
    
    else {
      requests = []
    }
  } catch (err) {
    console.error("Mentorship fetch error:", err)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {profile.role === "student"
            ? "My Mentorship Requests"
            : "Mentorship Requests"}
        </h1>

        <p className="text-muted-foreground">
          {profile.role === "student"
            ? "Track the status of mentorship requests you have sent to alumni."
            : "Review and respond to mentorship requests from students."}
        </p>
      </div>

      <MentorshipList requests={requests} userRole={profile.role} />
    </div>
  )
}