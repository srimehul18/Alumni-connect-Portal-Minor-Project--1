import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NotificationsList } from "@/components/dashboard/notifications-list"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

    await supabase
  .from("notifications")
  .update({ is_read: true })
  .eq("user_id", user.id)
  .eq("is_read", false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated on activity</p>
      </div>

      <NotificationsList notifications={notifications || []} />
    </div>
  )
}
