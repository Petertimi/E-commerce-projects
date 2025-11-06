'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User as UserIcon, ShoppingBag, MapPin, Mail, Calendar } from 'lucide-react'
import { updateUserRole, deleteUser } from '../../_actions'

type Order = {
  id: string
  status: string
  paymentStatus: string
  total: number
  createdAt: Date
}

type Address = {
  id: string
  label: string | null
  fullName: string
  city: string
  country: string
  isDefault: boolean
}

type User = {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  createdAt: Date
  orders: Order[]
  addresses: Address[]
  _count: {
    orders: number
    addresses: number
  }
}

type UserDetailProps = {
  user: User
}

export function UserDetail({ user: initialUser }: UserDetailProps) {
  const router = useRouter()
  const [user, setUser] = useState(initialUser)
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
    })
  }

  const handleRoleUpdate = async (newRole: string) => {
    if (!confirm(`Change user role to ${newRole}?`)) return

    setIsLoading(true)
    setError(null)
    try {
      await updateUserRole(user.id, newRole)
      setUser({ ...user, role: newRole })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete user ${user.name || user.email}? This action cannot be undone.`)) return

    setIsLoading(true)
    setError(null)
    try {
      await deleteUser(user.id)
      router.push('/admin/users')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
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

  const totalSpent = user.orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{user.name || 'No name'}</h1>
              <p className="text-muted-foreground mt-1">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'ADMIN'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {user.role}
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
          {/* User Info */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <div className="font-medium">{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined
                </div>
                <div className="font-medium">{formatDate(user.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Recent Orders ({user._count.orders})
              </h2>
              <Link
                href={`/admin/orders?search=${user.email}`}
                className="text-sm text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
            {user.orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No orders yet</div>
            ) : (
              <div className="space-y-3">
                {user.orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block p-4 border rounded-lg hover:bg-muted transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(order.total)}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Addresses */}
          {user.addresses.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Addresses ({user._count.addresses})
              </h2>
              <div className="space-y-3">
                {user.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {address.label && (
                            <span className="text-muted-foreground">{address.label}: </span>
                          )}
                          {address.fullName}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {address.city}, {address.country}
                        </div>
                      </div>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Statistics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Orders</span>
                <span className="font-medium">{user._count.orders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-medium">{formatCurrency(totalSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Addresses</span>
                <span className="font-medium">{user._count.addresses}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">User Role</label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleUpdate(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              >
                {isLoading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

