"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  Bookmark,
  UserPlus,
  BarChart3,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/lib/types"

interface MobileNavProps {
  userRole: UserRole
}

const studentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/alumni", label: "Discover Alumni", icon: Users },
  { href: "/dashboard/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/dashboard/saved", label: "Saved Alumni", icon: Bookmark },
  { href: "/dashboard/mentorship", label: "Mentorship", icon: UserPlus },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
]

const alumniNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/mentorship", label: "Mentorship Requests", icon: UserPlus },
  { href: "/dashboard/opportunities", label: "My Opportunities", icon: Briefcase },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
]

const adminNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/verify", label: "Verify Alumni", icon: Shield },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
]

export function MobileNav({ userRole }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navItems = userRole === "admin" ? adminNavItems : userRole === "alumni" ? alumniNavItems : studentNavItems

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <GraduationCap className="h-8 w-8 text-black" />
              <span className="text-xl font-bold">AlumniConnect</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t p-3">
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/dashboard/profile"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/dashboard/settings"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
