interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">

      <div className="text-6xl">
        {icon}
      </div>

      <h2 className="mt-4 text-2xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-sm text-zinc-500">
        {description}
      </p>

    </div>
  );
}