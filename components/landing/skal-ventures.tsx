"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Users, TrendingUp, Network, Target, Zap, Sparkles } from "lucide-react"
import Link from "next/link"

export function SkalVentures() {
  const features = [
    {
      icon: Network,
      title: "Network First",
      description: "Connect with industry leaders and experienced mentors in your field",
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description: "Access resources, opportunities, and guidance for career advancement",
    },
    {
      icon: Target,
      title: "Strategic Matching",
      description: "Find the right mentors and peers aligned with your goals",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Part of a thriving ecosystem of alumni and students",
    },
  ]

  const stats = [
    { number: "5000+", label: "Active Members" },
    { number: "500+", label: "Mentorship Connections" },
    { number: "200+", label: "Job Opportunities" },
    { number: "95%", label: "Success Rate" },
  ]

  return (
    <section className="relative py-24 md:py-40 overflow-hidden bg-gradient-to-b from-transparent via-primary/3 to-transparent">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent -z-10" />
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24 stagger-item">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border bg-primary/5 px-4 py-1.5 shine-hover elastic-hover cursor-default">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Powered by Community
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
            The Modern <span className="text-gradient-animated neon-glow-hover">Alumni Network</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
            Building meaningful connections between students and alumni. Access mentorship, 
            opportunities, and a thriving community of professionals dedicated to your success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="font-semibold magnetic-hover glow-pulse ripple-hover group">
              <Link href="/auth/sign-up">
                Join Now <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="font-semibold bg-transparent elastic-hover border-draw">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="stagger-item text-center p-6 md:p-8 rounded-xl border border-border/50 bg-card/30 hover:border-primary/50 hover:bg-primary/8 transition-all duration-300 group lift-hover shine-hover cursor-default rainbow-border"
              style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-animated mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card
                key={idx}
                className="stagger-item p-6 md:p-8 border-0 bg-card/50 hover:shadow-lg hover:bg-card/80 transition-all duration-300 group cursor-pointer relative overflow-hidden shine-hover lift-hover"
                style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-[-2px] rounded-xl bg-gradient-to-r from-primary via-primary/50 to-primary animate-pulse opacity-20" />
                </div>
                <div className="mb-4 relative">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                    <Icon className="h-6 w-6 text-primary transition-all duration-300 group-hover:text-primary-foreground group-hover:scale-110" />
                    <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">{feature.title}</h3>
                <p className="text-muted-foreground transition-opacity duration-300 group-hover:opacity-90">{feature.description}</p>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/8 via-primary/5 to-primary/8 p-12 md:p-16 text-center overflow-hidden group hover:border-primary/50 transition-all duration-300 lift-hover">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition-all duration-300" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 shine-hover">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Ready to Get Started?
              </span>
            </div>
            
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              Transform Your <span className="text-gradient-animated neon-glow-hover">Career Today</span>
            </h3>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 text-pretty">
              Join thousands of students and alumni already benefiting from meaningful connections 
              and career opportunities.
            </p>
            
            <Button size="lg" asChild className="font-semibold magnetic-hover glow-pulse ripple-hover group">
              <Link href="/auth/sign-up">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
