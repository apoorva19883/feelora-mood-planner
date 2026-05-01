import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Play, Plus, Check, CalendarPlus, Star, ArrowLeft, Clock } from "lucide-react";
import { dramas, getBingeHours } from "@/data/dramas";
import { useAppStore } from "@/store/AppStore";
import { VideoPlayer } from "@/components/VideoPlayer";
import { DramaCard } from "@/components/DramaCard";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const fakeReacts = [
  { user: "minji_loves_kdrama", avatar: "🦋", text: "This show wrecked me in the best way 😭" },
  { user: "vincenzo_stan", avatar: "🗡️", text: "Cinematography? Unmatched. 🔥" },
  { user: "second_lead_syndrome", avatar: "💔", text: "Why does this keep hurting me?!" },
];

export default function DramaDetail() {
  const { id } = useParams();
  const drama = dramas.find((d) => d.id === Number(id));
  const { isInWatchlist, toggleWatchlist, addToPlanner, planner, watchProgress } = useAppStore();
  const [playing, setPlaying] = useState(false);

  const similar = useMemo(() => {
    if (!drama) return [];
    return dramas
      .filter((d) => d.id !== drama.id && d.tropes.some((t) => drama.tropes.includes(t)))
      .slice(0, 8);
  }, [drama]);

  if (!drama) {
    return <div className="p-8 text-muted-foreground">Drama not found. <Link className="text-primary" to="/">Go home</Link></div>;
  }

  const inList = isInWatchlist(drama.id);
  const inPlanner = planner.some((p) => p.dramaId === drama.id);
  const progress = watchProgress[drama.id];
  const hasResume = !!progress && progress.positionSec > 5 && progress.positionSec < progress.durationSec - 5;
  const fmt = (s: number) => {
    s = Math.max(0, Math.floor(s));
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-10 pb-12">
      <section className="relative h-[420px] overflow-hidden md:h-[560px]">
        <div className={cn("absolute inset-0 bg-gradient-to-br", drama.gradient)} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-[200px] opacity-90 drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)] md:text-[320px]">{drama.emoji}</div>
        <Link to="/" className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-border bg-black/40 px-3 py-1.5 text-xs backdrop-blur hover:bg-black/60 md:left-8 md:top-6"><ArrowLeft size={14} /> Back</Link>
      </section>

      <div className="-mt-32 space-y-6 px-4 md:px-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-elevated/80 px-2.5 py-1 text-[10px] uppercase tracking-wider backdrop-blur">{drama.country}</span>
            <span className="rounded-full bg-gold/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">{drama.network}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{drama.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground"><Star size={14} className="fill-gold text-gold" /> {drama.rating}</span>
            <span>·</span><span>{drama.year}</span><span>·</span><span>{drama.episodes} episodes</span>
            <span>·</span><span className="flex items-center gap-1"><Clock size={12} /> {getBingeHours(drama)}h total</span>
            <span>·</span><span>{drama.pacing} pacing</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {drama.tropes.map((t, i) => (
              <span key={t} className={cn("rounded-full px-2.5 py-1 text-xs",
                i % 3 === 0 ? "bg-primary/20 text-foreground" : i % 3 === 1 ? "bg-gold/20 text-gold" : "bg-mood-red/20 text-foreground")}>{t}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setPlaying(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-purple px-6 py-3 text-sm font-semibold shadow-glow transition-transform hover:scale-105">
            <Play size={16} className="fill-foreground" />
            {hasResume ? `Resume Ep ${progress!.episode} · ${fmt(progress!.positionSec)}` : "Watch Now"}
          </button>
          <button onClick={() => { const a = toggleWatchlist(drama.id); toast({ title: a ? "Added to watchlist" : "Removed from watchlist", description: drama.title }); }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-6 py-3 text-sm font-medium hover:bg-surface">
            {inList ? <><Check size={16} /> In Watchlist</> : <><Plus size={16} /> Add to Watchlist</>}
          </button>
          <button onClick={() => { addToPlanner(drama.id); toast({ title: "Added to planner", description: drama.title }); }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-6 py-3 text-sm font-medium hover:bg-surface">
            <CalendarPlus size={16} /> {inPlanner ? "In Planner" : "Add to Planner"}
          </button>
        </div>

        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">{drama.synopsis}</p>

        {/* Emotional Journey */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">💫 Emotional Journey</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {drama.emotionalJourney.map((emo, i) => (
              <div key={emo} className="flex items-center gap-2">
                <div className="rounded-2xl border border-border bg-elevated px-4 py-2.5 text-center transition-all hover:border-primary/50 hover:-translate-y-0.5">
                  <p className="text-sm font-medium">{emo}</p>
                </div>
                {i < drama.emotionalJourney.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {drama.moods.map((m) => (
              <span key={m} className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] text-gold">{m}</span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Cast</h2>
          <div className="flex flex-wrap gap-3">
            {drama.cast.map((c) => (
              <div key={c} className="flex items-center gap-3 rounded-2xl border border-border bg-elevated px-4 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-purple text-sm font-semibold">{c.split(" ").map((n) => n[0]).join("")}</div>
                <div><p className="text-sm font-medium">{c}</p><p className="text-xs text-muted-foreground">Cast</p></div>
              </div>
            ))}
          </div>
        </div>

        {similar.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Similar dramas</h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {similar.map((d) => <DramaCard key={d.id} drama={d} />)}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Community reactions</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {fakeReacts.map((r) => (
              <div key={r.user} className="rounded-2xl border border-border bg-elevated p-4">
                <div className="flex items-center gap-2"><span className="text-xl">{r.avatar}</span><p className="text-sm font-medium">@{r.user}</p></div>
                <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="rounded-full bg-surface px-2 py-1">❤️ {120 + r.user.length * 3}</span>
                  <span className="rounded-full bg-surface px-2 py-1">😭 {40 + r.user.length}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <VideoPlayer
        drama={drama}
        open={playing}
        onClose={() => setPlaying(false)}
        initialEpisode={hasResume ? progress!.episode : 1}
        initialPosition={hasResume ? progress!.positionSec : 0}
      />
    </div>
  );
}