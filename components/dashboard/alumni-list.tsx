"use client"

import { useState, useMemo, useCallback } from "react"
import { AlumniCard, AlumniCardSkeleton } from "@/components/dashboard/alumni-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Users, SlidersHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { AlumniWithProfile } from "@/lib/types"
import { BRANCHES, SKILLS, GRADUATION_YEARS } from "@/lib/constants"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface AlumniListProps {
  alumni: AlumniWithProfile[]
  savedAlumniIds: string[]
  currentUserId: string
  currentUserRole: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useMemo(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function AlumniList({ alumni, savedAlumniIds: initialSavedIds, currentUserId, currentUserRole }: AlumniListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [mentorOnly, setMentorOnly] = useState(false)
  const [savedAlumniIds, setSavedAlumniIds] = useState<string[]>(initialSavedIds)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  const filteredAlumni = useMemo(() => {
    return alumni.filter((a) => {
      const profile = a.alumni_profiles?.[0]

      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase()
        const matchesName = a.full_name?.toLowerCase().includes(query)
        const matchesCompany = profile?.company?.toLowerCase().includes(query)
        const matchesTitle = profile?.job_title?.toLowerCase().includes(query)
        const matchesSkills = profile?.skills?.some((s) => s.toLowerCase().includes(query))
        if (!matchesName && !matchesCompany && !matchesTitle && !matchesSkills) return false
      }

      if (selectedBranch !== "all" && profile?.branch !== selectedBranch) return false
      if (selectedYear !== "all" && profile?.graduation_year?.toString() !== selectedYear) return false

      if (selectedSkills.length > 0) {
        const hasSkill = selectedSkills.some((skill) => profile?.skills?.includes(skill))
        if (!hasSkill) return false
      }

      if (mentorOnly && !profile?.is_mentor_available) return false

      return true
    })
  }, [alumni, debouncedSearch, selectedBranch, selectedYear, selectedSkills, mentorOnly])

  const handleSave = useCallback(
    async (alumniId: string) => {
      const supabase = createClient()
      const { error } = await supabase.from("saved_alumni").insert({ student_id: currentUserId, alumni_id: alumniId })
      if (error) {
        toast.error("Failed to save alumni")
        return
      }
      setSavedAlumniIds((prev) => [...prev, alumniId])
    },
    [currentUserId],
  )

  const handleUnsave = useCallback(
    async (alumniId: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from("saved_alumni")
        .delete()
        .eq("student_id", currentUserId)
        .eq("alumni_id", alumniId)
      if (error) {
        toast.error("Failed to remove alumni")
        return
      }
      setSavedAlumniIds((prev) => prev.filter((id) => id !== alumniId))
    },
    [currentUserId],
  )

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedBranch("all")
    setSelectedYear("all")
    setSelectedSkills([])
    setMentorOnly(false)
  }

  const hasActiveFilters =
    searchQuery || selectedBranch !== "all" || selectedYear !== "all" || selectedSkills.length > 0 || mentorOnly

  const activeFilterCount = [
    selectedBranch !== "all",
    selectedYear !== "all",
    selectedSkills.length > 0,
    mentorOnly,
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
              searchQuery ? "text-primary" : "text-muted-foreground",
            )}
          />
          <Input
            placeholder="Search by name, company, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {BRANCHES.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {GRADUATION_YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="mentor"
                    checked={mentorOnly}
                    onCheckedChange={(checked) => setMentorOnly(checked as boolean)}
                  />
                  <Label htmlFor="mentor" className="text-sm font-medium cursor-pointer">
                    Available for mentorship only
                  </Label>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.slice(0, 12).map((skill) => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => {
                          if (selectedSkills.includes(skill)) {
                            setSelectedSkills(selectedSkills.filter((s) => s !== skill))
                          } else {
                            setSelectedSkills([...selectedSkills, skill])
                          }
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear all filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredAlumni.length}</span> results
          </span>
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 text-xs">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {filteredAlumni.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAlumni.map((a) => (
            <AlumniCard
              key={a.id}
              alumni={a}
              isSaved={savedAlumniIds.includes(a.id)}
              onSave={() => handleSave(a.id)}
              onUnsave={() => handleUnsave(a.id)}
              currentUserRole= {currentUserRole}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="users"
          title="No alumni found"
          description="Try adjusting your search or filters to find more alumni."
          action={hasActiveFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined}
        />
      )}
    </div>
  )
}

export function AlumniListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="h-10 flex-1 rounded-md skeleton-shimmer" />
        <div className="flex gap-2">
          <div className="h-10 w-[150px] rounded-md skeleton-shimmer" />
          <div className="h-10 w-[130px] rounded-md skeleton-shimmer" />
          <div className="h-10 w-10 rounded-md skeleton-shimmer" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <AlumniCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
