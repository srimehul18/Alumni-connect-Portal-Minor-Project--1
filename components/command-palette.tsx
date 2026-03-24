"use client"

import type * as React from "react"
import { useEffect, useState, useCallback } from "react"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Users, Briefcase, MessageSquare, Settings, LogOut, Home, Bell, BarChart3, Book, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface CommandPaletteItem {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  category: string
  action?: () => void
  href?: string
  keywords?: string[]
}

const commandItems: CommandPaletteItem[] = [
  {
    id: "home",
    title: "Dashboard",
    description: "Go to dashboard",
    icon: <Home className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard",
    keywords: ["home", "dashboard", "main"],
  },
  {
    id: "alumni",
    title: "Find Alumni",
    description: "Search and connect with alumni",
    icon: <Users className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard/alumni",
    keywords: ["alumni", "mentors", "people"],
  },
  {
    id: "opportunities",
    title: "Opportunities",
    description: "Browse jobs and internships",
    icon: <Briefcase className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard/opportunities",
    keywords: ["jobs", "internships", "opportunities"],
  },
  {
    id: "messages",
    title: "Messages",
    description: "View your conversations",
    icon: <MessageSquare className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard/messages",
    keywords: ["chat", "messaging", "inbox"],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Check notifications",
    icon: <Bell className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard/notifications",
    keywords: ["alerts", "updates"],
  },
  {
    id: "mentorship",
    title: "Mentorship",
    description: "View mentorship requests",
    icon: <Book className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard/mentorship",
    keywords: ["mentor", "guidance"],
  },
  {
    id: "saved",
    title: "Saved Alumni",
    description: "Your saved profiles",
    icon: <Heart className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard/saved",
    keywords: ["bookmarks", "favorites"],
  },
  {
    id: "profile",
    title: "My Profile",
    description: "Edit your profile",
    icon: <Users className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard/profile",
    keywords: ["profile", "account", "settings"],
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "View analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard/analytics",
    keywords: ["stats", "insights"],
  },
  {
    id: "settings",
    title: "Settings",
    description: "Manage your settings",
    icon: <Settings className="h-4 w-4" />,
    category: "Navigation",
    href: "/dashboard/settings",
    keywords: ["preferences", "account"],
  },
  {
    id: "logout",
    title: "Logout",
    description: "Sign out of your account",
    icon: <LogOut className="h-4 w-4" />,
    category: "Account",
    action: () => {
      // Handle logout
    },
    keywords: ["sign out", "logout"],
  },
]

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const filterItems = useCallback(() => {
    if (!search) return commandItems

    const query = search.toLowerCase()
    return commandItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.keywords?.some((kw) => kw.includes(query)),
    )
  }, [search])

  const handleSelect = (item: CommandPaletteItem) => {
    setOpen(false)
    if (item.action) {
      item.action()
    } else if (item.href) {
      router.push(item.href)
    }
  }

  const groupedItems = filterItems().reduce(
    (acc, item) => {
      const existing = acc.find((g) => g.category === item.category)
      if (existing) {
        existing.items.push(item)
      } else {
        acc.push({ category: item.category, items: [item] })
      }
      return acc
    },
    [] as Array<{ category: string; items: CommandPaletteItem[] }>,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group]:overflow-hidden [&_[cmdk-group-heading]]:line-clamp-1">
          <CommandInput
            placeholder="Search commands, pages, and actions..."
            value={search}
            onValueChange={setSearch}
            className="border-none focus-visible:ring-0"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No results found.</CommandEmpty>

            {groupedItems.map((group) => (
              <CommandGroup key={group.category} heading={group.category}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    className="cursor-pointer px-2 py-2 transition-colors hover:bg-accent data-[selected]:bg-primary/10"
                    onSelect={() => handleSelect(item)}
                  >
                    {item.icon && <span className="mr-2 h-4 w-4 flex-shrink-0 opacity-60">{item.icon}</span>}
                    <div className="flex-1">
                      <div className="text-sm font-medium leading-none">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground leading-none mt-0.5">{item.description}</div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>

          <div className="border-t border-border/50 bg-muted/30 px-2 py-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>
              Press <kbd className="rounded px-1 py-0.5 bg-background font-mono text-xs border">⌘K</kbd> to open
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
