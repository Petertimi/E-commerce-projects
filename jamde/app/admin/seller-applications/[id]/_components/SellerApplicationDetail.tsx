'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, MapPin, Globe, Briefcase, Calendar, FileText } from 'lucide-react'
import { updateApplicationStatus } from '../_actions'

type SellerApplication = {
  id: string
  businessName: string
  ownerName: string
  email: string
  phone: string
  craftType: string
  businessDescription: string
  yearsExperience: string
  location: string
  website: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

type SellerApplicationDetailProps = {
  application: SellerApplication
}

export function SellerApplicationDetail({ application: initialApplication }: SellerApplicationDetailProps) {
  const router = useRouter()
  const [application, setApplication] = useState(initialApplication)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!confirm(`Update application status to ${newStatus}?`)) return

    setIsLoading(true)
    setError(null)
    try {
      await updateApplicationStatus(application.id, newStatus)
      setApplication({ ...application, status: newStatus })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/seller-applications"
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{application.businessName}</h1>
            <p className="text-muted-foreground mt-1">
              Application submitted on {formatDate(application.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}
        >
          {application.status}
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Business Name</div>
                <div className="font-medium">{application.businessName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Owner Name</div>
                <div className="font-medium">{application.ownerName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Craft Type</div>
                <div className="font-medium">{application.craftType}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Years of Experience</div>
                <div className="font-medium">{application.yearsExperience} years</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a
                    href={`mailto:${application.email}`}
                    className="font-medium hover:underline"
                  >
                    {application.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <a
                    href={`tel:${application.phone}`}
                    className="font-medium hover:underline"
                  >
                    {application.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{application.location}</div>
                </div>
              </div>
              {application.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Website</div>
                    <a
                      href={application.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {application.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Description */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Business Description
            </h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {application.businessDescription}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Update Status</h3>
            <div className="space-y-3">
              <select
                value={application.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
              >
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Application Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application ID</span>
                <span className="font-mono text-xs">{application.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span>{formatDate(application.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{formatDate(application.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
