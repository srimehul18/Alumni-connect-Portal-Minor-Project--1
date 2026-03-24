import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AlumniCard } from "@/components/dashboard/alumni-card"
import { OpportunityCard } from "@/components/dashboard/opportunity-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight} from "lucide-react"
import Link from "next/link"
import type { AlumniWithProfile, Opportunity, Profile } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  let profile: Profile | null = null
  let dbError = false

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching profile:", error)
      dbError = true
    }
    profile = data
  } catch (err) {
    console.error("[v0] Database error:", err)
    dbError = true
  }

  // If database error, show setup message

  if (!profile) {
  redirect("/auth/complete-profile")
}

  if (dbError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 mb-4">
          <AlertCircle className="h-8 w-8 text-warning" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Database Setup Required</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          The database tables need to be created. Please run the SQL scripts (001-009) in the scripts folder to set up
          the required tables.
        </p>
        <Card className="max-w-lg w-full text-left">
          <CardHeader>
            <CardTitle className="text-base">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Open the scripts folder in your project</p>
            <p>2. Run each SQL script in order (001 through 009)</p>
            <p>3. Refresh this page after running the scripts</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  let alumniCount = 0
  let opportunitiesCount = 0
  let mentorshipCount = 0
  let recommendedAlumni: AlumniWithProfile[] = []
  let latestOpportunities: Opportunity[] = []

  try {
    const [alumniRes, opportunitiesRes, mentorshipRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "alumni"),
      supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("mentorship_requests").select("id", { count: "exact", head: true }).eq("student_id", user.id),
    ])

    alumniCount = alumniRes.count || 0
    opportunitiesCount = opportunitiesRes.count || 0
    mentorshipCount = mentorshipRes.count || 0

    const { data: alumni } = await supabase
      .from("profiles")
      .select(`
        *,
        alumni_profiles (*)
      `)
      .eq("role", "alumni")
      .eq("is_verified", true)
      .limit(3)

    const { data: opportunities } = await supabase
      .from("opportunities")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3)

    recommendedAlumni = (alumni as AlumniWithProfile[]) || []
    latestOpportunities = (opportunities as Opportunity[]) || []
  } catch (err) {
    console.error("[v0] Error fetching dashboard data:", err)
  }

  if (profile.role === "student") {
    return (
      <StudentDashboard
        profile={profile}
        alumniCount={alumniCount}
        opportunitiesCount={opportunitiesCount}
        mentorshipCount={mentorshipCount}
        recommendedAlumni={recommendedAlumni}
        latestOpportunities={latestOpportunities}
      />
    )
  }

  if (profile.role === "alumni") {
  // block unverified alumni
  if (!profile.is_verified) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Your account is waiting for verification
        </h2>

        <p className="text-muted-foreground max-w-md">
          An admin will review your alumni status soon. You will be able to
          access the alumni dashboard once your account is verified.
        </p>
      </div>
    )
  }

  return <AlumniDashboardOverview profile={profile} />
}

  return <AdminDashboardOverview profile={profile} />
}

function StudentDashboard({
  profile,
  alumniCount,
  opportunitiesCount,
  mentorshipCount,
  recommendedAlumni,
  latestOpportunities,
}: {
  profile: Profile
  alumniCount: number
  opportunitiesCount: number
  mentorshipCount: number
  recommendedAlumni: AlumniWithProfile[]
  latestOpportunities: Opportunity[]
}) {
  return (
    <div className="space-y-6 animate-in-up">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, <span className="text-gradient">{profile.full_name?.split(" ")[0] || "Student"}</span>!
        </h1>
        <p className="text-muted-foreground">Here is what is happening with your network today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
  title="Active Alumni"
  value={alumniCount}
  icon="users"
  description="Available to connect"
  variant="primary"
/>
        <StatsCard
          title="Open Opportunities"
          value={opportunitiesCount}
          icon="briefcase"
          description="Jobs & internships"
          variant="success"
        />
        <StatsCard
          title="My Mentorship Requests"
          value={mentorshipCount}
          icon="user-check"
          description="Pending & accepted"
          variant="info"
        />
        <StatsCard title="Messages" value={0} icon="message-square" description="Unread messages" variant="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
            <div>
              <CardTitle className="text-lg">Recommended Alumni</CardTitle>
              <CardDescription>Alumni matching your interests and goals</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5" asChild>
              <Link href="/dashboard/alumni">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {recommendedAlumni.length > 0 ? (
              <div className="space-y-4">
                {recommendedAlumni.map((alumni) => (
                  <AlumniCard key={alumni.id} alumni={alumni} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="Search"
                title="No alumni found"
                description="Check back later or explore the alumni directory to connect with professionals."
                action={{ label: "Browse Alumni", href: "/dashboard/alumni" }}
              />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
            <div>
              <CardTitle className="text-lg">Latest Opportunities</CardTitle>
              <CardDescription>Recent jobs and internships posted</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5" asChild>
              <Link href="/dashboard/opportunities">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {latestOpportunities.length > 0 ? (
              <div className="space-y-4">
                {latestOpportunities.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="FileText"
                title="No opportunities yet"
                description="New job and internship postings will appear here. Check back soon!"
                action={{ label: "View All Opportunities", href: "/dashboard/opportunities" }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AlumniDashboardOverview({ profile }: { profile: Profile }) {
  return (
    <div className="space-y-6 animate-in-up">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, <span className="text-gradient">{profile.full_name?.split(" ")[0] || "Alumni"}</span>!
        </h1>
        <p className="text-muted-foreground">Manage your mentorship requests and opportunities.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Mentorship Requests"
          value={0}
          icon="user-check"
          description="Pending requests"
          variant="primary"
        />
        <StatsCard title="Active Mentees" value={0} icon="users" description="Students you mentor" variant="success" />
        <StatsCard
          title="Posted Opportunities"
          value={0}
          icon="briefcase"
          description="Jobs & internships"
          variant="info"
        />
        <StatsCard title="Messages" value={0} icon="message-square" description="Unread messages" variant="warning" />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 pt-4">
          <Button asChild>
            <Link href="/dashboard/profile">Complete Your Profile</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/opportunities/new">Post an Opportunity</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/mentorship">View Mentorship Requests</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboardOverview({ profile }: { profile: Profile }) {
  return (
    <div className="space-y-6 animate-in-up">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage and monitor the platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={0} icon="users" description="Students & alumni" variant="primary" />
        <StatsCard
          title="Pending Verification"
          value={0}
          icon="shield"
          description="Alumni to verify"
          variant="warning"
        />
        <StatsCard
          title="Active Opportunities"
          value={0}
          icon="briefcase"
          description="Jobs & internships"
          variant="success"
        />
        <StatsCard title="Mentorships" value={0} icon="user-check" description="Active connections" variant="info" />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 pt-4">
          <Button asChild>
            <Link href="/dashboard/verify">Verify Alumni</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/users">Manage Users</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/analytics">View Analytics</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
