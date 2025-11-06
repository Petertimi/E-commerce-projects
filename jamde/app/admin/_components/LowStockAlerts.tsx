import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

type Product = {
  id: string
  name: string
  stock: number
  price: number | string
  images: string[]
}

type LowStockAlertsProps = {
  products: Product[]
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num)
  }

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-50'
    if (stock < 5) return 'text-orange-600 bg-orange-50'
    return 'text-yellow-600 bg-yellow-50'
  }

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
          <p className="text-sm text-muted-foreground">Products running low</p>
        </div>
        <AlertTriangle className="h-5 w-5 text-orange-500" />
      </div>
      {products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">All products are well stocked</div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="block p-3 rounded-lg border hover:bg-muted transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div className="ml-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStockColor(
                      product.stock
                    )}`}
                  >
                    {product.stock} left
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

