import Link from 'next/link'

type Order = {
  id: string
  status: string
  paymentStatus: string
  total: number
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
}

type RecentOrdersProps = {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <p className="text-sm text-muted-foreground">Latest customer orders</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No orders yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
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
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

