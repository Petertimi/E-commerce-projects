'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Edit, Trash2, CheckSquare, Square } from 'lucide-react'
import { bulkDeleteProducts, bulkUpdateStatus } from '../_actions'

type Product = {
  id: string
  name: string
  sku: string | null
  price: number
  stock: number
  active: boolean
  images: string[]
  category: { name: string } | null
}

type ProductsTableProps = {
  products: Product[]
  currentPage: number
  totalPages: number
  total: number
  search: string
  status: string
}

export function ProductsTable({
  products,
  currentPage,
  totalPages,
  total,
  search: initialSearch,
  status: initialStatus,
}: ProductsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status !== 'all') params.set('status', status)
    router.push(`/admin/products?${params.toString()}`)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (newStatus !== 'all') params.set('status', newStatus)
    router.push(`/admin/products?${params.toString()}`)
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(products.map((p) => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !confirm(`Delete ${selectedIds.length} product(s)?`)) return
    
    setIsLoading(true)
    try {
      await bulkDeleteProducts(selectedIds)
      setSelectedIds([])
      router.refresh()
    } catch (error) {
      alert('Failed to delete products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkStatusUpdate = async (active: boolean) => {
    if (!selectedIds.length) return
    
    setIsLoading(true)
    try {
      await bulkUpdateStatus(selectedIds, active)
      setSelectedIds([])
      router.refresh()
    } catch (error) {
      alert('Failed to update products')
    } finally {
      setIsLoading(false)
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
              placeholder="Search products by name, SKU, or description..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Search
          </button>
        </form>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">
              {selectedIds.length} product(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate(true)}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate(false)}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                Deactivate
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1 text-sm border rounded hover:bg-muted"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 w-12">
                <button onClick={toggleSelectAll} className="hover:opacity-70">
                  {selectedIds.length === products.length && products.length > 0 ? (
                    <CheckSquare className="h-5 w-5" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium">Product</th>
              <th className="text-left py-3 px-4 text-sm font-medium">SKU</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Category</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Price</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Stock</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleSelect(product.id)}
                      className="hover:opacity-70"
                    >
                      {selectedIds.includes(product.id) ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {product.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {product.sku || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {product.category?.name || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={
                        product.stock < 10
                          ? 'text-red-600 font-medium'
                          : product.stock < 50
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 hover:bg-muted rounded transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
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
            Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, total)} of {total} products
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/products?page=${currentPage - 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}
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
              href={`/admin/products?page=${currentPage + 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}
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

