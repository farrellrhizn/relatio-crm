import { Bell, Search, Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

export default function Topbar() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-(--background)/90 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search leads, customers, activities..."
            className="w-full bg-transparent text-sm text-(--text-primary) outline-none placeholder:text-zinc-500"
          />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-[#6366F1]" />
          )}
        </button>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-(--primary)" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--primary) text-xs font-semibold text-white">
            A
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-zinc-400">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}