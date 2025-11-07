"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

import { Card } from "@/components/ui/card"

import SellerForm from "./seller-form"
import Link from "next/link"

export default function SellerOnboarding() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Welcome!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for joining our community of African artisans and creatives. We're excited to showcase your work!
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            We'll review your application and send you an email with next steps.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Submit Another Application
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Sell Your Craft</h1>
          <p className="text-muted-foreground mt-2">Join thousands of African creatives</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Benefits Section */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">Why Join Us?</h3>
              <div className="space-y-4">
                <BenefitCard
                  icon="🎨"
                  title="Showcase Your Work"
                  description="Beautiful storefront to display all your creations"
                />
                <BenefitCard icon="🌍" title="Global Reach" description="Connect with customers worldwide" />
                <BenefitCard
                  icon="💰"
                  title="Fair Pricing"
                  description="Competitive commission rates and fast payouts"
                />
                <BenefitCard icon="🤝" title="Support" description="Dedicated seller support and community" />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <SellerForm onSubmit={() => setSubmitted(true)} />
            </Card>
          </div>
        </div>

        {/* Featured Creatives Section */}
        <div className="py-12 border-t border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-8 text-center">Featured Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Painter", image: "/images/craft 1.jpg" },
              { name: "Sculptor", image: "/images/craft 2.jpg" },
              { name: "Furniture Maker", image: "/images/home 14.jpg" },
              { name: "Bead Maker", image: "/images/fashion 11.jpg" },
            ].map((craft) => (
              <div
                key={craft.name}
                className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 overflow-hidden">
                  <img
                    src={craft.image}
                    alt={craft.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{craft.name}</h3>
                  <p className="text-sm text-muted-foreground">Featured craft category</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

