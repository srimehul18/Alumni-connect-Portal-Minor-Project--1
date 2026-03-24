export const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Electrical",
  "Mechanical",
  "Civil",
  "Chemical",
  "Biotechnology",
  "Data Science",
  "Artificial Intelligence",
] as const

export const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Machine Learning",
  "Data Analysis",
  "UI/UX Design",
  "Product Management",
] as const

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "any", label: "Any Level" },
] as const

export const CURRENT_YEAR = new Date().getFullYear()

export const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - 20 + i)
