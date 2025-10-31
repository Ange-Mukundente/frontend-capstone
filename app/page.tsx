import Link from "next/link"
import Image from "next/image"
import { Calendar, Heart, Bell, Smartphone, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">VetConnect Rwanda</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                </span>
                <span className="text-green-800 font-medium">Transforming Livestock Healthcare in Rwanda</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
                Smart veterinary care for your livestock
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed text-pretty">
                Connect with certified veterinarians, manage livestock health records, and receive predictive health
                alerts. Accessible via web and SMS for farmers across Rwanda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="px-6 py-3 text-base font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Book Appointment
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {/* <Link
                  href="#features"
                  className="px-6 py-3 text-base font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                >
                  Learn More
                </Link> */}
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-green-600">45+</div>
                  <div className="text-sm text-gray-600">Licensed Vets</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-3xl font-bold text-green-600">30</div>
                  <div className="text-sm text-gray-600">Districts Covered</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-3xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">SMS Access</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 shadow-2xl">
                <Image
                  src="/african-farmer-with-cattle-in-rwanda-countryside.jpg"
                  alt="Farmer with livestock"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-balance">Core Features for Better Livestock Care</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              Four powerful tools designed specifically for Rwanda&apos;s smallholder farmers and veterinarians
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                title: "Smart Appointment Booking",
                description:
                  "Book veterinary appointments instantly through web or SMS. Find available vets near you with real-time scheduling.",
                color: "bg-green-100 text-green-600",
                href: "/features/appointments",
              },
              {
                icon: Bell,
                title: "Predictive Health Alerts",
                description:
                  "Receive automated vaccination reminders and seasonal disease warnings based on your livestock profiles.",
                color: "bg-yellow-100 text-yellow-600",
                href: "/features/alerts",
              },
              {
                icon: Heart,
                title: "Digital Health Records",
                description:
                  "Maintain comprehensive health histories for each animal with secure cloud storage and easy access.",
                color: "bg-red-100 text-red-600",
                href: "/features/records",
              },
              {
                icon: Smartphone,
                title: "SMS Integration",
                description:
                  "Full functionality via SMS for basic phones. No smartphone required to access veterinary services.",
                color: "bg-purple-100 text-purple-600",
                href: "/features/sms",
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className="group border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div
                    className={`h-14 w-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm mb-4">{feature.description}</p>
                  {/* <div className="flex items-center text-green-600 text-sm font-medium group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div> */}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">Simple steps to better livestock care</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and transform how you manage your livestock health
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Register Your Livestock",
                description:
                  "Create profiles for your animals with basic information. Access via web or SMS using any mobile phone.",
              },
              {
                step: "2",
                title: "Book Appointments",
                description:
                  "Find and connect with certified veterinarians in your district. Schedule appointments that work for you.",
              },
              {
                step: "3",
                title: "Receive Health Alerts",
                description:
                  "Get timely reminders for vaccinations and warnings about seasonal diseases affecting your area.",
              },
            ].map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold">Making a real difference for Rwanda&apos;s farmers</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                VetConnect Rwanda addresses critical gaps in veterinary service delivery, supporting Rwanda&apos;s Vision
                2050 and improving livestock productivity across the country.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "Reduced Livestock Mortality",
                    description:
                      "Target 25% decrease in preventable livestock deaths through timely veterinary intervention",
                  },
                  {
                    title: "Improved Service Access",
                    description: "40% reduction in appointment booking time for rural farmers across 30 districts",
                  },
                  {
                    title: "Better Vaccination Coverage",
                    description: "35% improvement in vaccination schedule adherence through automated reminders",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
                <Image
                  src="/rwandan-veterinarian-examining-cattle-in-rural-set.jpg"
                  alt="Veterinarian with livestock"
                  width={600}
                  height={450}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-green-600 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">Ready to transform your livestock management?</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Join farmers and veterinarians across Rwanda who are already using VetConnect to improve livestock health
              outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-6 py-3 text-base font-medium bg-white text-green-600 rounded-lg hover:bg-gray-100"
              >
                Get Started Free
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 text-base font-medium border-2 border-white text-white rounded-lg hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t mt-12 pt-8 text-center text-sm text-gray-600">
            <p>
              &copy; 2025 VetConnect Rwanda. Supporting Rwanda&apos;s Vision 2050 through digital livestock health
              management.
            </p>
          </div>
    </div>
  )
}