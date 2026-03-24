"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, UserCheck, Briefcase, MessageCircle, Bell, Shield, Sparkles, BarChart3 } from "lucide-react"
import { useRef, useState } from "react"

const features = [
  {
    icon: Search,
    title: "Smart Alumni Discovery",
    description: "Find alumni by branch, company, skills, or graduation year with powerful filters.",
  },
  {
    icon: UserCheck,
    title: "Mentorship Matching",
    description: "AI-powered recommendations to connect you with the perfect mentor for your goals.",
  },
  {
    icon: Briefcase,
    title: "Job & Internship Board",
    description: "Exclusive opportunities posted by verified alumni at top companies.",
  },
  {
    icon: MessageCircle,
    title: "Direct Messaging",
    description: "Connect and communicate directly with alumni mentors in real-time.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Stay updated on new opportunities, messages, and mentorship requests.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "All alumni profiles are verified by admin to ensure authenticity.",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Get personalized alumni suggestions based on your skills and interests.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your networking progress and engagement metrics.",
  },
]

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/50 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh-animated opacity-50" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Everything You Need to <span className="text-gradient-animated neon-glow-hover">Succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features designed to help students connect with alumni and accelerate their careers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <TiltCard key={feature.title}>
              <Card
                className="stagger-item border-0 bg-card shadow-sm h-full shine-hover group cursor-default relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-[-2px] rounded-xl bg-gradient-to-r from-primary via-primary/50 to-primary animate-pulse opacity-20" />
                </div>

                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:rotate-12 group-hover:scale-110 relative overflow-hidden">
                    <feature.icon className="h-6 w-6 text-primary transition-all duration-500 group-hover:text-primary-foreground group-hover:scale-110" />
                    <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
                  </div>
                  <CardTitle className="text-lg transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm transition-opacity duration-300 group-hover:opacity-80">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
