import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Play, X } from "lucide-react";
import { dramas } from "@/data/dramas";
import { useAppStore, WatchlistEntry } from "@/store/AppStore";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

const tabs: { id: WatchlistEntry["status"]; label: string }[] = [
  { id: "watching", label: "Watching" },
  { id: "completed", label: "Completed" },
  { id: "want", label: "Want to Watch" },
];

export default function Watchlist() {
  const { watchlist, setStatus, toggleWatchlist, bumpProgress } = useAppStore();
  const [tab, setTab] = useState<WatchlistEntry["status"]>("watching");

  const counts = useMemo(() => {
    const c: Record<string, number> = { watching: 0, completed: 0, want: 0 };
    watchlist.forEach((w) => { c[w.status] = (c[w.status] || 0) + 1; });
    return c;
  }, [watchlist]);

  const stats = useMemo(() => {
    let hours = 0, eps = 0;
    const tropeCount: Record<string, number> = {};
    watchlist.forEach((w) => {
      const d = dramas.find((x) => x.id === w.dramaId);
      if (!d) return;
      eps += w.watched;
      hours += w.watched * 1;
      d.tropes.forEach((t) => { tropeCount[t] = (tropeCount[t] || 0) + 1; });
    });
    const topTrope = Object.entries(tropeCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    return { hours, eps, completed: counts.completed, topTrope };
  }, [watchlist, counts]);

  const filtered = watchlist.filter((w) => w.status === tab);

  return (
    <div className="space-y-8 px-4 pt-6 md:px-8 md:pt-8">
      <PageHeader title="My Watchlist" subtitle="Your dramas, your way" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Hours watched", value: stats.hours },
          { label: "Episodes watched", value: stats.eps },
          { label: "Completed", value: stats.completed },
          { label: "Top trope", value: stats.topTrope },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-elevated p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("relative px-4 py-2 text-sm transition-colors",
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t.label} ({counts[t.id] || 0})
            {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🎬" title="No dramas yet." description="Start exploring to build your list." ctaLabel="Discover dramas" ctaTo="/" />
      ) : (
        <div className="space-y-3">
          {filtered.map((w) => {
            const d = dramas.find((x) => x.id === w.dramaId)!;
            const pct = (w.watched / d.episodes) * 100;
            return (
              <div key={w.dramaId} className="flex flex-col gap-4 rounded-2xl border border-border bg-elevated p-4 sm:flex-row sm:items-center">
                <Link to={`/drama/${d.id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl"><img src={d.image} alt={d.title} loading="lazy" className="h-full w-full object-cover" /></Link>
                <div className="flex-1 space-y-2">
                  <Link to={`/drama/${d.id}`} className="block font-semibold hover:text-primary">{d.title}</Link>
                  <div className="flex flex-wrap gap-1.5">
                    {d.tropes.slice(0, 3).map((t) => <span key={t} className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px]">{t}</span>)}
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface"><div className="h-full bg-gradient-purple" style={{ width: `${pct}%` }} /></div>
                  <p className="text-xs text-muted-foreground">{w.watched} / {d.episodes} episodes</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => bumpProgress(d.id, 1)} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-purple px-4 py-2 text-xs font-medium shadow-glow"><Play size={12} className="fill-foreground" /> Continue</button>
                  <select value={w.status} onChange={(e) => setStatus(d.id, e.target.value as WatchlistEntry["status"])}
                    className="rounded-full border border-border bg-surface px-3 py-2 text-xs">
                    <option value="watching">Watching</option>
                    <option value="completed">Completed</option>
                    <option value="want">Want to watch</option>
                  </select>
                  <button onClick={() => toggleWatchlist(d.id)} className="rounded-full border border-border bg-surface p-2 text-muted-foreground hover:text-destructive"><X size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}