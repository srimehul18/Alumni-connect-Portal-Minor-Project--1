import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, GraduationCap, Linkedin, Github, MessageSquare, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { RequestMentorshipButton } from "@/components/dashboard/request-mentorship-button"

export default async function AlumniProfilePage({ params,
  
 }: { 
  params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch alumni profile
  const { data: alumni } = await supabase
    .from("profiles")
    .select(`
      *,
      alumni_profiles!user_id (*)
    `)
    .eq("id", id)
    .eq("role", "alumni")
    .single()

  const {data: alumniProfile} = await supabase.from("alumni_profiles").select("*").eq("user_id", id).single()

    console.log("Alumni fetch result:", { alumni })
    console.log("Alumni profile data:", alumniProfile)

  if (!alumni) notFound()



  // Check if mentorship already requested
  const { data: existingRequest } = await supabase
    .from("mentorship_requests")
    .select("*")
    .eq("student_id", user.id)
    .eq("alumni_id", id)
    .single()

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/dashboard/alumni">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Alumni
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={alumni.avatar_url || undefined} alt={alumni.full_name || "Alumni"} />
                  <AvatarFallback className="text-2xl">{alumni.full_name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <h1 className="text-2xl font-bold">{alumni.full_name || "Alumni"}</h1>
                    {alumni.is_verified && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>

                  {alumniProfile?.job_title && alumniProfile?.company && (
                    <div className="mt-1 flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                      <Briefcase className="h-4 w-4" />
                      {alumniProfile.job_title} at {alumniProfile.company}
                    </div>
                  )}

                  {alumniProfile?.branch && alumniProfile?.graduation_year && (
                    <div className="mt-1 flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                      <GraduationCap className="h-4 w-4" />
                      {alumniProfile.branch} - Class of {alumniProfile.graduation_year}
                    </div>
                  )}

                  {alumniProfile?.is_mentor_available && (
                    <Badge className="mt-2" variant="default">
                      Available for Mentorship
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  {alumniProfile?.linkedin_url && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={alumniProfile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {alumniProfile?.github_url && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={alumniProfile.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {alumniProfile?.bio && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{alumniProfile.bio}</p>
              </CardContent>
            </Card>
          )}

          {alumniProfile?.skills && alumniProfile.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {alumniProfile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {alumniProfile?.expertise_areas && alumniProfile.expertise_areas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Areas of Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {alumniProfile.expertise_areas.map((area: string) => (
                    <Badge key={area} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connect</CardTitle>
              <CardDescription>Reach out to {alumni.full_name?.split(" ")[0] || "this alumni"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href={`/dashboard/messages?to=${alumni.id}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Link>
              </Button>

              {alumniProfile?.is_mentor_available && (
                <RequestMentorshipButton alumniId={alumni.id} studentId={user.id} existingRequest={existingRequest} />
              )}
            </CardContent>
          </Card>

          {alumniProfile?.mentorship_areas && alumniProfile.mentorship_areas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {alumniProfile.mentorship_areas.map((area: string) => (
                    <Badge key={area} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {alumniProfile?.experience_years && (
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{alumniProfile.experience_years}+ years</p>
                <p className="text-sm text-muted-foreground">of industry experience</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}