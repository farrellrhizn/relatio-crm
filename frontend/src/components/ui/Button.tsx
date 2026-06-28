import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants: Record<string, string> = {
    primary: "bg-(--primary) hover:bg-(--primary-hover) text-white rounded-xl shadow-lg hover:shadow-indigo-500/20 active:scale-98",
    secondary: "bg-black/5 dark:bg-white/5 border border-(--border) hover:bg-black/10 dark:hover:bg-white/10 text-(--text-secondary) hover:text-(--text-primary) rounded-xl active:scale-98",
    danger: "bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-500 dark:text-rose-400 rounded-xl active:scale-98",
    ghost: "text-(--text-secondary) hover:text-(--text-primary) hover:bg-black/5 dark:hover:bg-white/5 rounded-xl",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-5 py-3 text-base gap-2.5",
  };

  const buttonStyle = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={buttonStyle} disabled={disabled || isLoading} {...props}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
      {!isLoading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
}
