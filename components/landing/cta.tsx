"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export function CTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      return () => container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div
          ref={containerRef}
          className="stagger-item relative mx-auto max-w-4xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-16 overflow-hidden group"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(1 0 0 / 0.1), transparent 40%)`,
            }}
          />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 border border-primary-foreground/10 rounded-full spin-slow" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 border border-primary-foreground/10 rounded-full spin-slow-reverse" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 border border-primary-foreground/5 rounded-full float-animation" />
          </div>

          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Connect with Your Future?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
              Join thousands of students and alumni already building meaningful professional relationships. Your next
              opportunity is just a connection away.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild className="magnetic-hover group/btn">
                <Link href="/auth/select-role">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="magnetic-hover border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/auth/login">I Already Have an Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
