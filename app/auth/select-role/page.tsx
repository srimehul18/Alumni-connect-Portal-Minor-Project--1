"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Shield } from "lucide-react"

export default function SelectRolePage() {
  const router = useRouter()

  const selectRole = (role: string) => {
  document.cookie = `selectedRole=${role}; path=/; SameSite=Lax`
  router.push("/auth/login")
}

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to AlumniConnect</h1>
        <p className="text-muted-foreground mt-2">
          Please select how you want to continue
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-sm">

        <Button
          className="flex items-center gap-3 h-14"
          onClick={() => selectRole("student")}
        >
          <GraduationCap className="h-5 w-5" />
          I am a Student
        </Button>

        <Button
          className="flex items-center gap-3 h-14"
          variant="outline"
          onClick={() => selectRole("alumni")}
        >
          <Users className="h-5 w-5" />
          I am an Alumni
        </Button>

        <Button
          className="flex items-center gap-3 h-14"
          variant="secondary"
          onClick={() => selectRole("admin")}
        >
          <Shield className="h-5 w-5" />
          I am an Admin
        </Button>

      </div>
    </div>
  )
}
