"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, GraduationCap, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { AlumniWithProfile } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface VerifyAlumniListProps {
  alumni: AlumniWithProfile[]
}

export function VerifyAlumniList({ alumni: initialAlumni }: VerifyAlumniListProps) {
  const [alumni, setAlumni] = useState(initialAlumni)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)

  const handleVerify = async (alumniId: string) => {
    setLoadingId(alumniId)

    const supabase = createClient()

    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", alumniId)

    if (error) {
      console.error("Verification failed:", error)
      setLoadingId(null)
      return
    }

    // remove verified alumni from UI list
    setAlumni((prev) => prev.filter((a) => a.id !== alumniId))
    setLoadingId(null)
  }

  const handleReject = async () => {
    if (!rejectId) return

    setLoadingId(rejectId)

    const supabase = createClient()

    const { error } = await supabase.from("profiles").delete().eq("id", rejectId)

    if (error) {
      console.error("Reject failed:", error)
      setLoadingId(null)
      return
    }

    setAlumni((prev) => prev.filter((a) => a.id !== rejectId))
    setRejectId(null)
    setLoadingId(null)
  }

  if (alumni.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="mb-4 h-12 w-12 text-green-600" />
        <h3 className="text-lg font-semibold">All caught up!</h3>
        <p className="text-muted-foreground">No alumni pending verification</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alumni.map((a) => {
          const alumniProfile = a.alumni_profiles?.[0]

          return (
            <Card key={a.id}>
              <CardHeader className="flex flex-row items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={a.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {a.full_name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="font-semibold">{a.full_name || "No name"}</h3>
                  <p className="text-sm text-muted-foreground">{a.email}</p>

                  {alumniProfile?.company && alumniProfile?.job_title && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      {alumniProfile.job_title} at {alumniProfile.company}
                    </div>
                  )}

                  {alumniProfile?.branch && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <GraduationCap className="h-3 w-3" />
                      {alumniProfile.branch} - Class of {alumniProfile.graduation_year}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {alumniProfile?.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {alumniProfile.bio}
                  </p>
                )}

                {alumniProfile?.skills && alumniProfile.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {alumniProfile.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleVerify(a.id)}
                  disabled={loadingId === a.id}
                >
                  {loadingId === a.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setRejectId(a.id)}
                  disabled={loadingId === a.id}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <AlertDialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Alumni?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the alumni account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive text-destructive-foreground"
            >
              Reject & Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
