"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2 group w-fit">
              <GraduationCap className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                AlumniConnect
              </span>
            </Link>
            <p className="max-w-sm text-muted-foreground">
              Bridging the gap between students and alumni for mentorship, career guidance, and professional networking.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Features", "How it Works", "Testimonials"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-foreground transition-colors underline-animation"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { label: "Log in", href: "/auth/login" },
                { label: "Sign up", href: "/auth/sign-up" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-foreground transition-colors underline-animation">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AlumniConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
