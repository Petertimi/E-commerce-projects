export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Key Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-4" />
            <div className="h-8 bg-muted rounded w-3/4" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6 h-[400px] animate-pulse" />
        <div className="bg-white rounded-lg border p-6 h-[400px] animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg border p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/4 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

