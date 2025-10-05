import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Heart, Bell, Users, Smartphone, Shield } from 'lucide-react'

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
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#impact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Impact
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
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
                <Button size="lg" className="text-base">
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline" className="text-base bg-transparent">
                  Learn More
                </Button>
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
                <img
                  src="/african-farmer-with-cattle-in-rwanda-countryside.jpg"
                  alt="Farmer with livestock"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  {/* <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div> */}
                  {/* <div>
                    <div className="font-semibold">Next Appointment</div>
                    <div className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-balance">
              Everything you need for livestock health management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Comprehensive tools designed specifically for Rwanda's smallholder farmers and veterinarians
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Appointment Booking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Book veterinary appointments instantly through web or SMS. Find available vets near you with real-time
                  scheduling.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Predictive Health Alerts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive automated vaccination reminders and seasonal disease warnings based on your livestock
                  profiles.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Digital Health Records</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Maintain comprehensive health histories for each animal with secure cloud storage and easy access.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Community Network</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with experienced farmers and certified veterinarians for advice and peer consultation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">SMS Integration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Full functionality via SMS for basic phones. No smartphone required to access veterinary services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Emergency Priority</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Flag urgent cases for immediate attention with automatic escalation to available veterinarians.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-balance">Simple steps to better livestock care</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Get started in minutes and transform how you manage your livestock health
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  1
                </div>
                <h3 className="text-2xl font-semibold">Register Your Livestock</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create profiles for your animals with basic information. Access via web or SMS using any mobile phone.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  2
                </div>
                <h3 className="text-2xl font-semibold">Book Appointments</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find and connect with certified veterinarians in your district. Schedule appointments that work for
                  you.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  3
                </div>
                <h3 className="text-2xl font-semibold">Receive Health Alerts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get timely reminders for vaccinations and warnings about seasonal diseases affecting your area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold text-balance">
                Making a real difference for Rwanda's farmers
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                VetConnect Rwanda addresses critical gaps in veterinary service delivery, supporting Rwanda's Vision
                2050 and improving livestock productivity across the country.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Reduced Livestock Mortality</h4>
                    <p className="text-muted-foreground text-sm">
                      Target 25% decrease in preventable livestock deaths through timely veterinary intervention
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Improved Service Access</h4>
                    <p className="text-muted-foreground text-sm">
                      40% reduction in appointment booking time for rural farmers across 30 districts
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Better Vaccination Coverage</h4>
                    <p className="text-muted-foreground text-sm">
                      35% improvement in vaccination schedule adherence through automated reminders
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <img
                  src="/rwandan-veterinarian-examining-cattle-in-rural-set.jpg"
                  alt="Veterinarian with livestock"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-balance">
              Ready to transform your livestock management?
            </h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Join farmers and veterinarians across Rwanda who are already using VetConnect to improve livestock health
              outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-base">
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">VetConnect Rwanda</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart veterinary appointment booking for Rwanda's livestock sector
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    SMS Access
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    User Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Research
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2025 VetConnect Rwanda. Supporting Rwanda's Vision 2050 through digital livestock health
              management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}