'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Eye, Mail, Phone, MapPin, Globe } from 'lucide-react'

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
}

type SellerApplicationsTableProps = {
  applications: SellerApplication[]
  currentPage: number
  totalPages: number
  total: number
  search: string
  status: string
}

export function SellerApplicationsTable({
  applications,
  currentPage,
  totalPages,
  total,
  search: initialSearch,
  status: initialStatus,
}: SellerApplicationsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status !== 'all') params.set('status', status)
    router.push(`/admin/seller-applications?${params.toString()}`)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (newStatus !== 'all') params.set('status', newStatus)
    router.push(`/admin/seller-applications?${params.toString()}`)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Search and Filters */}
      <div className="p-4 border-b space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by business name, owner, email, or craft type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 text-sm font-medium">Business</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Owner</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Contact</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Craft Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Location</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground">
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{app.businessName}</div>
                    <div className="text-xs text-muted-foreground">ID: {app.id.slice(0, 8)}</div>
                  </td>
                  <td className="py-3 px-4 text-sm">{app.ownerName}</td>
                  <td className="py-3 px-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{app.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{app.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{app.craftType}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{app.location}</span>
                    </div>
                    {app.website && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Globe className="h-3 w-3" />
                        <a
                          href={app.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDate(app.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/seller-applications/${app.id}`}
                      className="p-1.5 hover:bg-muted rounded transition inline-block"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, total)} of {total} applications
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/seller-applications?page=${currentPage - 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}
              className={`px-4 py-2 border rounded ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-muted'
              }`}
            >
              Previous
            </Link>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={`/admin/seller-applications?page=${currentPage + 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}
              className={`px-4 py-2 border rounded ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-muted'
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
