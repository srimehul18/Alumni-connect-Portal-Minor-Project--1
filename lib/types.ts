export type UserRole = "student" | "alumni" | "admin"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface StudentProfile {
  id: string
  user_id: string
  enrollment_year: number | null
  expected_graduation: number | null
  branch: string | null
  skills: string[]
  interests: string[]
  bio: string | null
  linkedin_url: string | null
  github_url: string | null
  resume_url: string | null
  created_at: string
  updated_at: string
}

export interface AlumniProfile {
  id: string
  user_id: string
  graduation_year: number | null
  branch: string | null
  company: string | null
  job_title: string | null
  experience_years: number | null
  skills: string[]
  expertise_areas: string[]
  bio: string | null
  linkedin_url: string | null
  github_url: string | null
  is_mentor_available: boolean
  mentorship_areas: string[]
  max_mentees: number
  created_at: string
  updated_at: string
}

export interface MentorshipRequest {
  id: string
  student_id: string
  alumni_id: string
  message: string | null
  status: "pending" | "accepted" | "rejected"
  created_at: string
  updated_at: string
  student?: Profile
  alumni?: Profile
}

export interface Opportunity {
  id: string
  posted_by: string
  title: string
  description: string
  company: string
  location: string | null
  type: "job" | "internship"
  experience_level: "entry" | "mid" | "senior" | "any" | null
  skills_required: string[]
  salary_range: string | null
  application_url: string | null
  deadline: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  poster?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "mentorship" | "opportunity" | "system" | "message"
  is_read: boolean
  link: string | null
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: Profile
  receiver?: Profile
}

export interface AlumniWithProfile extends Profile {
  alumni_profiles: AlumniProfile[]
}

export interface StudentWithProfile extends Profile {
  student_profiles: StudentProfile[]
}
