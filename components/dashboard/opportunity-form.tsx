"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Loader2, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SKILLS, EXPERIENCE_LEVELS } from "@/lib/constants"
import type { Opportunity } from "@/lib/types"

interface OpportunityFormProps {
  userId: string
  opportunity?: Opportunity
}

export function OpportunityForm({ userId, opportunity }: OpportunityFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: opportunity?.title || "",
    description: opportunity?.description || "",
    company: opportunity?.company || "",
    location: opportunity?.location || "",
    type: opportunity?.type || "job",
    experience_level: opportunity?.experience_level || "any",
    skills_required: opportunity?.skills_required || [],
    salary_range: opportunity?.salary_range || "",
    application_url: opportunity?.application_url || "",
    deadline: opportunity?.deadline ? new Date(opportunity.deadline).toISOString().split("T")[0] : "",
    is_active: opportunity?.is_active ?? true,
  })
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skills_required.includes(skill)) {
      setFormData({ ...formData, skills_required: [...formData.skills_required, skill] })
    }
    setNewSkill("")
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills_required: formData.skills_required.filter((s) => s !== skill) })
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const supabase = createClient()

  const opportunityData = {
    created_by: userId, // ✅ FIXED
    title: formData.title,
    description: formData.description,
    company: formData.company,
    location: formData.location || null,
    type: formData.type as "job" | "internship",
    experience_level: formData.experience_level as "entry" | "mid" | "senior" | "any",

    // ✅ FIXED FIELD NAME
    skills: formData.skills_required,

    salary_range: formData.salary_range || null,
    application_url: formData.application_url || null,

    // ✅ FIXED FIELD NAME + FORMAT
    application_deadline: formData.deadline || null,

    is_active: formData.is_active,
    updated_at: new Date().toISOString(),
  }

  console.log("SENDING DATA:", opportunityData) // 🔥 debug

  let error

  if (opportunity) {
    const res = await supabase
      .from("opportunities")
      .update(opportunityData)
      .eq("id", opportunity.id)

    error = res.error
  } else {
    const res = await supabase
      .from("opportunities")
      .insert(opportunityData)

    error = res.error
  }

  if (error) {
    console.error("INSERT ERROR:", error)
    setIsLoading(false)
    return
  }

  setIsLoading(false)
  router.push("/dashboard/opportunities")
  router.refresh()
}

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Describe the opportunity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g., Software Engineer Intern"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="e.g., Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as "job" | "internship" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Full-time Job</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select
                value={formData.experience_level}
                
onValueChange={(value) =>
  setFormData({
    ...formData,
    experience_level: value as "entry" | "mid" | "senior" | "any",
  })
}              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range (Optional)</Label>
              <Input
                id="salary_range"
                placeholder="e.g., $80,000 - $120,000"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Skills</CardTitle>
          <CardDescription>Skills candidates should have</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.skills_required.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={newSkill} onValueChange={handleAddSkill}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {SKILLS.filter((s) => !formData.skills_required.includes(s)).map((skill) => (
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
          <CardTitle>Application Details</CardTitle>
          <CardDescription>How should candidates apply?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="application_url">Application URL (Optional)</Label>
              <Input
                id="application_url"
                type="url"
                placeholder="https://careers.example.com/apply"
                value={formData.application_url}
                onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active Listing</Label>
              <p className="text-sm text-muted-foreground">Make this opportunity visible to students</p>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {opportunity ? "Updating..." : "Posting..."}
            </>
          ) : opportunity ? (
            "Update Opportunity"
          ) : (
            "Post Opportunity"
          )}
        </Button>
      </div>
    </form>
  )
}
