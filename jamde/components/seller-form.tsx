"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export default function SellerForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Join Our Waitlist</h2>
        <p className="text-sm text-muted-foreground">Tell us about your business and help us build the perfect platform for African creatives</p>
      </div>

      {/* About Section */}
      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">About Our Platform</h3>
          <p className="text-sm text-muted-foreground">
            We're building a marketplace that celebrates African craftsmanship and creativity. Join our waitlist to be among the first sellers when we launch, and help us shape a platform designed specifically for African artisans, designers, and creatives.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Showcase Your Work</h4>
                <p className="text-xs text-muted-foreground">Beautiful storefront to display your creations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Global Reach</h4>
                <p className="text-xs text-muted-foreground">Connect with customers worldwide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Fair Pricing</h4>
                <p className="text-xs text-muted-foreground">Competitive rates and fast payouts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Support</h4>
                <p className="text-xs text-muted-foreground">Dedicated seller support and community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist CTA */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Ready to Join?</h3>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Fill out our waitlist form to tell us about your business, craft type, and what you'd like to see on our platform. 
            We'll keep you updated on our launch and ensure you're among the first to start selling.
          </p>
          <Button
            onClick={() => window.open("https://forms.gle/pgxXSvReZDdTQCLk6", "_blank")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-8 inline-flex items-center gap-2"
          >
            Join the Waitlist
            <ExternalLink className="h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground">
            This will open a Google Form in a new tab
          </p>
        </div>

        {/* Additional Information */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-semibold text-foreground">What to Expect</h4>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Early access when we launch our seller platform</li>
            <li>Updates on platform development and features</li>
            <li>Opportunity to provide feedback and shape the platform</li>
            <li>Priority support when you become a seller</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
