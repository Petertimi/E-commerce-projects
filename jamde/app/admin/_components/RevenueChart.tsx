'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type RevenueData = {
  date: string
  revenue: number
}

type RevenueChartProps = {
  data: RevenueData[]
}

type TimeRange = '7d' | '30d' | '90d' | '365d'

export function RevenueChart({ data }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')

  // Filter and aggregate data based on time range
  const chartData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= cutoffDate
    })

    // Group by appropriate time period
    const grouped: Record<string, number> = {}
    
    filtered.forEach((item) => {
      const date = new Date(item.date)
      let key: string
      
      if (timeRange === '7d' || timeRange === '30d') {
        // Group by day
        key = date.toISOString().split('T')[0]
      } else if (timeRange === '90d') {
        // Group by week
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = `Week ${weekStart.toISOString().split('T')[0]}`
      } else {
        // Group by month
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }
      
      grouped[key] = (grouped[key] || 0) + item.revenue
    })

    return Object.entries(grouped)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [data, timeRange])

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (timeRange === '365d') {
      // Month format: "Jan 2024"
      const [year, month] = dateStr.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1)
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } else if (timeRange === '90d') {
      // Week format: "Jan 1"
      const weekDate = dateStr.replace('Week ', '')
      const date = new Date(weekDate)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      // Day format: "Jan 1"
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-2">{`${timeRange === '365d' ? 'Month' : timeRange === '90d' ? 'Week' : 'Date'}: ${formatDate(label)}`}</p>
          <p className="text-sm text-primary font-semibold">
            Revenue: {formatCurrency(payload[0].value as number)}
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Revenue Analytics</h2>
            <p className="text-sm text-muted-foreground">Revenue trends over time</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No revenue data available for the selected period
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Revenue Analytics</h2>
          <p className="text-sm text-muted-foreground">Revenue trends over time</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '365d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded transition ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {range === '7d' ? '7D' : range === '30d' ? '30D' : range === '90d' ? '90D' : '1Y'}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={2}
            name="Revenue"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
