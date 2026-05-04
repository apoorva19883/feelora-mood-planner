import { Link } from "react-router-dom";
import { Drama, getBingeHours } from "@/data/dramas";
import { Star, Bookmark, Check, Clock } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  drama: Drama;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const DramaCard = ({ drama, size = "md", className }: Props) => {
  const { isInWatchlist, toggleWatchlist } = useAppStore();
  const inList = isInWatchlist(drama.id);
  const [hovered, setHovered] = useState(false);

  const dim = {
    sm: "w-[160px] min-w-[160px] h-[224px]",
    md: "w-[208px] min-w-[208px] h-[288px]",
    lg: "w-full h-[320px]",
  }[size];

  return (
    <Link
      to={`/drama/${drama.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-elevated transition-all hover:-translate-y-1 hover:shadow-glow",
        dim,
        className,
      )}
    >
      <img src={drama.image} alt={drama.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[11px] backdrop-blur">
        <Star size={11} className="fill-gold text-gold" />
        <span className="font-medium">{drama.rating}</span>
      </div>
      <div className="absolute left-2 top-2 z-10 rounded-full bg-black/50 px-2 py-1 text-[10px] uppercase tracking-wide backdrop-blur">
        {drama.country}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          const added = toggleWatchlist(drama.id);
          toast({ title: added ? "Added to watchlist" : "Removed from watchlist", description: drama.title });
        }}
        aria-label="Toggle watchlist"
        className="absolute right-2 bottom-20 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-foreground opacity-0 backdrop-blur transition-all hover:bg-primary hover:scale-110 group-hover:opacity-100"
      >
        {inList ? <Check size={14} /> : <Bookmark size={14} />}
      </button>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight overflow-hidden">{drama.title}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground truncate">
          {drama.year} · {drama.episodes} eps
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1 overflow-hidden max-h-[36px]">
          {drama.tropes.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] text-foreground/90 truncate max-w-[90px]">
              {t}
            </span>
          ))}
        </div>
      </div>
      {/* Hover Preview */}
      {hovered && (
        <div className="absolute inset-x-0 bottom-0 z-20 rounded-b-2xl border-t border-primary/30 bg-surface/95 p-3 backdrop-blur animate-fade-in overflow-hidden">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground truncate">
            <Clock size={10} /> {getBingeHours(drama)}h total · {drama.pacing} pacing
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1 overflow-hidden max-h-[32px]">
            {drama.emotionalJourney.map((e) => (
              <span key={e} className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px]">{e}</span>
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1 overflow-hidden max-h-[20px]">
            {drama.moods.slice(0, 2).map((m) => (
              <span key={m} className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[9px] text-gold">{m}</span>
            ))}
          </div>
        </div>
      )}
    </Link>
  );
};