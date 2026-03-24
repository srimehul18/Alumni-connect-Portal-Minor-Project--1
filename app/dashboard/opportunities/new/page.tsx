import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OpportunityForm } from "@/components/dashboard/opportunity-form"

export default async function NewOpportunityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Check if user is alumni
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "alumni") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Post an Opportunity</h1>
        <p className="text-muted-foreground">Share a job or internship opportunity with students</p>
      </div>

      <OpportunityForm userId={user.id} />
    </div>
  )
}
