"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2, CheckCircle, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { MentorshipRequest } from "@/lib/types"

interface RequestMentorshipButtonProps {
  alumniId: string
  studentId: string
  existingRequest: MentorshipRequest | null
}

export function RequestMentorshipButton({ alumniId, studentId, existingRequest }: RequestMentorshipButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [request, setRequest] = useState<MentorshipRequest | null>(existingRequest)

  const handleSubmit = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("mentorship_requests")
      .insert({
        student_id: studentId,
        alumni_id: alumniId,
        message: message,
        status: "pending",
      })
      .select()
      .single()

    if (!error && data) {
      setRequest(data)
      setOpen(false)
    }

    setIsLoading(false)
  }

  if (request) {
    return (
      <Button className="w-full bg-transparent" variant="outline" disabled>
        {request.status === "pending" && (
          <>
            <Clock className="mr-2 h-4 w-4" />
            Request Pending
          </>
        )}
        {request.status === "accepted" && (
          <>
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Mentorship Active
          </>
        )}
        {request.status === "rejected" && "Request Declined"}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-transparent" variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Request Mentorship
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Mentorship</DialogTitle>
          <DialogDescription>
            Send a mentorship request. Include a brief message about your goals and what you hope to learn.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Hi! I'm interested in learning more about..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !message.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
