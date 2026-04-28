import { useEffect, useMemo, useRef, useState } from "react";
import { Drama } from "@/data/dramas";
import { Play, Pause, Volume2, Maximize, X } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { cn } from "@/lib/utils";

export const VideoPlayer = ({ drama, open, onClose }: { drama: Drama; open: boolean; onClose: () => void }) => {
  const [episode, setEpisode] = useState(1);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const startedRef = useRef<number | null>(null);
  const baseRef = useRef(0);
  const { bumpProgress } = useAppStore();

  useEffect(() => { if (!open) { setPlaying(false); setProgress(0); setShowResume(false); } }, [open]);

  useEffect(() => {
    if (!playing) return;
    startedRef.current = Date.now();
    baseRef.current = progress;
    const i = setInterval(() => {
      const elapsed = (Date.now() - (startedRef.current ?? Date.now())) / 1000;
      const next = Math.min(100, baseRef.current + (elapsed / 5) * 50);
      setProgress(next);
      if (elapsed >= 5) { setPlaying(false); setShowResume(true); bumpProgress(drama.id, 1); }
    }, 100);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const episodes = useMemo(() => Array.from({ length: drama.episodes }, (_, i) => i + 1), [drama.episodes]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3 md:px-6">
        <button onClick={onClose} className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
          <X size={14} /> Back to drama
        </button>
        <div className="text-center">
          <p className="text-sm font-medium">{drama.title}</p>
          <p className="text-xs text-muted-foreground">Episode {episode} of {drama.episodes}</p>
        </div>
        <div className="w-24" />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex flex-1 items-center justify-center">
          <div className={cn("absolute inset-6 rounded-3xl bg-gradient-to-br", drama.gradient)} />
          <div className="absolute inset-6 rounded-3xl bg-gradient-to-t from-black/70 via-transparent" />
          <div className="relative text-[140px] drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)] md:text-[220px]">{drama.emoji}</div>
          {showResume && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 animate-fade-in">
              <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-glow">
                <p className="text-lg font-semibold">Continue watching?</p>
                <p className="mt-1 text-sm text-muted-foreground">You've been watching for a while.</p>
                <div className="mt-4 flex justify-center gap-2">
                  <button onClick={() => { setShowResume(false); setProgress(0); setPlaying(true); }} className="rounded-full bg-gradient-purple px-4 py-2 text-sm font-medium shadow-glow">Resume</button>
                  <button onClick={onClose} className="rounded-full border border-border bg-elevated px-4 py-2 text-sm">Exit</button>
                </div>
              </div>
            </div>
          )}
          <div className="absolute inset-x-6 bottom-10 space-y-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-gradient-purple transition-[width] duration-100" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center justify-between text-foreground">
              <button onClick={() => { setShowResume(false); setPlaying((p) => !p); }} className="grid h-12 w-12 place-items-center rounded-full bg-gradient-purple shadow-glow">
                {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <div className="flex items-center gap-3 text-muted-foreground"><Volume2 size={18} /><Maximize size={18} /></div>
            </div>
          </div>
        </div>
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-border/50 bg-surface/60 p-4 md:block">
          <h3 className="mb-3 text-sm font-semibold">Episodes</h3>
          <div className="space-y-1.5">
            {episodes.map((n) => (
              <button key={n} onClick={() => { setEpisode(n); setProgress(0); setPlaying(false); setShowResume(false); }}
                className={cn("flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                  n === episode ? "border-primary bg-primary/15" : "border-border bg-elevated text-muted-foreground hover:text-foreground")}>
                <span>Episode {n}</span><span className="text-[11px]">{60 + (n % 7)}m</span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};