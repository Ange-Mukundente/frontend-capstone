import Link from "next/link"
import { Heart, Target, Users, Award, TrendingUp, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
       {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
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
      </header>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-20 text-center">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">About VetConnect Rwanda</h1>
          <p className="text-lg lg:text-xl text-green-50 leading-relaxed max-w-3xl mx-auto">
            Bridging the gap between farmers and veterinarians to improve livestock health outcomes across Rwanda.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <Target className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            To revolutionize livestock healthcare delivery in Rwanda by providing accessible, efficient, and
            technology-driven veterinary services that empower farmers and support Rwanda&apos;s Vision 2050.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: "Accessibility",
                description: "Making veterinary services accessible to all farmers, regardless of their location.",
              },
              {
                icon: TrendingUp,
                title: "Efficiency",
                description: "Streamlining booking and health record management for better outcomes.",
              },
              {
                icon: Shield,
                title: "Reliability",
                description: "Connecting farmers with certified veterinarians and secure health records.",
              },
            ].map(({ icon: Icon, title, description }, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-100">
                  <Icon className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              VetConnect Rwanda was born from a simple observation: many smallholder farmers across Rwanda struggle to
              access timely veterinary services for their livestock. Long distances and limited communication channels
              made it difficult to connect with qualified veterinarians.
            </p>
            <p>
              In 2024, a team of veterinarians, software developers, and agricultural experts came together to solve this
              challenge. We recognized that while Rwanda has made tremendous progress in digital connectivity, the
              livestock sector hadn&apos;t fully benefited from these advances.
            </p>
            <p>
              VetConnect Rwanda was designed with Rwanda&apos;s unique context in mind — a platform that works both on
              smartphones and basic feature phones through SMS, ensuring every farmer can access services.
            </p>
            <p>
              Today, VetConnect Rwanda connects thousands of farmers with over 45 licensed veterinarians, supporting
              Rwanda&apos;s Vision 2050 by improving livestock productivity and empowering farmers nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "45+", label: "Licensed Veterinarians" },
              { number: "30", label: "Districts Covered" },
              { number: "5,000+", label: "Farmers Served" },
              { number: "24/7", label: "SMS Support" },
            ].map(({ number, label }, i) => (
              <div key={i}>
                <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">{number}</div>
                <div className="text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Heart,
                title: "Farmer-Centric",
                description: "Every decision we make prioritizes Rwanda&apos;s farmers.",
              },
              {
                icon: Award,
                title: "Quality Care",
                description: "We partner only with certified veterinarians committed to excellence.",
              },
              {
                icon: Users,
                title: "Community",
                description: "Building a supportive network for farmers and vets to grow together.",
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description: "Continuously improving our platform to better serve the livestock sector.",
              },
            ].map(({ icon: Icon, title, description }, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white text-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold">Join Us in Transforming Livestock Healthcare</h2>
          <p className="text-lg text-green-50">
            Whether you&apos;re a farmer seeking veterinary services or a veterinarian wanting to expand your reach,
            VetConnect Rwanda is here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
             href="/auth/register"
              className="px-6 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} VetConnect Rwanda. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
