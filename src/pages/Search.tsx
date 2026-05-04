import { useMemo, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { dramas } from "@/data/dramas";
import { useAppStore } from "@/store/AppStore";
import { DramaCard } from "@/components/DramaCard";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

const filters = ["All", "K-Drama", "C-Drama", "Romance", "Thriller", "Historical", "Fantasy"];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const { recentSearches, pushRecentSearch } = useAppStore();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return dramas.filter((d) => {
      if (term && !d.title.toLowerCase().includes(term)) return false;
      if (filter === "All") return true;
      if (filter === "K-Drama" || filter === "C-Drama") return d.country === filter;
      return d.genre.includes(filter);
    });
  }, [q, filter]);

  return (
    <div className="space-y-6 px-4 pt-6 md:px-8 md:pt-8">
      <div className="relative">
        <SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pushRecentSearch(q)}
          placeholder="Search dramas, casts, networks…"
          className="w-full rounded-2xl border border-border bg-elevated py-4 pl-12 pr-12 text-base outline-none focus:border-primary" />
        {q && <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={16} /></button>}
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-xs",
              filter === f ? "border-primary bg-primary/15" : "border-border bg-elevated text-muted-foreground hover:text-foreground")}>{f}</button>
        ))}
      </div>
      {!q && recentSearches.length > 0 && (
        <div className="flex flex-wrap gap-2"><span className="text-xs text-muted-foreground">Recent:</span>
          {recentSearches.map((r) => <button key={r} onClick={() => setQ(r)} className="rounded-full border border-border bg-elevated px-3 py-1 text-xs hover:text-primary">{r}</button>)}
        </div>
      )}
      {results.length === 0 ? (
        <EmptyState emoji="🔍" title={`No results for "${q}"`} description="Try browsing by trope instead." ctaLabel="Browse tropes" ctaTo="/tropes" />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((d) => <DramaCard key={d.id} drama={d} size="lg" className="!h-[288px]" />)}
        </div>
      )}
    </div>
  );
}