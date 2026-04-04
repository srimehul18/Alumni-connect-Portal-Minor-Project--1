import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  const supabase = await createClient()


  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login`)
  }

 
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single()

 
  if (!existingProfile) {
  const cookieStore = await cookies()
  console.log("ROLE COOKIE:", cookieStore.get("selectedRole"))

  const role = cookieStore.get("selectedRole")?.value || "student"


  await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || "",
    role: role,
    is_verified: role === "student",
  })

  const response = NextResponse.redirect(`${origin}/auth/complete-profile`)

  return response
}


  const forwardedHost = request.headers.get("x-forwarded-host")
  const isLocalEnv = process.env.NODE_ENV === "development"

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}/dashboard`)
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}/dashboard`)
  } else {
    return NextResponse.redirect(`${origin}/dashboard`)
  }
}