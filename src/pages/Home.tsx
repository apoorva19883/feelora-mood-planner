import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Plus, Check, Star, Clock } from "lucide-react";
import { dramas, moods, getBingeHours } from "@/data/dramas";
import { useAppStore } from "@/store/AppStore";
import { DramaRow } from "@/components/DramaRow";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Home() {
  const { mood, setMood, isInWatchlist, toggleWatchlist } = useAppStore();
  const navigate = useNavigate();
  const [activeMood, setActiveMood] = useState<string | null>(mood);

  const hero = useMemo(
    () => [...dramas].sort((a, b) => b.rating - a.rating)[0],
    [],
  );

  const matched = useMemo(() => {
    if (!activeMood) return [];
    return dramas.filter((d) => d.moods.includes(activeMood));
  }, [activeMood]);

  const trendingK = useMemo(
    () => dramas.filter((d) => d.country === "K-Drama").sort((a, b) => b.rating - a.rating).slice(0, 10),
    [],
  );
  const topC = useMemo(
    () => dramas.filter((d) => d.country === "C-Drama").sort((a, b) => b.rating - a.rating),
    [],
  );

  const heroIn = isInWatchlist(hero.id);
  const moodMeta = moods.find((m) => m.id === activeMood);

  return (
    <div className="space-y-10 px-4 pt-6 md:px-8 md:pt-8">
      {/* Hero */}
      <section className="relative h-[460px] overflow-hidden rounded-3xl border border-border md:h-[560px]">
        <div className={cn("absolute inset-0 bg-gradient-to-br", hero.gradient)} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 text-[220px] opacity-90 drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)] md:block">
          {hero.emoji}
        </div>
        <div className="relative z-10 flex h-full max-w-2xl flex-col justify-end p-6 md:p-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-gold/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
              ★ Top Rated
            </span>
            <span className="rounded-full border border-border bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider backdrop-blur">
              {hero.country}
            </span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {hero.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground"><Star size={14} className="fill-gold text-gold" /> {hero.rating}</span>
            <span>·</span>
            <span>{hero.year}</span>
            <span>·</span>
            <span>{hero.episodes} episodes</span>
            <span>·</span>
            <span>{hero.network}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {hero.genre.map((g) => (
              <span key={g} className="rounded-full border border-border bg-elevated/80 px-2.5 py-1 text-xs">
                {g}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock size={12} /> {getBingeHours(hero)}h to binge</span>
            <span>·</span>
            <span>{hero.pacing} pacing</span>
          </div>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">{hero.synopsis}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hero.emotionalJourney.map((e) => (
              <span key={e} className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px]">{e}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/drama/${hero.id}`)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-purple px-6 py-3 text-sm font-semibold shadow-glow transition-transform hover:scale-105"
            >
              <Play size={16} className="fill-foreground" /> Watch Now
            </button>
            <button
              onClick={() => {
                const added = toggleWatchlist(hero.id);
                toast({ title: added ? "Added to watchlist" : "Removed from watchlist", description: hero.title });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated/70 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-elevated"
            >
              {heroIn ? <><Check size={16} /> In Watchlist</> : <><Plus size={16} /> Watchlist</>}
            </button>
          </div>
        </div>
      </section>

      {/* Mood pills */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Pick a mood</p>
          <Link to="/mood" className="text-xs text-primary hover:underline">Open mood check-in →</Link>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveMood(null); setMood(null); }}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              !activeMood ? "border-primary bg-primary/15 text-foreground" : "border-border bg-elevated text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => { setActiveMood(m.id); setMood(m.id); }}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                activeMood === m.id
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border bg-elevated text-muted-foreground hover:text-foreground",
              )}
            >
              {m.emoji} {m.name}
            </button>
          ))}
        </div>
      </section>

      {activeMood && matched.length > 0 && (
        <DramaRow title={<>{moodMeta?.emoji} Matched to your mood</>} dramas={matched} />
      )}

      <DramaRow title="🔥 Trending K-Dramas" dramas={trendingK} />
      <DramaRow title="🐉 Top C-Dramas" dramas={topC} />

      <DramaRow title="✨ Hidden Gems" dramas={[...dramas].sort(() => 0.5 - Math.random()).slice(0, 8)} />

      {/* Emotional Journey Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold md:text-xl">💫 Emotional Journeys</h2>
          <Link to="/discover" className="text-xs text-primary hover:underline">Discover more →</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {dramas.slice(0, 6).map((d) => (
            <Link key={d.id} to={`/drama/${d.id}`}
              className="group rounded-2xl border border-border bg-elevated p-4 transition-all hover:border-primary/50 hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{d.emoji}</span>
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{d.title}</p>
                  <p className="text-[10px] text-muted-foreground">{getBingeHours(d)}h · {d.pacing}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 overflow-x-auto">
                {d.emotionalJourney.map((emo, i) => (
                  <div key={emo} className="flex items-center gap-1 shrink-0">
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px]">{emo}</span>
                    {i < d.emotionalJourney.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}