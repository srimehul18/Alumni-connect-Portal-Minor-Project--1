import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, Briefcase, UserCheck, MessageSquare, TrendingUp } from "lucide-react"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"

export default async function AnalyticsPage() {
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

  // Fetch statistics
  const [
    totalStudents,
    totalAlumni,
    verifiedAlumni,
    totalOpportunities,
    activeOpportunities,
    totalMentorships,
    acceptedMentorships,
    totalMessages,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "alumni"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "alumni").eq("is_verified", true),
    supabase.from("opportunities").select("id", { count: "exact", head: true }),
    supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("mentorship_requests").select("id", { count: "exact", head: true }),
    supabase.from("mentorship_requests").select("id", { count: "exact", head: true }).eq("status", "accepted"),
    supabase.from("messages").select("id", { count: "exact", head: true }),
  ])

  // Fetch recent registrations for charts
  const { data: recentProfiles } = await supabase
    .from("profiles")
    .select("created_at, role")
    .order("created_at", { ascending: false })
    .limit(100)

  // Group by month for chart data
  const monthlyData = getMonthlyData(recentProfiles || [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Platform statistics and insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={totalStudents.count || 0}
          icon="graduation"
          description="Registered students"
        />
        <StatsCard
          title="Total Alumni"
          value={totalAlumni.count || 0}
          icon="users"
          description={`${verifiedAlumni.count || 0} verified`}
        />
        <StatsCard
          title="Active Opportunities"
          value={activeOpportunities.count || 0}
          icon="briefcase"
          description={`${totalOpportunities.count || 0} total posted`}
        />
        <StatsCard
          title="Mentorships"
          value={acceptedMentorships.count || 0}
          icon="user-check"
          description={`${totalMentorships.count || 0} total requests`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Registrations</CardTitle>
            <CardDescription>Monthly new user signups</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts data={monthlyData} type="registrations" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts
              data={[
                { name: "Students", value: totalStudents.count || 0 },
                { name: "Alumni", value: totalAlumni.count || 0 },
              ]}
              type="distribution"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Platform Health</CardTitle>
              <CardDescription>Key metrics</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verification Rate</span>
              <span className="font-medium">
                {totalAlumni.count ? Math.round(((verifiedAlumni.count || 0) / totalAlumni.count) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mentorship Success Rate</span>
              <span className="font-medium">
                {totalMentorships.count
                  ? Math.round(((acceptedMentorships.count || 0) / totalMentorships.count) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Opportunities</span>
              <span className="font-medium">
                {totalOpportunities.count
                  ? Math.round(((activeOpportunities.count || 0) / totalOpportunities.count) * 100)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Messages</CardTitle>
            <CardDescription>Platform communication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <MessageSquare className="h-12 w-12 text-primary" />
              <div>
                <div className="text-3xl font-bold">{totalMessages.count || 0}</div>
                <p className="text-sm text-muted-foreground">Messages exchanged</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Requires attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alumni to Verify</span>
              <span className="font-medium">{(totalAlumni.count || 0) - (verifiedAlumni.count || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending Mentorships</span>
              <span className="font-medium">{(totalMentorships.count || 0) - (acceptedMentorships.count || 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getMonthlyData(profiles: { created_at: string; role: string }[]) {
  const months: Record<string, { students: number; alumni: number }> = {}

  profiles.forEach((p) => {
    const month = new Date(p.created_at).toLocaleString("default", { month: "short", year: "2-digit" })
    if (!months[month]) {
      months[month] = { students: 0, alumni: 0 }
    }
    if (p.role === "student") months[month].students++
    else if (p.role === "alumni") months[month].alumni++
  })

  return Object.entries(months)
    .map(([name, data]) => ({
      name,
      students: data.students,
      alumni: data.alumni,
    }))
    .reverse()
    .slice(0, 6)
}
