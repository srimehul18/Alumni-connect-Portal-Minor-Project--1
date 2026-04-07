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
  Settings,
  User,
  Bookmark,
  UserPlus,
  BarChart3,
  Shield,
  LogOut,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { UserRole } from "@/lib/types"

interface SidebarProps {
  userRole: UserRole
}

const studentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {href: "/dashboard/community", label: "Community", icon: MessageSquare},
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

const bottomNavItems = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = userRole === "admin" ? adminNavItems : userRole === "alumni" ? alumniNavItems : studentNavItems

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    router.push("/")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-sidebar/95 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2.5 group jelly-hover">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden">
              <GraduationCap className="h-5 w-5 text-white relative z-10" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-primary">
                AlumniConnect
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">Student Portal</span>
            </div>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                  )}
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300 relative z-10",
                      !isActive && "group-hover:scale-110 group-hover:rotate-6",
                    )}
                  />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && <Sparkles className="h-3 w-3 ml-auto animate-pulse" />}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="border-t p-3">
          <nav className="flex flex-col gap-1">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                  )}
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300 relative z-10",
                      !isActive && "group-hover:scale-110 group-hover:rotate-6",
                    )}
                  />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              )
            })}
            <Button
              variant="ghost"
              className="justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group shake-hover"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </aside>
  )
}
