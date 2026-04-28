import { useMemo, useState } from "react";
import { Zap, Plus, X } from "lucide-react";
import { dramas } from "@/data/dramas";
import { useAppStore } from "@/store/AppStore";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Planner() {
  const { planner, addToPlanner, removeFromPlanner, updatePlanner, bingeMode, setBingeMode } = useAppStore();
  const [picking, setPicking] = useState(false);
  const [q, setQ] = useState("");

  const todayIdx = (new Date().getDay() + 6) % 7;
  const plannedSet = useMemo(() => new Set(planner.map((p) => p.dramaId)), [planner]);
  const candidates = dramas.filter((d) => !plannedSet.has(d.id) && d.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-8 px-4 pt-6 md:px-8 md:pt-8">
      <PageHeader title="Binge Planner" subtitle="Schedule your watch sessions"
        right={
          <button onClick={() => setBingeMode(!bingeMode)}
            className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              bingeMode ? "border-gold bg-gold/15 text-gold" : "border-border bg-elevated text-muted-foreground hover:text-foreground")}>
            <Zap size={14} className={bingeMode ? "fill-gold" : ""} /> Binge Mode {bingeMode ? "On" : "Off"}
          </button>
        } />

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const planned = planner.length > 0 && (i === todayIdx || (bingeMode && i >= todayIdx));
          return (
            <div key={d} className={cn("rounded-2xl border p-3 text-center text-xs",
              i === todayIdx ? "border-primary bg-primary/15" : planned ? "border-border bg-primary/10" : "border-border bg-elevated")}>
              <p className="text-muted-foreground">{d}</p>
              <p className="mt-1 text-base font-semibold">{new Date(Date.now() + (i - todayIdx) * 86400000).getDate()}</p>
              {planned && <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Currently planning</h2>
        <button onClick={() => setPicking(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-purple px-4 py-2 text-sm font-medium shadow-glow"><Plus size={14} /> Add drama</button>
      </div>

      {planner.length === 0 ? (
        <EmptyState emoji="📅" title="Nothing planned yet." description="Add a drama to start binging." ctaLabel="Browse dramas" ctaTo="/" />
      ) : (
        <div className="space-y-3">
          {planner.map((p) => {
            const d = dramas.find((x) => x.id === p.dramaId)!;
            const remaining = Math.max(0, d.episodes - p.watched);
            const weeks = p.episodesPerWeek > 0 ? Math.ceil(remaining / p.episodesPerWeek) : 0;
            const finish = new Date(Date.now() + weeks * 7 * 86400000).toLocaleDateString(undefined, { month: "short", day: "numeric" });
            const pct = (p.watched / d.episodes) * 100;
            return (
              <div key={p.dramaId} className="flex flex-col gap-4 rounded-2xl border border-border bg-elevated p-4 sm:flex-row sm:items-center">
                <div className={cn("relative grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-3xl", d.gradient)}>{d.emoji}</div>
                <div className="flex-1 space-y-2">
                  <p className="font-semibold">{d.title}</p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface"><div className="h-full bg-gradient-purple" style={{ width: `${pct}%` }} /></div>
                  <p className="text-xs text-muted-foreground">{p.watched} / {d.episodes} episodes · finish ~ {finish}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">Eps/wk</label>
                  <input type="number" min={1} max={20} value={p.episodesPerWeek}
                    onChange={(e) => updatePlanner(p.dramaId, { episodesPerWeek: Math.max(1, Number(e.target.value)) })}
                    className="w-16 rounded-lg border border-border bg-surface px-2 py-1 text-sm" />
                  <button onClick={() => updatePlanner(p.dramaId, { watched: Math.min(d.episodes, p.watched + 1) })}
                    className="rounded-lg border border-border bg-surface px-3 py-1 text-xs hover:text-primary">+1 ep</button>
                  <button onClick={() => removeFromPlanner(p.dramaId)} className="rounded-lg border border-border bg-surface p-1.5 text-muted-foreground hover:text-destructive"><X size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {picking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur" onClick={() => setPicking(false)}>
          <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-5 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="font-semibold">Add drama to planner</h3><button onClick={() => setPicking(false)}><X size={16} /></button></div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="mt-3 w-full rounded-xl border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-primary" />
            <div className="mt-3 max-h-80 space-y-1.5 overflow-y-auto">
              {candidates.slice(0, 12).map((d) => (
                <button key={d.id} onClick={() => { addToPlanner(d.id); setPicking(false); setQ(""); }}
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-elevated p-2 text-left hover:border-primary">
                  <span className={cn("grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br text-xl", d.gradient)}>{d.emoji}</span>
                  <div className="flex-1"><p className="text-sm font-medium">{d.title}</p><p className="text-xs text-muted-foreground">{d.country} · {d.episodes} eps</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}