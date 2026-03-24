"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap, Menu, X, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-border/50"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group jelly-hover">
          <div className="relative">
            <GraduationCap className="h-8 w-8 text-primary transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125" />
          </div>
          <span className="text-xl font-bold transition-all duration-300 group-hover:text-primary group-hover:tracking-wide">
            AlumniConnect
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {["Features", "How it Works", "Testimonials"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 underline-center relative py-1"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <Button variant="ghost" asChild className="elastic-hover relative overflow-hidden group">
            <Link href="/auth/login">
              <span className="relative z-10">Log in</span>
              <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </Link>
          </Button>
          <Button asChild className="magnetic-hover glow-pulse ripple-hover">
            <Link href="/auth/select-role">Get Started</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative elastic-hover"
          >
            <Menu
              className={cn(
                "h-5 w-5 absolute transition-all duration-500",
                isMenuOpen ? "rotate-180 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100",
              )}
            />
            <X
              className={cn(
                "h-5 w-5 absolute transition-all duration-500",
                isMenuOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-180 opacity-0 scale-50",
              )}
            />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t md:hidden overflow-hidden transition-all duration-500 ease-out",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
          {["Features", "How it Works", "Testimonials"].map((item, index) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "text-sm font-medium py-2 px-3 rounded-lg hover:bg-muted transition-all duration-300",
                isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
              )}
              style={{ transitionDelay: isMenuOpen ? `${index * 100}ms` : "0ms" }}
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button variant="ghost" asChild className="justify-start">
              <Link href="/auth/select-role">Login</Link>
            </Button>
            <Button asChild className="glow-pulse">
              <Link href="/auth/select-role">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
