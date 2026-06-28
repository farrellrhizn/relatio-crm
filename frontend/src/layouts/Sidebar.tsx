import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Activity,
  Building,
  CheckSquare,
  TrendingUp,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Companies", to: "/companies", icon: Building },
  { label: "Leads", to: "/leads", icon: Users },
  { label: "Proposals", to: "/proposals", icon: FileText },
  { label: "Opportunities", to: "/opportunities", icon: TrendingUp },
  { label: "Customers", to: "/customers", icon: UserRound },
  { label: "Tasks", to: "/tasks", icon: CheckSquare },
  { label: "Activities", to: "/activities", icon: Activity },
  { label: "Settings", to: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-(--border) bg-(--sidebar) px-4 py-5 lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--primary) text-sm font-semibold text-white">
          R
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-(--text-primary)">Relatio</p>
          <p className="text-xs text-zinc-400">Mini CRM</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-black/5 dark:bg-white/10 text-(--text-primary) shadow-sm"
                    : "text-(--text-secondary) hover:bg-black/3 dark:hover:bg-white/5 hover:text-(--text-primary)",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-(--border) bg-black/3 dark:bg-white/5 p-4">
        <p className="text-sm font-medium text-(--text-primary)">Relatio CRM</p>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          Modern CRM for leads, customers, activities, and growth.
        </p>
      </div>
    </aside>
  );
}