"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { useRef } from "react"

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up as a student or alumni. Complete your profile with your skills, interests, and career goals.",
  },
  {
    step: "02",
    title: "Discover & Connect",
    description: "Browse verified alumni profiles, filter by industry or skills, and send mentorship requests.",
  },
  {
    step: "03",
    title: "Learn & Grow",
    description: "Get career guidance, discover opportunities, and build lasting professional relationships.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl float-animation" />
        <div
          className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 shine-hover">
            How it Works
          </Badge>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Start Your Journey in <span className="text-gradient-animated">3 Simple Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Getting started is easy. Join thousands of students already benefiting from alumni connections.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <StepCard key={step.step} step={step} index={index} totalSteps={steps.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StepCard({
  step,
  index,
  totalSteps,
}: {
  step: (typeof steps)[0]
  index: number
  totalSteps: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty("--mouse-x", `${x}px`)
    cardRef.current.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="stagger-item relative text-center group cursor-default"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30 pulse-ring">
        {step.step}
      </div>

      {/* Connecting line */}
      {index < totalSteps - 1 && (
        <div className="absolute left-[calc(50%+40px)] top-8 hidden h-0.5 w-[calc(100%-80px)] bg-border md:block overflow-hidden">
          <div className="h-full w-0 bg-primary transition-all duration-700 group-hover:w-full" />
        </div>
      )}

      <h3 className="mb-2 text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
        {step.title}
      </h3>
      <p className="text-muted-foreground">{step.description}</p>
    </div>
  )
}
