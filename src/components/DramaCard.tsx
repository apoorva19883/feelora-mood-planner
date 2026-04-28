import { Link } from "react-router-dom";
import { Drama } from "@/data/dramas";
import { Star, Bookmark, Check } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  drama: Drama;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const DramaCard = ({ drama, size = "md", className }: Props) => {
  const { isInWatchlist, toggleWatchlist } = useAppStore();
  const inList = isInWatchlist(drama.id);

  const dim = {
    sm: "w-40 h-56",
    md: "w-52 h-72",
    lg: "w-full h-80",
  }[size];

  return (
    <Link
      to={`/drama/${drama.id}`}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-2xl border border-border bg-elevated transition-all hover:-translate-y-1 hover:shadow-glow",
        dim,
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", drama.gradient)} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[11px] backdrop-blur">
        <Star size={11} className="fill-gold text-gold" />
        <span className="font-medium">{drama.rating}</span>
      </div>
      <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] uppercase tracking-wide backdrop-blur">
        {drama.country}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          const added = toggleWatchlist(drama.id);
          toast({ title: added ? "Added to watchlist" : "Removed from watchlist", description: drama.title });
        }}
        aria-label="Toggle watchlist"
        className="absolute right-2 bottom-20 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-primary group-hover:opacity-100"
      >
        {inList ? <Check size={14} /> : <Bookmark size={14} />}
      </button>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-6xl drop-shadow-lg">
        {drama.emoji}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight">{drama.title}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {drama.year} · {drama.episodes} eps
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {drama.tropes.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] text-foreground/90">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};