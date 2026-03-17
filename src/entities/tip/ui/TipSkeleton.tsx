export const TipSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-2xl p-5 shadow">
      <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
      <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
      <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
    </div>
  )
}