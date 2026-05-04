import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { dramas, tropeCatalog } from "@/data/dramas";
import { PageHeader } from "@/components/PageHeader";
import { DramaCard } from "@/components/DramaCard";
import { cn } from "@/lib/utils";

export default function Tropes() {
  const [active, setActive] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    tropeCatalog.forEach((t) => {
      m[t.id] = dramas.filter((d) => d.tropes.includes(t.id)).length;
    });
    return m;
  }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return tropeCatalog.filter((t) => t.id.toLowerCase().includes(term));
  }, [q]);

  const list = active ? dramas.filter((d) => d.tropes.includes(active)) : [];

  return (
    <div className="space-y-8 px-4 pt-6 md:px-8 md:pt-8">
      <PageHeader title="Browse by Trope" subtitle="Find dramas by the patterns you love" />
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tropes…"
          className="w-full rounded-full border border-border bg-elevated py-3 pl-11 pr-4 text-sm outline-none focus:border-primary" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {filtered.map((t) => (
          <button key={t.id} onClick={() => setActive(t.id === active ? null : t.id)}
            className={cn("group relative h-40 overflow-hidden rounded-2xl border p-4 text-left transition-all hover:-translate-y-1 hover:shadow-glow",
              active === t.id ? "border-primary" : "border-border")}>
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", t.gradient)} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative flex h-full flex-col justify-between">
              <span className="text-3xl">{t.emoji}</span>
              <div>
                <p className="text-sm font-semibold">{t.id}</p>
                <p className="text-xs text-foreground/80">{counts[t.id] ?? 0} dramas</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {active && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Dramas with “{active}”</h2>
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">No dramas yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {list.map((d) => <DramaCard key={d.id} drama={d} size="lg" className="!h-[288px]" />)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}