import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'

type KeyMetricsProps = {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  avgOrderValue: number
}

export function KeyMetrics({ totalRevenue, totalOrders, totalCustomers, avgOrderValue }: KeyMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const metrics = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'All-time revenue from paid orders',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Total number of orders',
    },
    {
      label: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Registered customers',
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(avgOrderValue),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Average order value',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div key={metric.label} className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`${metric.bgColor} ${metric.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

