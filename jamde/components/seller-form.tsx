"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"

interface FormData {
  businessName: string
  ownerName: string
  email: string
  phone: string
  craftType: string
  businessDescription: string
  yearsExperience: string
  location: string
  website: string
  agreeTerms: boolean
}

type FormErrors = {
  businessName?: string
  ownerName?: string
  email?: string
  phone?: string
  craftType?: string
  businessDescription?: string
  yearsExperience?: string
  location?: string
  website?: string
  agreeTerms?: string
}

const CRAFT_TYPES = ["Painting", "Sculpture", "Furniture Making", "Bead Making", "Other"]

export default function SellerForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    craftType: "",
    businessDescription: "",
    yearsExperience: "",
    location: "",
    website: "",
    agreeTerms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required"
    if (!formData.email.trim() || !formData.email.includes("@")) newErrors.email = "Valid email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.craftType) newErrors.craftType = "Please select your craft type"
    if (!formData.businessDescription.trim()) newErrors.businessDescription = "Business description is required"
    if (!formData.yearsExperience) newErrors.yearsExperience = "Experience is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/seller-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          craftType: formData.craftType,
          businessDescription: formData.businessDescription,
          yearsExperience: formData.yearsExperience,
          location: formData.location,
          website: formData.website || undefined,
        }),
      })

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = 'Failed to submit application'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit application')
      }

      setIsLoading(false)
      onSubmit()
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.'
      alert(errorMessage)
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target as HTMLInputElement

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Tell Us About Your Craft</h2>
        <p className="text-sm text-muted-foreground">Help customers discover your unique African creations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Business Name"
          name="businessName"
          placeholder="e.g., Amara's Paintings"
          value={formData.businessName}
          onChange={handleChange}
          error={errors.businessName as string}
        />

        <FormField
          label="Owner Name"
          name="ownerName"
          placeholder="Your full name"
          value={formData.ownerName}
          onChange={handleChange}
          error={errors.ownerName as string}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email as string}
        />

        <FormField
          label="Phone"
          name="phone"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone as string}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Craft Type</label>
          <select
            name="craftType"
            value={formData.craftType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.craftType ? "border-destructive" : "border-border"
            }`}
          >
            <option value="">Select your craft type...</option>
            {CRAFT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.craftType && <p className="text-xs text-destructive mt-1">{errors.craftType}</p>}
        </div>

        <FormField
          label="Years of Experience"
          name="yearsExperience"
          type="number"
          placeholder="e.g., 5"
          value={formData.yearsExperience}
          onChange={handleChange}
          error={errors.yearsExperience as string}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Location"
          name="location"
          placeholder="City, Country"
          value={formData.location}
          onChange={handleChange}
          error={errors.location as string}
        />

        <FormField
          label="Website (Optional)"
          name="website"
          type="url"
          placeholder="https://yoursite.com"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Business Description</label>
        <textarea
          name="businessDescription"
          value={formData.businessDescription}
          onChange={handleChange}
          placeholder="Tell us about your craft, your inspiration, and what makes your work unique..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-md bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
            errors.businessDescription ? "border-destructive" : "border-border"
          }`}
        />
        {errors.businessDescription && <p className="text-xs text-destructive mt-1">{errors.businessDescription}</p>}
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          className="mt-1 w-4 h-4 rounded border-border bg-card cursor-pointer accent-primary"
        />
        <label className="text-sm text-foreground cursor-pointer">
          I agree to the Terms of Service and confirm that I create original, authentic work that celebrates African
          craftsmanship
          {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}
        </label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2"
      >
        {isLoading ? "Submitting..." : "Apply to Sell"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this form, you agree to be contacted by email with updates about your application.
      </p>
    </form>
  )
}

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

function FormField({ label, name, type = "text", placeholder, value, onChange, error }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}
