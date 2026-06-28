interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost" | "default";
  children: React.ReactNode;
}

export default function Badge({ variant = "default", children, className = "", ...props }: BadgeProps) {
  const styles: Record<string, string> = {
    new: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 border-zinc-500/20",
    contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
    qualified: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20",
    proposal: "bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20",
    negotiation: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    won: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    lost: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
    default: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  };

  const badgeStyle = styles[variant] || styles.default;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all ${badgeStyle} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
