import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SavedAlumniList } from "@/components/dashboard/saved-alumni-list"

export default async function SavedAlumniPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // 🔹 STEP 1: Get saved alumni IDs
  const { data: saved, error: savedError } = await supabase
    .from("saved_alumni")
    .select("alumni_id")
    .eq("student_id", user.id)

  if (savedError) {
    console.error("Saved fetch error:", savedError)
  }

  console.log("SAVED IDS:", saved)

  const ids = saved?.map((s) => s.alumni_id) || []

  let alumni: any[] = []

  // 🔹 STEP 2: Fetch profiles ONE BY ONE (this avoids RLS/join issues completely)
  if (ids.length > 0) {
    const results = await Promise.all(
      ids.map(async (id) => {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            *,
            alumni_profiles (*)
          `)
          .eq("id", id)
          .single()

        if (error) {
          console.error("Profile fetch error for:", id, error)
          return null
        }

        return data
      })
    )

    alumni = results.filter((a) => a !== null)
  }

  console.log("FINAL ALUMNI:", alumni)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Alumni</h1>
        <p className="text-muted-foreground">
          Alumni you have bookmarked for later
        </p>
      </div>

      <SavedAlumniList alumni={alumni} currentUserId={user.id} />
    </div>
  )
}