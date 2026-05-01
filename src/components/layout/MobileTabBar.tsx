import { NavLink, useLocation } from "react-router-dom";
import { Home, Compass, CalendarDays, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/watchlist", label: "List", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
];

export const MobileTabBar = () => {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.end ? pathname === t.to : pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <NavLink
              key={t.label}
              to={t.to}
              end={t.end}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon size={18} />
              <span>{t.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};