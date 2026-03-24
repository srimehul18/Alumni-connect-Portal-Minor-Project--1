"use client"

import type { LucideIcon } from "lucide-react"
import { Search, FileText, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

/* -----------------------------
   ICON MAP (KEY FIX)
------------------------------ */
const iconMap: Record<string, LucideIcon> = {
  search: Search,
  "file-text": FileText,
  inbox: Inbox,
}

interface EmptyStateProps {
  /* 🔴 changed from LucideIcon → string key */
  icon: keyof typeof iconMap

  title: string
  description: string

  action?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline" | "secondary"
  }

  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }

  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon]

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center animate-in-up", className)}>
      {/* Animated icon container */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-6 relative group">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl group-hover:blur-2xl transition-all duration-500" />

        {Icon && (
          <Icon className="h-8 w-8 text-primary relative z-10 transition-transform duration-500 group-hover:scale-110" />
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {action &&
            (action.href ? (
              <Button asChild variant={action.variant || "default"} className="magnetic-hover">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button onClick={action.onClick} variant={action.variant || "default"} className="magnetic-hover">
                {action.label}
              </Button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Button asChild variant="outline" className="magnetic-hover bg-transparent">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : (
              <Button onClick={secondaryAction.onClick} variant="outline" className="magnetic-hover bg-transparent">
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      )}
    </div>
  )
}