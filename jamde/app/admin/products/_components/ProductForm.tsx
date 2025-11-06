'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { UploadButton } from '@/lib/uploadthing'
import { createProduct, updateProduct } from '../_actions'
import Link from 'next/link'
import { X } from 'lucide-react'

type Category = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  compareAtPrice: number | null
  sku: string | null
  stock: number
  categoryId: string
  active: boolean
  featured: boolean
  images: string[]
}

type ProductFormProps = {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set('images', JSON.stringify(images))

      if (product) {
        await updateProduct(product.id, formData)
      } else {
        await createProduct(formData)
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            defaultValue={product?.name}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            defaultValue={product?.description || ''}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              defaultValue={product?.categoryId}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              defaultValue={product?.sku || ''}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pricing</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              defaultValue={product?.price}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Compare at Price</label>
            <input
              type="number"
              name="compareAtPrice"
              step="0.01"
              min="0"
              defaultValue={product?.compareAtPrice || ''}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Inventory</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            min="0"
            defaultValue={product?.stock}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Product Images</h2>
        
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res) {
              const urls = res.map((file) => file.url)
              setImages((prev) => [...prev, ...urls])
            }
          }}
          onUploadError={(error: Error) => {
            setError(`Upload failed: ${error.message}`)
          }}
        />
      </div>

      {/* Options */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Options</h2>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              defaultChecked={product?.active ?? true}
              className="w-4 h-4"
            />
            <span>Active (product is visible to customers)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="w-4 h-4"
            />
            <span>Featured (show on homepage)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <Link
          href="/admin/products"
          className="px-6 py-2 border rounded-lg hover:bg-muted transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}

