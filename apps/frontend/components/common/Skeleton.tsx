interface SkeletonProps {
  rows?: number;
}

export default function Skeleton({
  rows = 5,
}: SkeletonProps) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-10 rounded-lg bg-zinc-800"
        />
      ))}
    </div>
  );
}