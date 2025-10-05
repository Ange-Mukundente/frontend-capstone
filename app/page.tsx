import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, Bell, Users, Smartphone, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">VetConnect Rwanda</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#impact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Impact</a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Transforming Livestock Healthcare in Rwanda
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
                Smart veterinary care for your livestock
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty">
                Connect with certified veterinarians, manage livestock health records, and receive predictive health
                alerts. Accessible via web and SMS for farmers across Rwanda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-base">Book Appointment</Button>
                <Button size="lg" variant="outline" className="text-base bg-transparent">Learn More</Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">45+</div>
                  <div className="text-sm text-muted-foreground">Licensed Vets</div>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div>
                  <div className="text-3xl font-bold text-primary">30</div>
                  <div className="text-sm text-muted-foreground">Districts Covered</div>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">SMS Access</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="/african-farmer-with-cattle-in-rwanda-countryside.jpg"
                  alt="Farmer with livestock"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section Image Fix */}
      <section id="impact" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold text-balance">
                Making a real difference for Rwanda&apos;s farmers
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                VetConnect Rwanda addresses critical gaps in veterinary service delivery, supporting Rwanda&apos;s Vision
                2050 and improving livestock productivity across the country.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="/rwandan-veterinarian-examining-cattle-in-rural-set.jpg"
                  alt="Veterinarian with livestock"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Fix */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              &copy; 2025 VetConnect Rwanda. Supporting Rwanda&apos;s Vision 2050 through digital livestock health
              management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
