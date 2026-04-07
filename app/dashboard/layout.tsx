import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import type { Profile } from "@/lib/types"
import { GraduationCap } from "lucide-react"
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let userProfile: Profile = {
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || null,
    avatar_url: null,
    role: user.user_metadata?.role || "student",
    is_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  try {
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!error && profile) {
      userProfile = profile
    } else if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching profile:", error)
    }
  } catch (err) {
    console.error("[v0] Database error:", err)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar userRole={userProfile.role} />
      <div className="lg:pl-64">
        <DashboardHeader user={userProfile} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
