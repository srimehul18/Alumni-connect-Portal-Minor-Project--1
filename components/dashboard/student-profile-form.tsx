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
import { Loader2, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Profile, StudentProfile } from "@/lib/types"
import { BRANCHES, SKILLS, CURRENT_YEAR } from "@/lib/constants"
import { useRouter } from "next/navigation"

interface StudentProfileFormProps {
  profile: Profile
  studentProfile: StudentProfile | null
}

export function StudentProfileForm({ profile, studentProfile }: StudentProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    avatar_url: profile.avatar_url || "",
    enrollment_year: studentProfile?.enrollment_year?.toString() || "",
    expected_graduation: studentProfile?.expected_graduation?.toString() || "",
    branch: studentProfile?.branch || "",
    skills: studentProfile?.skills || [],
    interests: studentProfile?.interests || [],
    bio: studentProfile?.bio || "",
    linkedin_url: studentProfile?.linkedin_url || "",
    github_url: studentProfile?.github_url || "",
    resume_url: studentProfile?.resume_url || "",
  })
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
    setNewSkill("")
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) })
  }

  const handleAddInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: [...formData.interests, interest] })
    }
    setNewInterest("")
  }

  const handleRemoveInterest = (interest: string) => {
    setFormData({ ...formData, interests: formData.interests.filter((i) => i !== interest) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    // Update main profile
    await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    // Update or create student profile
    const studentData = {
      user_id: profile.id,
      enrollment_year: formData.enrollment_year ? Number.parseInt(formData.enrollment_year) : null,
      expected_graduation: formData.expected_graduation ? Number.parseInt(formData.expected_graduation) : null,
      branch: formData.branch || null,
      skills: formData.skills,
      interests: formData.interests,
      bio: formData.bio || null,
      linkedin_url: formData.linkedin_url || null,
      github_url: formData.github_url || null,
      resume_url: formData.resume_url || null,
      updated_at: new Date().toISOString(),
    }

    if (studentProfile) {
      await supabase.from("student_profiles").update(studentData).eq("id", studentProfile.id)
    } else {
      await supabase.from("student_profiles").insert(studentData)
    }

    setIsLoading(false)
    router.refresh()
  }

  const enrollmentYears = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i)
  const graduationYears = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR + i)

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
              <AvatarFallback className="text-2xl">{formData.full_name?.charAt(0) || "S"}</AvatarFallback>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="enrollment_year">Enrollment Year</Label>
              <Select
                value={formData.enrollment_year}
                onValueChange={(value) => setFormData({ ...formData, enrollment_year: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {enrollmentYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_graduation">Expected Graduation</Label>
              <Select
                value={formData.expected_graduation}
                onValueChange={(value) => setFormData({ ...formData, expected_graduation: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {graduationYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
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
          <CardTitle>Interests</CardTitle>
          <CardDescription>What are you interested in learning?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest) => (
              <Badge key={interest} variant="outline" className="gap-1">
                {interest}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveInterest(interest)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add an interest (e.g., Machine Learning)"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddInterest(newInterest)
                }
              }}
            />
            <Button type="button" variant="outline" onClick={() => handleAddInterest(newInterest)}>
              Add
            </Button>
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="resume_url">Resume URL</Label>
            <Input
              id="resume_url"
              placeholder="https://example.com/resume.pdf"
              value={formData.resume_url}
              onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
            />
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
