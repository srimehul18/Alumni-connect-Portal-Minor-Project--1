"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageSquare, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Profile, Message } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface MessagingInterfaceProps {
  currentUserId: string
  contacts: Profile[]
  initialContactId?: string
}

export function MessagingInterface({ currentUserId, contacts, initialContactId }: MessagingInterfaceProps) {
  const [selectedContact, setSelectedContact] = useState<Profile | null>(
    contacts.find((c) => c.id === initialContactId) || null,
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

useEffect(() => {
  if (!selectedContact) return

  loadMessages(selectedContact.id)

  const supabase = createClient()

  const channel = supabase
    .channel("messages-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        const newMsg = payload.new as Message

        // Only add if it belongs to current chat
        if (
          (newMsg.sender_id === currentUserId && newMsg.receiver_id === selectedContact.id) ||
          (newMsg.sender_id === selectedContact.id && newMsg.receiver_id === currentUserId)
        ) {
          setMessages((prev) => [...prev, newMsg])
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [selectedContact])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async (contactId: string) => {
    setIsLoading(true)
    const supabase = createClient()

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${currentUserId})`,
      )
      .order("created_at", { ascending: true })

    setMessages(data || [])

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", contactId)
      .eq("receiver_id", currentUserId)

    setIsLoading(false)
  }

const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!newMessage.trim() || !selectedContact) return

  setIsSending(true)
  const supabase = createClient()

  const { error } = await supabase
    .from("messages")
    .insert({
      sender_id: currentUserId,
      receiver_id: selectedContact.id,
      message: newMessage.trim(),
    })

  if (!error) {

  // ✅ ADD THIS NOTIFICATION BLOCK HERE
  await supabase.from("notifications").insert({
    user_id: selectedContact.id,
    title: "New Message",
    message: "You received a new message",
    type: "message",
    link: `/dashboard/messages?to=${currentUserId}`,
  })

  // existing UI update
  setMessages([
    ...messages,
    {
      id: Date.now().toString(),
      sender_id: currentUserId,
      receiver_id: selectedContact.id,
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
    },
  ])

  setNewMessage("")

  } else {
    console.error("SEND ERROR:", error)
  }

  setIsSending(false)
}

  return (
    <div className="grid h-[calc(100vh-220px)] gap-4 lg:grid-cols-3">
      {/* Contacts List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-320px)]">
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted",
                      selectedContact?.id === contact.id && "bg-muted",
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar_url || undefined} />
                      <AvatarFallback>
                        {contact.full_name?.charAt(0) || contact.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{contact.full_name || contact.email}</p>
                      <p className="truncate text-sm text-muted-foreground capitalize">{contact.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex flex-col lg:col-span-2">
        {selectedContact ? (
          <>
            <CardHeader className="border-b pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedContact.avatar_url || undefined} />
                  <AvatarFallback>
                    {selectedContact.full_name?.charAt(0) || selectedContact.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedContact.full_name || selectedContact.email}</CardTitle>
                  <p className="text-sm text-muted-foreground capitalize">{selectedContact.role}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex", message.sender_id === currentUserId ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-4 py-2",
                            message.sender_id === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={cn(
                              "mt-1 text-xs",
                              message.sender_id === currentUserId
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground",
                            )}
                          >
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                  />
                  <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-semibold">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a contact to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
  }