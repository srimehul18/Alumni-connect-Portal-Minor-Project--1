"use server"

import { createClient } from "@/lib/supabase/server"

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "mentorship" | "opportunity" | "system" | "message",
  link?: string,
) {
  const supabase = await createClient()

  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    link,
  })
}
