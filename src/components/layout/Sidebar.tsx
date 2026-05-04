import { NavLink, useLocation } from "react-router-dom";
import { Home, Compass, Sparkles, CalendarDays, Bookmark, Users, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/tropes", label: "Tropes", icon: Sparkles, end: false },
  { to: "/profile", label: "My Profile", icon: User },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/watchlist", label: "Watchlist", icon: Bookmark },
  { to: "/community", label: "Community", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface/80 backdrop-blur md:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-glow" />
        <span className="text-xl font-semibold tracking-tight">feelora</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((it, idx) => {
          const active = it.end ? pathname === it.to : pathname.startsWith(it.to) && it.to !== "/";
          const Icon = it.icon;
          return (
            <NavLink
              key={`${it.label}-${idx}`}
              to={it.to}
              end={it.end}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-elevated hover:text-foreground",
              )}
            >
              <Icon size={18} className={active ? "text-primary" : ""} />
              <span>{it.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </NavLink>
          );
        })}
      </nav>
      <div className="m-3 mb-6 rounded-2xl border border-border bg-elevated p-4">
        <p className="text-xs text-muted-foreground">Tonight's mood</p>
        <p className="mt-1 text-sm font-medium">Find your perfect drama →</p>
        <NavLink to="/mood" className="mt-3 inline-block text-xs text-primary hover:underline">
          Change mood
        </NavLink>
      </div>
    </aside>
  );
};