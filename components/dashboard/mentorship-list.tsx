"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, MessageSquare, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import type { UserRole } from "@/lib/types"

interface MentorshipListProps {
  requests: any[]
  userRole: UserRole
}

export function MentorshipList({ requests: initialRequests, userRole }: MentorshipListProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const acceptedRequests = requests.filter((r) => r.status === "accepted")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")

  const handleUpdateStatus = async (requestId: string, status: "accepted" | "rejected") => {
    setLoadingId(requestId)
    const supabase = createClient()

    const { error } = await supabase
      .from("mentorship_requests")
      .update({ status })
      .eq("id", requestId)

    if (error) {
      console.error("UPDATE ERROR:", error)
    } else {
      setRequests(requests.map((r) => (r.id === requestId ? { ...r, status } : r)))
    }

    setLoadingId(null)
  }

  const RequestCard = ({ request }: { request: any }) => {
    const person = userRole === "student" ? request.alumni : request.student
    const personProfile =
      userRole === "student" ? request.alumni?.alumni_profiles?.[0] : request.student?.student_profiles?.[0]

    return (
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={person?.avatar_url || undefined} />
            <AvatarFallback>{person?.full_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{person?.full_name || "User"}</h3>
              <Badge
                variant={
                  request.status === "accepted"
                    ? "default"
                    : request.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {request.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                {request.status === "accepted" && <CheckCircle className="mr-1 h-3 w-3" />}
                {request.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                {request.status}
              </Badge>
            </div>
            {personProfile?.company && (
              <p className="text-sm text-muted-foreground">
                {personProfile.job_title} at {personProfile.company}
              </p>
            )}
            {personProfile?.branch && <p className="text-sm text-muted-foreground">{personProfile.branch}</p>}
          </div>
        </CardHeader>

        {request.message && (
          <CardContent>
            <p className="text-sm text-muted-foreground">{request.message}</p>
          </CardContent>
        )}

        <CardFooter className="flex gap-2">
          {userRole === "alumni" && request.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => handleUpdateStatus(request.id, "accepted")}
                disabled={loadingId === request.id}
              >
                {loadingId === request.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus(request.id, "rejected")}
                disabled={loadingId === request.id}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </>
          )}
          {request.status === "accepted" && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/messages?to=${person?.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No mentorship requests yet</h3>
        <p className="text-muted-foreground">
          {userRole === "student"
            ? "Browse alumni and send mentorship requests"
            : "Students will be able to request mentorship from you"}
        </p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
        <TabsTrigger value="accepted">Accepted ({acceptedRequests.length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="mt-4">
        {pendingRequests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {pendingRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-muted-foreground">No pending requests</p>
        )}
      </TabsContent>

      <TabsContent value="accepted" className="mt-4">
        {acceptedRequests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {acceptedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-muted-foreground">No accepted requests</p>
        )}
      </TabsContent>

      <TabsContent value="rejected" className="mt-4">
        {rejectedRequests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {rejectedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-muted-foreground">No rejected requests</p>
        )}
      </TabsContent>
    </Tabs>
  )
}
