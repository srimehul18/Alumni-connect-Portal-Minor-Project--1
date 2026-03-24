"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, UserPlus, Briefcase, MessageSquare, Settings, CheckCheck, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Notification } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NotificationsListProps {
  notifications: Notification[]
}

const iconMap = {
  mentorship: UserPlus,
  opportunity: Briefcase,
  message: MessageSquare,
  system: Settings,
}

export function NotificationsList({ notifications: initialNotifications }: NotificationsListProps) {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleMarkAllRead = async () => {
    const supabase = createClient()
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

    if (unreadIds.length > 0) {
      await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds)
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
    }
  }

  const handleMarkRead = async (id: string) => {
    const supabase = createClient()
    await supabase.from("notifications").update({ is_read: true }).eq("id", id)
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from("notifications").delete().eq("id", id)
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No notifications</h3>
        <p className="text-muted-foreground">{"You're all caught up!"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
            : "All notifications read"}
        </p>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type] || Bell

          return (
            <Card
              key={notification.id}
              className={cn("transition-colors", !notification.is_read && "border-primary/50 bg-primary/5")}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    !notification.is_read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    {!notification.is_read && (
                      <Badge variant="default" className="shrink-0">
                        New
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                    <div className="flex gap-2">
                      {notification.link && (
                        <Button variant="ghost" size="sm" asChild onClick={() => handleMarkRead(notification.id)}>
                          <Link href={notification.link}>View</Link>
                        </Button>
                      )}
                      {!notification.is_read && (
                        <Button variant="ghost" size="sm" onClick={() => handleMarkRead(notification.id)}>
                          Mark read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
