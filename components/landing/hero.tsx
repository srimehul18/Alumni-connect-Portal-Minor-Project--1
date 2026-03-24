"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Briefcase, MessageSquare, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return position
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useMousePosition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getSpotlightStyle = () => {
    if (!containerRef.current || !mounted) return {}
    const rect = containerRef.current.getBoundingClientRect()
    const x = mouse.x - rect.left
    const y = mouse.y - rect.top
    return {
      background: `radial-gradient(600px circle at ${x}px ${y}px, oklch(0.55 0.22 255 / 0.08), transparent 40%)`,
    }
  }

  return (
    <section ref={containerRef} className="relative overflow-hidden py-20 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={getSpotlightStyle()}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl float-animation" />
        <div
          className="absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl float-animation"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-primary/5 blur-3xl float-animation"
          style={{ animationDelay: "-1.5s" }}
        />
        <div
          className="absolute top-1/4 left-1/4 h-4 w-4 rounded-full bg-primary/30 float-animation"
          style={{ animationDelay: "-2s" }}
        />
        <div
          className="absolute top-3/4 right-1/4 h-3 w-3 rounded-full bg-primary/20 float-animation"
          style={{ animationDelay: "-4s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 h-2 w-2 rounded-full bg-primary/40 float-animation"
          style={{ animationDelay: "-1s" }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="stagger-item mb-6 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm font-medium shine-hover elastic-hover cursor-default">
            <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse multi-pulse-ring" />
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Trusted by 10,000+ students and alumni
          </div>

          <h1 className="stagger-item mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Connect, Learn, and{" "}
            <span className="text-gradient-animated neon-glow-hover transition-all duration-300">Grow Together</span>
          </h1>

          <p className="stagger-item mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Bridge the gap between students and alumni. Get mentorship, discover career opportunities, and build
            meaningful professional relationships that last a lifetime.
          </p>

          <div className="stagger-item flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="magnetic-hover glow-pulse ripple-hover w-full sm:w-auto group">
              <Link href="/auth/select-role">Sign Up
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="elastic-hover border-draw w-full sm:w-auto bg-transparent"
            >
              <Link href="#how-it-works">See How it Works</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: Users, value: "5,000+", label: "Active Alumni", color: "from-blue-500 to-cyan-500" },
            { icon: Briefcase, value: "1,200+", label: "Job Opportunities", color: "from-purple-500 to-pink-500" },
            {
              icon: MessageSquare,
              value: "3,500+",
              label: "Mentorship Connections",
              color: "from-orange-500 to-red-500",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="stagger-item group flex flex-col items-center rounded-xl border bg-card p-6 text-center lift-hover shine-hover cursor-default rainbow-border"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="relative">
                <stat.icon className="mb-3 h-10 w-10 text-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
                <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <div className="text-3xl font-bold transition-all duration-300 group-hover:text-primary group-hover:scale-110">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
