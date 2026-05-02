import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { dramas, moods, tropeCatalog, pacingOptions, getBingeHours } from "@/data/dramas";
import { PageHeader } from "@/components/PageHeader";
import { DramaCard } from "@/components/DramaCard";
import { cn } from "@/lib/utils";

export default function Discover() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedTropes, setSelectedTropes] = useState<string[]>([]);
  const [selectedPacing, setSelectedPacing] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [q, setQ] = useState("");

  const toggleMood = (id: string) =>
    setSelectedMoods((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  const toggleTrope = (id: string) =>
    setSelectedTropes((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

  const activeCount = selectedMoods.length + selectedTropes.length + (selectedPacing ? 1 : 0);

  const filtered = useMemo(() => {
    let results = [...dramas];
    if (q.trim()) {
      const term = q.toLowerCase();
      results = results.filter((d) =>
        d.title.toLowerCase().includes(term) ||
        d.genre.some((g) => g.toLowerCase().includes(term)) ||
        d.tropes.some((t) => t.toLowerCase().includes(term))
      );
    }
    if (selectedMoods.length > 0)
      results = results.filter((d) => selectedMoods.some((m) => d.moods.includes(m)));
    if (selectedTropes.length > 0)
      results = results.filter((d) => selectedTropes.some((t) => d.tropes.includes(t)));
    if (selectedPacing)
      results = results.filter((d) => d.pacing === selectedPacing);
    return results.sort((a, b) => b.rating - a.rating);
  }, [q, selectedMoods, selectedTropes, selectedPacing]);

  const clearAll = () => { setSelectedMoods([]); setSelectedTropes([]); setSelectedPacing(null); setQ(""); };

  return (
    <div className="space-y-8 px-4 pt-6 md:px-8 md:pt-8">
      <PageHeader
        title="Discover Your Drama"
        subtitle="Combine mood, trope, and pacing to find exactly what you feel like watching"
        right={
          <button onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-4 py-2 text-sm font-medium transition-colors hover:text-foreground">
            <SlidersHorizontal size={14} /> Filters {activeCount > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px]">{activeCount}</span>}
          </button>
        }
      />

      {/* Search */}
      <div className="relative max-w-lg">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, genre, trope…"
          className="w-full rounded-full border border-border bg-elevated py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary" />
      </div>

      {showFilters && (
        <div className="space-y-6 rounded-3xl border border-border bg-elevated/50 p-5 animate-fade-in">
          {/* Mood filter */}
          <div className="space-y-3">
            <p className="text-sm font-medium">🎭 How are you feeling?</p>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button key={m.id} onClick={() => toggleMood(m.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs transition-all hover:scale-105",
                    selectedMoods.includes(m.id)
                      ? "border-primary bg-primary/20 text-foreground shadow-glow"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  )}>
                  {m.emoji} {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Trope filter */}
          <div className="space-y-3">
            <p className="text-sm font-medium">📖 What tropes do you love?</p>
            <div className="flex flex-wrap gap-2">
              {tropeCatalog.map((t) => (
                <button key={t.id} onClick={() => toggleTrope(t.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs transition-all hover:scale-105",
                    selectedTropes.includes(t.id)
                      ? "border-primary bg-primary/20 text-foreground shadow-glow"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  )}>
                  {t.emoji} {t.id}
                </button>
              ))}
            </div>
          </div>

          {/* Pacing filter */}
          <div className="space-y-3">
            <p className="text-sm font-medium">⏱️ Pacing preference</p>
            <div className="flex gap-2">
              {pacingOptions.map((p) => (
                <button key={p} onClick={() => setSelectedPacing(selectedPacing === p ? null : p)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs transition-all hover:scale-105",
                    selectedPacing === p
                      ? "border-primary bg-primary/20 text-foreground shadow-glow"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  )}>
                  {p === "Fast" ? "🚀" : p === "Medium" ? "🎯" : "🕯️"} {p}
                </button>
              ))}
            </div>
          </div>

          {activeCount > 0 && (
            <button onClick={clearAll} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{filtered.length} drama{filtered.length !== 1 ? "s" : ""} found</p>
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedMoods.map((m) => {
                const mood = moods.find((x) => x.id === m);
                return <span key={m} className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px]">{mood?.emoji} {m}</span>;
              })}
              {selectedTropes.map((t) => {
                const trope = tropeCatalog.find((x) => x.id === t);
                return <span key={t} className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] text-gold">{trope?.emoji} {t}</span>;
              })}
              {selectedPacing && <span className="rounded-full bg-mood-blue/15 px-2 py-0.5 text-[10px] text-mood-blue">{selectedPacing} pacing</span>}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-5xl">🔍</span>
            <p className="text-muted-foreground">No dramas match your filters</p>
            <button onClick={clearAll} className="text-sm text-primary hover:underline">Clear filters →</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((d) => (
              <DramaCard key={d.id} drama={d} className="!w-full" />
            ))}
          </div>
        )}
      </div>

      {/* Emotional Journey Preview */}
      {activeCount > 0 && filtered.length > 0 && (
        <section className="space-y-4 rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-6">
          <h2 className="text-lg font-semibold">✨ Emotional Journeys in Your Selection</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, 6).map((d) => (
              <div key={d.id} className="rounded-2xl border border-border bg-surface/50 p-4 transition-all hover:border-primary/50">
                <div className="flex items-center gap-2">
                  <img src={d.image} alt={d.title} loading="lazy" className="h-8 w-8 rounded object-cover" />
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-[10px] text-muted-foreground">{getBingeHours(d)}h total · {d.pacing} pacing</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {d.emotionalJourney.map((emo, i) => (
                    <div key={emo} className="flex items-center gap-1">
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px]">{emo}</span>
                      {i < d.emotionalJourney.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}