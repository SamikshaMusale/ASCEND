export default function LoadingSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-surface-light/50 rounded"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`glass-card p-6 animate-pulse ${className}`} role="status" aria-label="Loading">
      <div className="h-5 bg-surface-light/50 rounded w-3/4 mb-4" />
      <div className="h-3 bg-surface-light/50 rounded w-full mb-2" />
      <div className="h-3 bg-surface-light/50 rounded w-5/6 mb-4" />
      <div className="h-8 bg-surface-light/50 rounded w-1/3" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
