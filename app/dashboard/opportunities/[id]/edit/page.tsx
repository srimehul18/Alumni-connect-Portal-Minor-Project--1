import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { OpportunityForm } from "@/components/dashboard/opportunity-form"

export default async function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch the opportunity
  const { data: opportunity } = await supabase.from("opportunities").select("*").eq("id", id).single()

  if (!opportunity) notFound()

  // Check if user owns this opportunity
  if (opportunity.created_by !== user.id) {
    redirect("/dashboard/opportunities")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Opportunity</h1>
        <p className="text-muted-foreground">Update your job or internship listing</p>
      </div>

      <OpportunityForm userId={user.id} opportunity={opportunity} />
    </div>
  )
}
