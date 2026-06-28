import { useState, useEffect, useRef } from "react";
import { Bell, Search, Sun, Moon, Sparkles } from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import { useAuthStore } from "../store/authStore";
import { searchGlobal, getNotifications } from "../services/globalService";
import type { GlobalSearchItem, NotificationItem } from "../services/globalService";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GlobalSearchItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Load notifications
  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch {
        console.error("Failed to load notifications");
      }
    }
    loadNotifications();
  }, []);

  // Handle global search debounce query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await searchGlobal(searchQuery);
        setSearchResults(results);
      } catch {
        console.error("Error doing global search");
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchResultClick = (item: GlobalSearchItem) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    
    // Navigate based on item type
    if (item.type === "lead") navigate("/leads");
    else if (item.type === "customer") navigate("/customers");
    else if (item.type === "company") navigate("/companies");
    else if (item.type === "opportunity") navigate("/opportunities");
    else if (item.type === "proposal") navigate("/proposals");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-(--border) bg-(--background)/90 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6 lg:px-8">
        
        {/* Search bar section */}
        <div ref={searchRef} className="relative flex-1">
          <div className="flex items-center gap-3 rounded-2xl border border-(--border) bg-black/3 dark:bg-white/5 px-4 py-2.5">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search leads, customers, opportunities, proposals..."
              className="w-full bg-transparent text-sm text-(--text-primary) outline-none placeholder:text-zinc-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-14 left-0 w-full max-h-64 overflow-y-auto rounded-2xl border border-(--border) bg-(--surface) shadow-2xl p-2 z-30">
              <p className="text-[10px] font-semibold text-zinc-500 px-3 py-1.5 uppercase tracking-wider">Search Results</p>
              <div className="space-y-0.5">
                {searchResults.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSearchResultClick(item)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-semibold text-(--text-primary)">{item.title}</p>
                      {item.subtitle && <p className="text-xs text-zinc-500 mt-0.5">{item.subtitle}</p>}
                    </div>
                    <span className="text-[10px] font-bold capitalize px-2 py-0.5 rounded bg-indigo-500/10 text-[#6366F1]">
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSearchOpen && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-14 left-0 w-full rounded-2xl border border-(--border) bg-(--surface) shadow-2xl p-4 text-center text-xs text-zinc-500 z-30">
              No results match "{searchQuery}"
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--border) bg-black/3 dark:bg-white/5 text-(--text-secondary) transition-colors hover:bg-black/5 dark:hover:bg-white/10 hover:text-(--text-primary)"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-[#6366F1]" />
          )}
        </button>

        {/* Notification Bell section */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-(--border) bg-black/3 dark:bg-white/5 text-(--text-secondary) transition-colors hover:bg-black/5 dark:hover:bg-white/10 hover:text-(--text-primary)"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-(--primary)" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 top-14 w-80 rounded-2xl border border-(--border) bg-(--surface) shadow-2xl p-3 z-30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-(--border)">
                <h4 className="text-sm font-semibold text-(--text-primary) flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#6366F1]" />
                  Notifications
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-[#6366F1]">
                  {notifications.length} Info
                </span>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">No new notifications.</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-2 rounded-xl bg-black/3 dark:bg-white/3 border border-(--border) space-y-1">
                      <p className="text-xs font-semibold text-(--text-primary)">{notif.title}</p>
                      <p className="text-[10px] text-zinc-500 leading-normal">{notif.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="flex items-center gap-3 rounded-2xl border border-(--border) bg-black/3 dark:bg-white/5 px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--primary) text-xs font-semibold text-white">
            {user?.name ? user.name[0]?.toUpperCase() : "A"}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-(--text-primary)">{user?.name || "Admin"}</p>
            <p className="text-xs text-zinc-400">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}
