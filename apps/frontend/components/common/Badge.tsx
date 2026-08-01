interface BadgeProps {
  children: React.ReactNode;
  variant:
    | "buy"
    | "sell"
    | "success"
    | "warning"
    | "danger"
    | "neutral";
}

const styles = {
  buy: "bg-green-500/20 text-green-400",
  sell: "bg-red-500/20 text-red-400",
  success: "bg-green-500/20 text-green-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  danger: "bg-red-500/20 text-red-400",
  neutral: "bg-zinc-700 text-zinc-300",
};

export default function Badge({
  children,
  variant,
}: BadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}