"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Loader2, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Profile, AlumniProfile } from "@/lib/types"
import { BRANCHES, SKILLS, GRADUATION_YEARS } from "@/lib/constants"
import { useRouter } from "next/navigation"

interface AlumniProfileFormProps {
  profile: Profile
  alumniProfile: AlumniProfile | null
}



export function AlumniProfileForm({ profile, alumniProfile }: AlumniProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    avatar_url: profile.avatar_url || "",
    graduation_year: alumniProfile?.graduation_year?.toString() || "",
    branch: alumniProfile?.branch || "",
    company: alumniProfile?.company || "",
    job_title: alumniProfile?.job_title || "",
    experience_years: alumniProfile?.experience_years?.toString() || "",
    skills: alumniProfile?.skills || [],
    expertise_areas: alumniProfile?.expertise_areas || [],
    bio: alumniProfile?.bio || "",
    linkedin_url: alumniProfile?.linkedin_url || "",
    github_url: alumniProfile?.github_url || "",
    is_mentor_available: alumniProfile?.is_mentor_available || false,
    mentorship_areas: alumniProfile?.mentorship_areas || [],
    max_mentees: alumniProfile?.max_mentees?.toString() || "3",
  })

  
  const [newSkill, setNewSkill] = useState("")
  const [newExpertise, setNewExpertise] = useState("")
  const [newMentorshipArea, setNewMentorshipArea] = useState("")

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
    setNewSkill("")
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) })
  }

  const handleAddExpertise = (area: string) => {
    if (area && !formData.expertise_areas.includes(area)) {
      setFormData({ ...formData, expertise_areas: [...formData.expertise_areas, area] })
    }
    setNewExpertise("")
  }

  const handleRemoveExpertise = (area: string) => {
    setFormData({ ...formData, expertise_areas: formData.expertise_areas.filter((a) => a !== area) })
  }

  const handleAddMentorshipArea = (area: string) => {
    if (area && !formData.mentorship_areas.includes(area)) {
      setFormData({ ...formData, mentorship_areas: [...formData.mentorship_areas, area] })
    }
    setNewMentorshipArea("")
  }

  const handleRemoveMentorshipArea = (area: string) => {
    setFormData({ ...formData, mentorship_areas: formData.mentorship_areas.filter((a) => a !== area) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    // Update main profile
    // await supabase
    //   .from("profiles")
    //   .update({
    //     full_name: formData.full_name,
    //     avatar_url: formData.avatar_url,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq("id", profile.id)

    // Update or create alumni profile
    const alumniData = {
      user_id: profile.id,
      graduation_year: formData.graduation_year ? Number.parseInt(formData.graduation_year) : null,
      branch: formData.branch || null,
      company: formData.company || null,
      job_title: formData.job_title || null,
      experience_years: formData.experience_years ? Number.parseInt(formData.experience_years) : null,
      skills: formData.skills,
      expertise_areas: formData.expertise_areas,
      bio: formData.bio || null,
      linkedin_url: formData.linkedin_url || null,
      github_url: formData.github_url || null,
      is_mentor_available: formData.is_mentor_available,
      mentorship_areas: formData.mentorship_areas,
      max_mentees: Number.parseInt(formData.max_mentees) || 3,
      updated_at: new Date().toISOString(),
    }

    // 1. Update profile
const { error: profileError } = await supabase
  .from("profiles")
  .update({
    full_name: formData.full_name,
    avatar_url: formData.avatar_url,
  })
  .eq("id", profile.id)

if (profileError) {
  console.error("PROFILE UPDATE ERROR:", profileError)
  // toast.error("Failed to update profile")
  // setLoading(false)
  return
}


// 2. UPSERT alumni profile (IMPORTANT FIX)
const { error: alumniError } = await supabase
  .from("alumni_profiles")
  .upsert(alumniData, { onConflict: "user_id" })

if (alumniError) {
  console.error("ALUMNI UPSERT ERROR:", alumniError)
  // toast.error("Failed to save alumni profile")
  // setLoading(false)
  return
}
    

    setIsLoading(false)
    router.refresh()
  }

  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your public profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">{formData.full_name?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch / Department</Label>
              <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="graduation_year">Graduation Year</Label>
            <Select
              value={formData.graduation_year}
              onValueChange={(value) => setFormData({ ...formData, graduation_year: value })}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {GRADUATION_YEARS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself and your career journey..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>Your current professional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="e.g., Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                placeholder="e.g., Senior Software Engineer"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience_years">Years of Experience</Label>
            <Input
              id="experience_years"
              type="number"
              placeholder="e.g., 5"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              className="w-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Add your technical and soft skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={newSkill} onValueChange={handleAddSkill}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select or add a skill" />
              </SelectTrigger>
              <SelectContent>
                {SKILLS.filter((s) => !formData.skills.includes(s)).map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Areas of Expertise</CardTitle>
          <CardDescription>What topics can you advise on?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.expertise_areas.map((area) => (
              <Badge key={area} variant="outline" className="gap-1">
                {area}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveExpertise(area)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add expertise area (e.g., System Design)"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddExpertise(newExpertise)
                }
              }}
            />
            <Button type="button" variant="outline" onClick={() => handleAddExpertise(newExpertise)}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentorship</CardTitle>
          <CardDescription>Configure your mentorship availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Available for Mentorship</Label>
              <p className="text-sm text-muted-foreground">Allow students to request mentorship from you</p>
            </div>
            <Switch
              checked={formData.is_mentor_available}
              onCheckedChange={(checked) => setFormData({ ...formData, is_mentor_available: checked })}
            />
          </div>

          {formData.is_mentor_available && (
            <>
              <div className="space-y-2">
                <Label htmlFor="max_mentees">Maximum Mentees</Label>
                <Input
                  id="max_mentees"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.max_mentees}
                  onChange={(e) => setFormData({ ...formData, max_mentees: e.target.value })}
                  className="w-[200px]"
                />
              </div>

              <div className="space-y-4">
                <Label>Mentorship Areas</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.mentorship_areas.map((area) => (
                    <Badge key={area} variant="secondary" className="gap-1">
                      {area}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveMentorshipArea(area)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add mentorship area (e.g., Career Guidance)"
                    value={newMentorshipArea}
                    onChange={(e) => setNewMentorshipArea(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddMentorshipArea(newMentorshipArea)
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => handleAddMentorshipArea(newMentorshipArea)}>
                    Add
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
          <CardDescription>Add your professional profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                placeholder="https://github.com/username"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
