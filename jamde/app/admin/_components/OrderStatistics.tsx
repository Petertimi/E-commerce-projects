'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

type StatusData = {
  status: string
  count: number
}

type OrderStatisticsProps = {
  data: StatusData[]
}

const COLORS = {
  PENDING: '#9ca3af',
  PROCESSING: '#fbbf24',
  SHIPPED: '#3b82f6',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
  REFUNDED: '#a855f7',
}

export function OrderStatistics({ data }: OrderStatisticsProps) {
  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase()
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-1">{payload[0].name}</p>
          <p className="text-sm text-primary font-semibold">
            Count: {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Order Statistics</h2>
          <p className="text-sm text-muted-foreground">Order status distribution</p>
        </div>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No order data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Order Statistics</h2>
        <p className="text-sm text-muted-foreground">Order status distribution</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="status"
            tickFormatter={formatStatus}
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="count" name="Orders" fill="#2563eb" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || '#9ca3af'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Status Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: COLORS[item.status as keyof typeof COLORS] || '#9ca3af' }}
            />
            <span className="text-muted-foreground">
              {formatStatus(item.status)}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

