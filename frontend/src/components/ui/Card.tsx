interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export default function Card({ hoverable = false, children, className = "", ...props }: CardProps) {
  const hoverClass = hoverable
    ? "hover:border-zinc-300 dark:hover:border-white/15 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:-translate-y-0.5"
    : "";

  return (
    <div
      className={`rounded-2xl border border-(--border) bg-(--surface) shadow-lg shadow-black/5 dark:shadow-black/10 transition-all duration-300 ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
