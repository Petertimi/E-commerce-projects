import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { KeyMetrics } from './_components/KeyMetrics'
import { RevenueChart } from './_components/RevenueChart'
import { OrderStatistics } from './_components/OrderStatistics'
import { RecentOrders } from './_components/RecentOrders'
import { LowStockAlerts } from './_components/LowStockAlerts'
import { DashboardSkeleton } from './_components/DashboardSkeleton'
import { ErrorBoundary } from './_components/ErrorBoundary'

const prisma = new PrismaClient()

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user) redirect('/api/auth/signin')
  
  const role = (session.user as any).role
  if (role !== 'ADMIN') {
    return <div className="p-8 text-center">Access Denied. Admin only.</div>
  }

  // Calculate date ranges
  const now = new Date()
  const last365Days = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Key Metrics
  const [totalRevenue, totalOrders, totalCustomers, recentOrdersData, orderStatusData, revenueData] = await Promise.all([
    // Total Revenue (all time)
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    // Total Orders (all time)
    prisma.order.count(),
    // Total Customers
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    // Recent Orders for table
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
    // Order status distribution
    prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    // Revenue data for last 365 days (for chart)
    prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: last365Days },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  const revenue = Number(totalRevenue._sum.total || 0)
  const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0

  // Group revenue by day
  const revenueByDay: Record<string, number> = {}
  revenueData.forEach((order) => {
    const date = order.createdAt.toISOString().split('T')[0]
    revenueByDay[date] = (revenueByDay[date] || 0) + Number(order.total)
  })

  // Convert to array format for chart
  const chartData = Object.entries(revenueByDay)
    .map(([date, value]) => ({ date, revenue: value }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Order status distribution
  const statusDistribution = orderStatusData.map((item) => ({
    status: item.status,
    count: item._count.status,
  }))

  // Low stock products (stock < 10)
  const lowStockProducts = await prisma.product.findMany({
    where: {
      active: true,
      stock: { lt: 10 },
    },
    select: {
      id: true,
      name: true,
      stock: true,
      price: true,
      images: true,
    },
    orderBy: { stock: 'asc' },
    take: 10,
  })

  // Convert Decimal to number
  const lowStockProductsWithNumbers = lowStockProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }))

  // Convert Decimal to numbers for orders
  const recentOrdersWithNumbers = recentOrdersData.map((order) => ({
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shippingCost: Number(order.shippingCost),
  }))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your store performance</p>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
          {/* Key Metrics Cards */}
          <div className="mb-6">
            <ErrorBoundary>
              <KeyMetrics
                totalRevenue={revenue}
                totalOrders={totalOrders}
                totalCustomers={totalCustomers}
                avgOrderValue={avgOrderValue}
              />
            </ErrorBoundary>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <ErrorBoundary>
                <Suspense fallback={<div className="bg-white rounded-lg border p-6 h-[400px] animate-pulse" />}>
                  <RevenueChart data={chartData} />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* Order Statistics */}
            <div>
              <ErrorBoundary>
                <Suspense fallback={<div className="bg-white rounded-lg border p-6 h-[300px] animate-pulse" />}>
                  <OrderStatistics data={statusDistribution} />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* Low Stock Alerts */}
            <div>
              <ErrorBoundary>
                <Suspense fallback={<div className="bg-white rounded-lg border p-6 h-[300px] animate-pulse" />}>
                  <LowStockAlerts products={lowStockProductsWithNumbers} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <ErrorBoundary>
              <Suspense fallback={<div className="bg-white rounded-lg border p-6 h-[400px] animate-pulse" />}>
                <RecentOrders orders={recentOrdersWithNumbers} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
