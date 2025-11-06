'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react'
import { updateUserRole, deleteUser } from '../_actions'

type User = {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  createdAt: Date
  _count: {
    orders: number
  }
}

type UsersTableProps = {
  users: User[]
  currentPage: number
  totalPages: number
  total: number
  search: string
  role: string
}

export function UsersTable({
  users,
  currentPage,
  totalPages,
  total,
  search: initialSearch,
  role: initialRole,
}: UsersTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [role, setRole] = useState(initialRole)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (role !== 'all') params.set('role', role)
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (newRole !== 'all') params.set('role', newRole)
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    if (!confirm(`Change user role to ${newRole}?`)) return

    setIsLoading(userId)
    try {
      await updateUserRole(userId, newRole)
      router.refresh()
    } catch (error) {
      alert('Failed to update user role')
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Delete user ${userName || userId}? This action cannot be undone.`)) return

    setIsLoading(userId)
    try {
      await deleteUser(userId)
      router.refresh()
    } catch (error) {
      alert('Failed to delete user')
    } finally {
      setIsLoading(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getRoleColor = (role: string) => {
    return role === 'ADMIN'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800'
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
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
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
              <th className="text-left py-3 px-4 text-sm font-medium">User</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Role</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Orders</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Joined</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || 'User'}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{user.name || 'No name'}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {user.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                      disabled={isLoading === user.id}
                      className={`px-2 py-1 rounded text-xs font-medium border focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50 ${getRoleColor(user.role)}`}
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm">{user._count.orders}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1.5 hover:bg-muted rounded transition"
                        title="View Details"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id, user.name || user.email)}
                        disabled={isLoading === user.id}
                        className="p-1.5 hover:bg-red-50 rounded transition disabled:opacity-50 text-red-600"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
            Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, total)} of {total} users
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/users?page=${currentPage - 1}${search ? `&search=${search}` : ''}${role !== 'all' ? `&role=${role}` : ''}`}
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
              href={`/admin/users?page=${currentPage + 1}${search ? `&search=${search}` : ''}${role !== 'all' ? `&role=${role}` : ''}`}
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

