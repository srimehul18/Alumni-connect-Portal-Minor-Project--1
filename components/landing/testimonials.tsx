"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"
import { useRef } from "react"

const testimonials = [
  {
    quote: "AlumniConnect helped me land my dream internship at Google. My mentor's guidance was invaluable!",
    name: "Sarah Chen",
    role: "CS Student, Class of 2025",
    avatar: "/professional-woman-portrait.png",
  },
  {
    quote: "As an alumni, it's rewarding to give back. I've mentored 5 students who are now thriving in their careers.",
    name: "Michael Rodriguez",
    role: "Software Engineer at Meta",
    avatar: "/professional-man-portrait.png",
  },
  {
    quote: "The platform made it so easy to find alumni in my field. Within weeks, I had multiple mentorship sessions.",
    name: "Priya Sharma",
    role: "Data Science Student",
    avatar: "/indian-woman-professional-portrait.png",
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: (typeof testimonials)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="stagger-item transition-all duration-300 ease-out"
      style={{
        transformStyle: "preserve-3d",
        animationDelay: `${index * 0.15}s`,
      }}
    >
      <Card className="border-0 bg-card h-full group shine-hover">
        <CardContent className="pt-6">
          <Quote className="mb-4 h-8 w-8 text-primary/20 transition-all duration-500 group-hover:text-primary/40 group-hover:scale-110 group-hover:rotate-6" />
          <p className="mb-6 text-muted-foreground leading-relaxed">{testimonial.quote}</p>
          <div className="flex items-center gap-3">
            <Avatar className="transition-transform duration-300 group-hover:scale-110 ring-2 ring-transparent group-hover:ring-primary/20">
              <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold transition-colors duration-300 group-hover:text-primary">
                {testimonial.name}
              </div>
              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-muted/50 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh-animated opacity-30" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Loved by <span className="text-gradient-animated">Students & Alumni</span>
          </h2>
          <p className="text-muted-foreground text-lg">See what our community has to say about their experience.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
