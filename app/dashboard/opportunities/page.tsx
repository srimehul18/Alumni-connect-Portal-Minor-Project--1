import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OpportunityList } from "@/components/dashboard/opportunity-list"

export default async function OpportunitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch all active opportunities
  const { data: opportunities, error } = await supabase
    .from("opportunities")
    .select(`
      *,
      poster:profiles!created_by (*)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Opportunities fetch error:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Opportunities</h1>
        <p className="text-muted-foreground">
          Explore jobs and internships posted by alumni
        </p>
      </div>

      <OpportunityList opportunities={opportunities || []} />
    </div>
  )
}