import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Clock, ExternalLink, Banknote, TrendingUp } from "lucide-react"
import type { Opportunity } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const isJob = opportunity.type === "job"

  return (
    <Card className="card-hover group flex flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {opportunity.title}
            </CardTitle>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{opportunity.company}</span>
            </div>
          </div>
          <Badge
            variant={isJob ? "default" : "secondary"}
            className={cn("shrink-0", isJob ? "gradient-primary text-white border-0" : "")}
          >
            {isJob ? "Job" : "Internship"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{opportunity.description}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {opportunity.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{opportunity.location}</span>
            </div>
          )}
          {opportunity.experience_level && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{opportunity.experience_level}</span>
            </div>
          )}
        </div>

        {opportunity.skills_required && opportunity.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {opportunity.skills_required.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {opportunity.skills_required.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{opportunity.skills_required.length - 3}
              </Badge>
            )}
          </div>
        )}

        {opportunity.salary_range && (
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Banknote className="h-4 w-4 text-success" />
            <span>{opportunity.salary_range}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t bg-muted/30">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDistanceToNow(new Date(opportunity.created_at), { addSuffix: true })}</span>
        </div>
        {opportunity.application_url ? (
          <Button size="sm" className="gap-1.5" asChild>
            <a href={opportunity.application_url} target="_blank" rel="noopener noreferrer">
              Apply
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : (
          <Button size="sm">Apply Now</Button>
        )}
      </CardFooter>
    </Card>
  )
}

export function OpportunityCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-6 w-48 rounded skeleton-shimmer" />
            <div className="h-4 w-32 rounded skeleton-shimmer" />
          </div>
          <div className="h-5 w-16 rounded-full skeleton-shimmer" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pt-0">
        <div className="h-10 w-full rounded skeleton-shimmer" />
        <div className="flex gap-4">
          <div className="h-4 w-24 rounded skeleton-shimmer" />
          <div className="h-4 w-20 rounded skeleton-shimmer" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full skeleton-shimmer" />
          <div className="h-5 w-14 rounded-full skeleton-shimmer" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3 border-t bg-muted/30">
        <div className="h-4 w-24 rounded skeleton-shimmer" />
        <div className="h-8 w-20 rounded skeleton-shimmer" />
      </CardFooter>
    </Card>
  )
}
