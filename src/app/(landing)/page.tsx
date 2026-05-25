"use client"

import Link from "next/link"
import {
  ArrowRight,
  Award,
  CheckCircle,
  CreditCard,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const features = [
  {
    title: "Smart Card Management",
    description:
      "Issue digital reward cards with QR codes, manage customer accounts, and track all transactions in real-time.",
    icon: CreditCard,
  },
  {
    title: "Secure & Compliant",
    description:
      "Bank-level security with role-based access control, encrypted data, and comprehensive audit trails.",
    icon: Shield,
  },
  {
    title: "Instant Processing",
    description:
      "Real-time card recharges, instant point updates, and immediate transaction processing.",
    icon: Zap,
  },
  {
    title: "Multi-Role Access",
    description:
      "Separate dashboards for administrators, shop owners, and customers with appropriate permissions.",
    icon: Users,
  },
  {
    title: "ERP Integration",
    description:
      "Complete ERP billing system with detailed reports, analytics, and business intelligence.",
    icon: TrendingUp,
  },
  {
    title: "Reward Points",
    description:
      "Flexible point system with customizable rewards, redemption options, and customer engagement tools.",
    icon: Award,
  },
]

const benefits = [
  "Digital card issuance with QR codes",
  "Real-time transaction processing",
  "Comprehensive reporting and analytics",
  "Multi-store management",
  "Customer self-service portal",
  "Secure payment integration",
]

export default function HomePage() {
  return (
    <div className=" bg-background min-h-screen">
      {/* Header */}
      {/* Header */}

      {/* Hero Section */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
              Modern Digital Loyalty Platform
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Digital Loyalty &
              <span className="block text-primary">
                Reward System
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Empower your business with a complete loyalty ecosystem.
              Manage customers, track rewards, and grow engagement with ease.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/sign-in">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Why Choose Kisna Reward System?
            </h2>

            <p className="mt-4 text-lg text-muted-foreground">
              Built for modern businesses with scalable and secure features.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <Card
                  key={feature.title}
                  className="transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-muted">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="space-y-1">
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y bg-muted/30 py-24">
        <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Everything You Need to Succeed
            </h2>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our platform gives businesses all the tools required to create,
              manage, and scale customer loyalty programs effectively.
            </p>

            <div className="mt-10 space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-primary" />

                  <span className="text-muted-foreground">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <Card className="mx-auto w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                Ready to Get Started?
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="mb-6 text-muted-foreground">
                Join businesses already using our platform to improve customer
                engagement and retention.
              </p>

              <Link href="/auth/sign-in">
                <Button size="lg" className="w-full gap-2">
                  Sign In to Your Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account? Contact your administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            {/* Brand Section */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-muted">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-sm font-semibold leading-none text-foreground">
                  Kisna Reward Card System
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Empowering businesses with digital loyalty solutions
                </p>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-center text-sm text-muted-foreground md:text-right">
              © 2026 Kisna Reward Card System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}