export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        ))}
      </div>
    </div>
  )
} 