"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bookmark, BookmarkCheck, MessageSquare, Briefcase, GraduationCap, Eye, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { AlumniWithProfile } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AlumniCardProps {
  alumni: AlumniWithProfile
  isSaved?: boolean
  onSave?: () => void
  onUnsave?: () => void
  currentUserRole?: string
}

export function AlumniCard({ alumni, isSaved, onSave, onUnsave, currentUserRole }: AlumniCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const alumniProfile = alumni.alumni_profiles?.[0]

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    try {
      if (isSaved) {
        await onUnsave?.()
        toast.success("Removed from saved alumni")
      } else {
        await onSave?.()
        toast.success("Added to saved alumni")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleRequestMentorship = async () => {
    if (isRequesting) return

    setIsRequesting(true)

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("You must be logged in")
      setIsRequesting(false)
      return
    }

    // prevent duplicate requests
    const { data: existing } = await supabase
      .from("mentorship_requests")
      .select("id")
      .eq("student_id", user.id)
      .eq("alumni_id", alumni.id)
      .maybeSingle()

    if (existing) {
      toast.info("You already requested mentorship from this alumni")
      setIsRequesting(false)
      return
    }

    const { error } = await supabase.from("mentorship_requests").insert({
      student_id: user.id,
      alumni_id: alumni.id,
      message: "I would like mentorship guidance.",
      status: "pending",
    })

    if (error) {
      console.error("Mentorship request error:", error)
      toast.error("Failed to send mentorship request")
    } else {
      toast.success("Mentorship request sent!")
    }

    setIsRequesting(false)
  }


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)"
  }

  return (
    <>
      <Card
        ref={cardRef}
        className="group flex flex-col overflow-hidden transition-all duration-300 ease-out shine-hover cursor-default"
        style={{ transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader className="flex flex-row items-start gap-4 pb-3">
          <div className="relative">
            <Avatar className="h-14 w-14 ring-2 ring-background shadow-md transition-all duration-500 group-hover:scale-110 group-hover:ring-primary/30">
              <AvatarImage src={alumni.avatar_url || undefined} alt={alumni.full_name || "Alumni"} />
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {alumni.full_name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-150" />
            {alumni.is_verified && (
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-sm animate-pulse">
                <svg className="h-3 w-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight truncate transition-colors duration-300 group-hover:text-primary">
                {alumni.full_name || "Alumni"}
              </h3>
            </div>
            {alumniProfile?.job_title && alumniProfile?.company && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="truncate">
                  {alumniProfile.job_title} at {alumniProfile.company}
                </span>
              </div>
            )}
            {alumniProfile?.branch && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span>
                  {alumniProfile.branch} &apos;{alumniProfile.graduation_year?.toString().slice(-2)}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 pt-0">
          {alumniProfile?.bio && (
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{alumniProfile.bio}</p>
          )}
          {alumniProfile?.skills && alumniProfile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {alumniProfile.skills.slice(0, 4).map((skill, index) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs font-normal transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {skill}
                </Badge>
              ))}
              {alumniProfile.skills.length > 4 && (
                <Badge variant="outline" className="text-xs font-normal elastic-hover">
                  +{alumniProfile.skills.length - 4}
                </Badge>
              )}
            </div>
          )}
          {currentUserRole === "student" && alumniProfile?.is_mentor_available && (
            <Badge className="mt-3 gap-1 glow-pulse" variant="default">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Open to Mentor
            </Badge>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 pt-3 border-t bg-muted/30">
          <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1 elastic-hover group/btn">
                <Eye className="mr-2 h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
                Quick View
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg animate-in-scale">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={alumni.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {alumni.full_name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      {alumni.full_name}
                      {alumni.is_verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>

                    {alumniProfile?.job_title && alumniProfile?.company && (
                      <p className="text-sm font-normal text-muted-foreground">
                        {alumniProfile.job_title} at {alumniProfile.company}
                      </p>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {alumniProfile?.bio && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">About</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {alumniProfile.bio}
                    </p>
                  </div>
                )}

                {alumniProfile?.branch && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    {alumniProfile.branch} - Class of {alumniProfile.graduation_year}
                  </div>
                )}

                {alumniProfile?.skills && alumniProfile.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {alumniProfile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs elastic-hover">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {alumniProfile?.is_mentor_available && alumniProfile?.mentorship_areas && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Mentorship Areas</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {alumniProfile.mentorship_areas.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs elastic-hover">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 magnetic-hover glow-hover" asChild>
                    <Link href={`/dashboard/alumni/${alumni.id}`}>
                      View Full Profile
                    </Link>
                  </Button>

                  <Button variant="outline" asChild className="elastic-hover bg-transparent">
                    <Link href={`/dashboard/messages?to=${alumni.id}`}>
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* NEW: Mentorship Request Button */}
          {alumniProfile?.is_mentor_available && (
            <Button
              variant="default"
              size="sm"
              onClick={handleRequestMentorship}
              disabled={isRequesting}
              className="elastic-hover"
            >
              {isRequesting ? "Sending..." : "Request Mentorship"}
            </Button>
          )}

          {/* Existing Save Button */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "transition-all duration-300 pop-hover",
              isSaved && "border-primary/50 bg-primary/5 text-primary",
            )}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-primary animate-in-scale" />
            ) : (
              <Bookmark className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            )}
          </Button>
        </CardFooter>

      </Card>
    </>
  )
}

export function AlumniCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        <div className="h-14 w-14 rounded-full skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 rounded skeleton-shimmer" />
          <div className="h-4 w-48 rounded skeleton-shimmer" />
          <div className="h-4 w-24 rounded skeleton-shimmer" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <div className="h-10 w-full rounded skeleton-shimmer mb-3" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full skeleton-shimmer" />
          <div className="h-5 w-20 rounded-full skeleton-shimmer" />
          <div className="h-5 w-14 rounded-full skeleton-shimmer" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3 border-t bg-muted/30">
        <div className="h-9 flex-1 rounded skeleton-shimmer" />
        <div className="h-9 w-9 rounded skeleton-shimmer" />
      </CardFooter>
    </Card>
  )
}
