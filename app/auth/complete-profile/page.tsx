"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CompleteProfilePage() {

  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [batch, setBatch] = useState("")

  const handleSubmit = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      roll_number: rollNumber,
      batch: batch,
      role: "student",
      is_verified: true,
    })

    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">

      <h1 className="text-2xl font-bold">Complete Your Profile</h1>

      <Input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <Input
        placeholder="Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
      />

      <Input
        placeholder="Batch (e.g. 2022)"
        value={batch}
        onChange={(e) => setBatch(e.target.value)}
      />

      <Button onClick={handleSubmit}>
        Save & Continue
      </Button>

    </div>
  )
}