"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Users,
  GraduationCap,
  Briefcase,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react"

/* -----------------------------
   ICON MAP (IMPORTANT CHANGE)
------------------------------ */
const iconMap: Record<string, LucideIcon> = {
  users: Users,
  graduation: GraduationCap,
  briefcase: Briefcase,
}

interface StatsCardProps {
  title: string
  value: string | number
  description?: string

  /* 🔴 changed from LucideIcon → string */
  icon: keyof typeof iconMap

  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "primary" | "success" | "warning" | "info"
}

const variantStyles = {
  default: {
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  primary: {
    iconBg: "gradient-primary",
    iconColor: "text-white",
  },
  success: {
    iconBg: "gradient-success",
    iconColor: "text-white",
  },
  warning: {
    iconBg: "gradient-warning",
    iconColor: "text-warning-foreground",
  },
  info: {
    iconBg: "gradient-info",
    iconColor: "text-white",
  },
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  const styles = variantStyles[variant]
  const Icon = iconMap[icon]

  return (
    <Card className="lift-hover shine-hover group overflow-hidden cursor-default">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          {title}
        </CardTitle>

        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden shadow-sm group-hover:shadow-md",
            styles.iconBg,
          )}
        >
          {Icon && (
            <Icon
              className={cn(
                "h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12",
                styles.iconColor,
              )}
            />
          )}
          <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold tracking-tight transition-all duration-500 group-hover:text-primary group-hover:scale-105 origin-left">
          {value}
        </div>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground transition-opacity duration-300 group-hover:opacity-80">
            {description}
          </p>
        )}

        {trend && (
          <div className="mt-2 flex items-center gap-2">
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold transition-all duration-300 hover:scale-105",
                trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 animate-pulse" />
              ) : (
                <TrendingDown className="h-3 w-3 animate-pulse" />
              )}
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </div>
            <span className="text-xs text-muted-foreground font-normal">vs. last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* -----------------------------
   SKELETON (UNCHANGED)
------------------------------ */
export function StatsCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 rounded skeleton-shimmer" />
        <div className="h-9 w-9 rounded-lg skeleton-shimmer" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 rounded skeleton-shimmer" />
        <div className="mt-2 h-3 w-32 rounded skeleton-shimmer" />
      </CardContent>
    </Card>
  )
}