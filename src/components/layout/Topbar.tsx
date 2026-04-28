import { Bell, Search } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAppStore } from "@/store/AppStore";

export const Topbar = () => {
  const navigate = useNavigate();
  const { mood } = useAppStore();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="text-lg font-semibold tracking-tight">feelora</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {mood && (
          <NavLink
            to="/mood"
            className="hidden items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground sm:flex"
          >
            Mood: <span className="text-foreground">{mood}</span>
            <span className="text-primary">change</span>
          </NavLink>
        )}
        <button
          onClick={() => navigate("/search")}
          aria-label="Search"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-elevated text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search size={18} />
        </button>
        <button
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-elevated text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-purple text-sm font-semibold">
          F
        </div>
      </div>
    </header>
  );
};