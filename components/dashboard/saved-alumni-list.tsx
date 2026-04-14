"use client"

import { useState } from "react"
import { AlumniCard } from "@/components/dashboard/alumni-card"
import { createClient } from "@/lib/supabase/client"
import type { AlumniWithProfile } from "@/lib/types"
import { Bookmark } from "lucide-react"

interface SavedAlumniListProps {
  alumni: AlumniWithProfile[]
  currentUserId: string
}

export function SavedAlumniList({ alumni: initialAlumni, currentUserId }: SavedAlumniListProps) {
  const [alumni, setAlumni] = useState<AlumniWithProfile[]>(initialAlumni)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleUnsave = async (alumniId: string) => {
    setLoadingId(alumniId)

    const supabase = createClient()

    const { error } = await supabase
      .from("saved_alumni")
      .delete()
      .eq("student_id", currentUserId)
      .eq("alumni_id", alumniId)

    if (error) {
      console.error("Unsave error:", error)
      setLoadingId(null)
      return
    }

    setAlumni((prev) => prev.filter((a) => a.id !== alumniId))
    setLoadingId(null)
  }

  if (alumni.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bookmark className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No saved alumni yet</h3>
        <p className="text-muted-foreground">
          Browse alumni and save them here for quick access
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {alumni.map((a) => (
        <AlumniCard
          key={a.id}
          alumni={a}
          isSaved
          onUnsave={() => handleUnsave(a.id)} currentUserRole={""}        />
      ))}
    </div>
  )
}