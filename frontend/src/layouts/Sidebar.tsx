import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Activity,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", to: "/leads", icon: Users },
  { label: "Customers", to: "/customers", icon: UserRound },
  { label: "Activities", to: "/activities", icon: Activity },
  { label: "Settings", to: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-white/10 bg-(--surface)/90 px-4 py-5 lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--primary) text-sm font-semibold text-white">
          R
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">Relatio</p>
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
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">Relatio CRM</p>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          Modern CRM for leads, customers, activities, and growth.
        </p>
      </div>
    </aside>
  );
}