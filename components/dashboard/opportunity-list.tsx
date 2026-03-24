"use client"

import { useState, useMemo } from "react"
import { OpportunityCard } from "@/components/dashboard/opportunity-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { Opportunity } from "@/lib/types"
import { EXPERIENCE_LEVELS } from "@/lib/constants"

interface OpportunityListProps {
  opportunities: Opportunity[]
}

export function OpportunityList({ opportunities }: OpportunityListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const filteredOpportunities = useMemo(() => {
  return opportunities.filter((opp) => {
    const query = searchQuery.trim().toLowerCase()

    if (query) {
      const matchesTitle = opp.title?.toLowerCase().includes(query)
      const matchesCompany = opp.company?.toLowerCase().includes(query)
      const matchesDesc = opp.description?.toLowerCase().includes(query)

      if (!matchesTitle && !matchesCompany && !matchesDesc) return false
    }

    if (typeFilter !== "all" && opp.type !== typeFilter) return false

    if (levelFilter !== "all" && opp.experience_level !== levelFilter) return false

    return true
  })
}, [opportunities, searchQuery, typeFilter, levelFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="job">Jobs</SelectItem>
            <SelectItem value="internship">Internships</SelectItem>
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {EXPERIENCE_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredOpportunities.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No opportunities found.</p>
        </div>
      )}
    </div>
  )
}
