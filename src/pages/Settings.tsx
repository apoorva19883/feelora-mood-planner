import { useAppStore } from "@/store/AppStore";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "react-router-dom";

export default function Settings() {
  const { mood, setMood, watchlist, planner } = useAppStore();
  return (
    <div className="space-y-6 px-4 pt-6 md:px-8 md:pt-8">
      <PageHeader title="Settings" subtitle="Manage your Feelora experience" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-elevated p-5">
          <p className="text-sm font-medium">Current mood</p>
          <p className="mt-1 text-xs text-muted-foreground">{mood ?? "Not set"}</p>
          <Link to="/mood" className="mt-3 inline-block text-xs text-primary hover:underline">Update mood →</Link>
        </div>
        <div className="rounded-2xl border border-border bg-elevated p-5">
          <p className="text-sm font-medium">Library</p>
          <p className="mt-1 text-xs text-muted-foreground">{watchlist.length} in watchlist · {planner.length} planned</p>
          <button onClick={() => { localStorage.clear(); setMood(null); location.reload(); }}
            className="mt-3 rounded-full border border-border bg-surface px-3 py-1.5 text-xs hover:text-destructive">Reset all data</button>
        </div>
      </div>
    </div>
  );
}