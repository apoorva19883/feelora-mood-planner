import { useState } from "react";
import { Send, Shield } from "lucide-react";
import { fakeReactions, hotTopics, dramas } from "@/data/dramas";
import { useAppStore } from "@/store/AppStore";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

const tabs = ["Live reactions", "Theories", "Second lead", "Fan art", "News"];
const emojis = ["❤️", "😭", "🔥", "💔", "💯", "🦋"];

export default function Community() {
  const { reactions, bumpReaction } = useAppStore();
  const [tab, setTab] = useState(tabs[0]);
  const [spoilerShield, setSpoilerShield] = useState(true);
  const [text, setText] = useState("");

  const topDiscussed = [...dramas].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="space-y-6 px-4 pt-6 md:px-8 md:pt-8">
      <PageHeader title="Community"
        right={<span className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5 text-xs"><span className="h-2 w-2 animate-pulse rounded-full bg-mood-red" /> 1,284 online now</span>} />

      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border pb-px">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("relative shrink-0 px-3 py-2 text-sm",
              tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t}{tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr_240px]">
        <aside className="hidden space-y-2 lg:block">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Hot topics</p>
          {hotTopics.map((h) => (
            <button key={h} className="block w-full rounded-xl border border-border bg-elevated px-3 py-2 text-left text-sm hover:border-primary">{h}</button>
          ))}
        </aside>

        <div className="space-y-3">
          {fakeReactions.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-elevated p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-purple text-base">{r.avatar}</div>
                <div><p className="text-sm font-medium">@{r.user}</p><p className="text-[11px] text-muted-foreground">on {r.drama}</p></div>
              </div>
              <p className={cn("mt-2 text-sm", spoilerShield && r.text.length > 80 ? "blur-sm hover:blur-none" : "")}>{r.text}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Object.entries(reactions[r.id] ?? r.reactions).map(([emoji, count]) => (
                  <button key={emoji} onClick={() => bumpReaction(r.id, emoji)}
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs transition-colors hover:border-primary hover:text-primary">
                    {emoji} {count}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="sticky bottom-20 mt-4 flex items-center gap-2 rounded-full border border-border bg-elevated p-2 md:bottom-4">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your reaction…"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none" />
            <div className="flex gap-1">{emojis.slice(0, 3).map((e) => <button key={e} onClick={() => setText((t) => t + e)} className="text-base">{e}</button>)}</div>
            <button onClick={() => { if (text.trim()) { bumpReaction(fakeReactions[0].id, "❤️"); setText(""); } }}
              className="grid h-9 w-9 place-items-center rounded-full bg-gradient-purple shadow-glow"><Send size={14} /></button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-elevated p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Most discussed today</p>
            <div className="mt-3 space-y-2">
              {topDiscussed.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  <img src={d.image} alt={d.title} className="h-9 w-9 rounded-lg object-cover" />
                  <span className="text-sm">{d.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-elevated p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm"><Shield size={14} /> Spoiler shield</div>
              <button onClick={() => setSpoilerShield(!spoilerShield)}
                className={cn("h-6 w-10 rounded-full transition-colors", spoilerShield ? "bg-primary" : "bg-surface")}>
                <span className={cn("block h-5 w-5 translate-y-0.5 rounded-full bg-foreground transition-transform", spoilerShield ? "translate-x-4" : "translate-x-0.5")} />
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-elevated p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Active fans</p>
            <div className="mt-3 flex -space-x-2">
              {fakeReactions.slice(0, 6).map((r) => (
                <div key={r.id} className="grid h-8 w-8 place-items-center rounded-full border-2 border-elevated bg-gradient-purple text-sm">{r.avatar}</div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}