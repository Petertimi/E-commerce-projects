'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Eye } from 'lucide-react'

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    images: string[]
  }
}

type Order = {
  id: string
  status: string
  paymentStatus: string
  total: number
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
  }
  items: OrderItem[]
}

type OrdersTableProps = {
  orders: Order[]
  currentPage: number
  totalPages: number
  total: number
  search: string
  status: string
  paymentStatus: string
}

export function OrdersTable({
  orders,
  currentPage,
  totalPages,
  total,
  search: initialSearch,
  status: initialStatus,
  paymentStatus: initialPaymentStatus,
}: OrdersTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status !== 'all') params.set('status', status)
    if (paymentStatus !== 'all') params.set('paymentStatus', paymentStatus)
    router.push(`/admin/orders?${params.toString()}`)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (newStatus !== 'all') params.set('status', newStatus)
    if (paymentStatus !== 'all') params.set('paymentStatus', paymentStatus)
    router.push(`/admin/orders?${params.toString()}`)
  }

  const handlePaymentStatusChange = (newPaymentStatus: string) => {
    setPaymentStatus(newPaymentStatus)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status !== 'all') params.set('status', status)
    if (newPaymentStatus !== 'all') params.set('paymentStatus', newPaymentStatus)
    router.push(`/admin/orders?${params.toString()}`)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
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
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Search and Filters */}
      <div className="p-4 border-b space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
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
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <select
            value={paymentStatus}
            onChange={(e) => handlePaymentStatusChange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="all">All Payment Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
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
              <th className="text-left py-3 px-4 text-sm font-medium">Order ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Customer</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Items</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Total</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Payment</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-mono text-primary hover:underline"
                    >
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{order.user.name || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">{order.user.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {order.items.length} item(s)
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
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
            Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, total)} of {total} orders
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/orders?page=${currentPage - 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}${paymentStatus !== 'all' ? `&paymentStatus=${paymentStatus}` : ''}`}
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
              href={`/admin/orders?page=${currentPage + 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}${paymentStatus !== 'all' ? `&paymentStatus=${paymentStatus}` : ''}`}
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

