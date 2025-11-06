'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, CreditCard, MapPin, User } from 'lucide-react'
import { updateOrderStatus, processRefund } from '../_actions'

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    slug: string
    images: string[]
    price: number
  }
}

type Order = {
  id: string
  status: string
  paymentStatus: string
  total: number
  subtotal: number
  tax: number
  shippingCost: number
  shippingAddress: any
  billingAddress: any
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  items: OrderItem[]
}

type OrderDetailProps = {
  order: Order
}

export function OrderDetail({ order: initialOrder }: OrderDetailProps) {
  const router = useRouter()
  const [order, setOrder] = useState(initialOrder)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

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
    if (!confirm(`Update order status to ${newStatus}?`)) return

    setIsLoading(true)
    setError(null)
    try {
      await updateOrderStatus(order.id, newStatus)
      setOrder({ ...order, status: newStatus })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!confirm(`Process refund for ${formatCurrency(order.total)}? This action cannot be undone.`)) return

    setIsLoading(true)
    setError(null)
    try {
      await processRefund(order.id)
      setOrder({ ...order, paymentStatus: 'REFUNDED', status: 'REFUNDED' })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process refund')
    } finally {
      setIsLoading(false)
    }
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

  const canRefund = order.paymentStatus === 'PAID' && order.status !== 'REFUNDED' && order.status !== 'CANCELLED'
  const canUpdateStatus = order.status !== 'REFUNDED' && order.status !== 'CANCELLED'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-1">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Billing Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {order.shippingAddress && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  {typeof order.shippingAddress === 'object' ? (
                    <>
                      <div>{order.shippingAddress.fullName}</div>
                      <div>{order.shippingAddress.addressLine1}</div>
                      {order.shippingAddress.addressLine2 && (
                        <div>{order.shippingAddress.addressLine2}</div>
                      )}
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.postalCode}
                      </div>
                      <div>{order.shippingAddress.country}</div>
                    </>
                  ) : (
                    <div>{String(order.shippingAddress)}</div>
                  )}
                </div>
              </div>
            )}
            {order.billingAddress && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Billing Address
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  {typeof order.billingAddress === 'object' ? (
                    <>
                      <div>{order.billingAddress.fullName}</div>
                      <div>{order.billingAddress.addressLine1}</div>
                      {order.billingAddress.addressLine2 && (
                        <div>{order.billingAddress.addressLine2}</div>
                      )}
                      <div>
                        {order.billingAddress.city}, {order.billingAddress.state}{' '}
                        {order.billingAddress.postalCode}
                      </div>
                      <div>{order.billingAddress.country}</div>
                    </>
                  ) : (
                    <div>{String(order.billingAddress)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-muted-foreground">Name</div>
                <div className="font-medium">{order.user.name || 'N/A'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Email</div>
                <div className="font-medium">{order.user.email}</div>
              </div>
              <Link
                href={`/admin/users/${order.user.id}`}
                className="inline-block mt-3 text-sm text-primary hover:underline"
              >
                View Customer Profile →
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold text-base">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              {canUpdateStatus && (
                <div>
                  <label className="block text-sm font-medium mb-2">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              )}
              {canRefund && (
                <button
                  onClick={handleRefund}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {isLoading ? 'Processing...' : 'Process Refund'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

