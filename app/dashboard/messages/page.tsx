import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessagingInterface } from "@/components/dashboard/messaging-interface"

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) redirect("/auth/login")

  // Fetch all conversations (unique users the current user has messaged or been messaged by)
  const { data: sentMessages } = await supabase
    .from("messages")
    .select(`
      receiver_id,
      receiver:profiles!receiver_id (*)
    `)
    .eq("sender_id", user.id)

  const { data: receivedMessages } = await supabase
    .from("messages")
    .select(`
      sender_id,
      sender:profiles!sender_id (*)
    `)
    .eq("receiver_id", user.id)

  // Build unique contacts list
  const contactsMap = new Map<string, any>()

  sentMessages?.forEach((m) => {
    if (m.receiver_id && m.receiver && !contactsMap.has(m.receiver_id)) {
      contactsMap.set(m.receiver_id, m.receiver)
    }
  })

  receivedMessages?.forEach((m) => {
    if (m.sender_id && m.sender && !contactsMap.has(m.sender_id)) {
      contactsMap.set(m.sender_id, m.sender)
    }
  })

  // If "to" param provided, ensure that contact is in the list
  if (params.to && !contactsMap.has(params.to)) {
    const { data: newContact } = await supabase.from("profiles").select("*").eq("id", params.to).single()
    if (newContact) {
      contactsMap.set(params.to, newContact)
    }
  }

  const contacts = Array.from(contactsMap.values())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Chat with alumni and students</p>
      </div>

      <MessagingInterface currentUserId={user.id} contacts={contacts} initialContactId={params.to} />
    </div>
  )
}
