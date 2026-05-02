import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Drama, getEpisodeTitle } from "@/data/dramas";
import { Play, Pause, Volume2, VolumeX, Maximize, X, Heart, RotateCcw, RotateCw } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { cn } from "@/lib/utils";

const EPISODE_DURATION = 60 * 61; // 61 minutes in seconds (mock)
const PLAYBACK_SPEEDUP = 60; // 1 real sec = 60 video sec, so a 61m episode plays in ~61s
const INACTIVITY_PROMPT_MS = 10 * 60 * 1000; // 10 minutes
const CONTROLS_HIDE_MS = 3000;
const AUTOPLAY_COUNTDOWN = 5;

const fmt = (s: number) => {
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export const VideoPlayer = ({ drama, open, onClose, initialEpisode = 1, initialPosition = 0 }: { drama: Drama; open: boolean; onClose: () => void; initialEpisode?: number; initialPosition?: number }) => {
  const { bumpProgress, saveWatchProgress, isLiked, toggleLike } = useAppStore();
  const [episode, setEpisode] = useState(initialEpisode);
  const [position, setPosition] = useState(initialPosition); // seconds
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showInactivityPrompt, setShowInactivityPrompt] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const [autoplayCountdown, setAutoplayCountdown] = useState<number | null>(null);
  const [episodeProgress, setEpisodeProgress] = useState<Record<number, number>>({});

  const playerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const tickRef = useRef<number>(Date.now());

  const duration = EPISODE_DURATION;
  const liked = isLiked(drama.id);

  // Reset on open
  useEffect(() => {
    if (open) {
      setEpisode(initialEpisode);
      setPosition(initialPosition);
      setPlaying(true);
      setShowInactivityPrompt(false);
      setAutoplayCountdown(null);
      lastActivityRef.current = Date.now();
      tickRef.current = Date.now();
    } else {
      setPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Playback ticker
  useEffect(() => {
    if (!open || !playing || autoplayCountdown !== null) return;
    tickRef.current = Date.now();
    const i = window.setInterval(() => {
      const now = Date.now();
      const delta = ((now - tickRef.current) / 1000) * PLAYBACK_SPEEDUP;
      tickRef.current = now;
      setPosition((p) => {
        const next = p + delta;
        if (next >= duration) {
          setPlaying(false);
          setAutoplayCountdown(AUTOPLAY_COUNTDOWN);
          return duration;
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(i);
  }, [open, playing, autoplayCountdown, duration]);

  // Track per-episode progress
  useEffect(() => {
    setEpisodeProgress((prev) => ({ ...prev, [episode]: Math.max(prev[episode] ?? 0, position / duration) }));
  }, [position, episode, duration]);

  // Persist watch progress periodically
  useEffect(() => {
    if (!open) return;
    const i = window.setInterval(() => {
      saveWatchProgress(drama.id, {
        episode,
        positionSec: position,
        durationSec: duration,
        updatedAt: new Date().toISOString(),
      });
    }, 3000);
    return () => window.clearInterval(i);
  }, [open, drama.id, episode, position, duration, saveWatchProgress]);

  // Inactivity detection (10 min) + control auto-hide (3s)
  useEffect(() => {
    if (!open) return;
    const markActivity = () => {
      lastActivityRef.current = Date.now();
      setShowControls(true);
      setShowInactivityPrompt(false);
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "wheel"];
    events.forEach((e) => window.addEventListener(e, markActivity));
    const check = window.setInterval(() => {
      const idle = Date.now() - lastActivityRef.current;
      if (idle > CONTROLS_HIDE_MS && playing) setShowControls(false);
      if (idle > INACTIVITY_PROMPT_MS && playing) {
        setPlaying(false);
        setShowInactivityPrompt(true);
      }
    }, 1000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, markActivity));
      window.clearInterval(check);
    };
  }, [open, playing]);

  // Autoplay next episode countdown
  useEffect(() => {
    if (autoplayCountdown === null) return;
    if (autoplayCountdown <= 0) {
      const hasNext = episode < drama.episodes;
      if (hasNext) {
        setEpisode((e) => e + 1);
        setPosition(0);
        setPlaying(true);
        bumpProgress(drama.id, 1);
      }
      setAutoplayCountdown(null);
      return;
    }
    const t = window.setTimeout(() => setAutoplayCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [autoplayCountdown, episode, drama.episodes, drama.id, bumpProgress]);

  const seekBy = useCallback((delta: number) => {
    setPosition((p) => Math.min(duration, Math.max(0, p + delta)));
  }, [duration]);

  const togglePlay = useCallback(() => {
    setShowInactivityPrompt(false);
    setPlaying((p) => !p);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return handleClose();
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); seekBy(-10); }
      if (e.key === "ArrowRight") { e.preventDefault(); seekBy(10); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, togglePlay, seekBy]);

  const handleClose = useCallback(() => {
    saveWatchProgress(drama.id, {
      episode,
      positionSec: position,
      durationSec: duration,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  }, [drama.id, episode, position, duration, saveWatchProgress, onClose]);

  const switchEpisode = useCallback((n: number) => {
    setEpisode(n);
    setPosition(0);
    setPlaying(true);
    setShowInactivityPrompt(false);
    setAutoplayCountdown(null);
  }, []);

  const onBarMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = barRef.current?.getBoundingClientRect();
    if (!r) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setHoverTime(ratio * duration);
    setHoverX(e.clientX - r.left);
  };

  const onBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = barRef.current?.getBoundingClientRect();
    if (!r) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setPosition(ratio * duration);
  };

  const requestFullscreen = () => {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const episodes = useMemo(() => Array.from({ length: drama.episodes }, (_, i) => i + 1), [drama.episodes]);
  if (!open) return null;

  const progressPct = (position / duration) * 100;
  const controlsVisible = showControls || !playing || showInactivityPrompt;

  return (
    <div ref={playerRef} className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-fade-in" style={{ cursor: controlsVisible ? "default" : "none" }}>
      {/* Top bar */}
      <div className={cn("flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3 transition-opacity duration-300 md:px-6", controlsVisible ? "opacity-100" : "opacity-0")}>
        <button onClick={handleClose} className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
          <X size={14} /> Back to drama
        </button>
        <div className="flex min-w-0 items-center gap-3 text-center">
          <img src={drama.image} alt={drama.title} className="h-8 w-8 rounded object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{drama.title}</p>
            <p className="text-xs text-muted-foreground">Ep {episode}: {getEpisodeTitle(drama, episode)}</p>
            <div className="mt-1 hidden flex-wrap justify-center gap-1 md:flex">
              {drama.tropes.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-foreground/80">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => toggleLike(drama.id)} className={cn("grid h-9 w-9 place-items-center rounded-full border transition-colors", liked ? "border-primary bg-primary/20 text-primary" : "border-border bg-elevated text-muted-foreground hover:text-foreground")}>
          <Heart size={16} className={cn(liked && "fill-primary")} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Stage */}
        <div className="relative flex flex-1 items-center justify-center" onDoubleClick={requestFullscreen}>
          <img src={drama.image} alt={drama.title} className="absolute inset-6 rounded-3xl object-cover" />
          <div className="absolute inset-6 rounded-3xl bg-gradient-to-t from-black/70 via-transparent" />

          {/* Center play tap target */}
          <button onClick={togglePlay} className="absolute inset-0" aria-label="Toggle play" />

          {/* Inactivity prompt */}
          {showInactivityPrompt && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 animate-fade-in">
              <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-glow">
                <p className="text-lg font-semibold">Continue watching?</p>
                <p className="mt-1 text-sm text-muted-foreground">You've been away for a while.</p>
                <div className="mt-4 flex justify-center gap-2">
                  <button onClick={() => { setShowInactivityPrompt(false); setPlaying(true); lastActivityRef.current = Date.now(); }} className="rounded-full bg-gradient-purple px-4 py-2 text-sm font-medium shadow-glow">Resume</button>
                  <button onClick={handleClose} className="rounded-full border border-border bg-elevated px-4 py-2 text-sm">Exit</button>
                </div>
              </div>
            </div>
          )}

          {/* Autoplay countdown */}
          {autoplayCountdown !== null && episode < drama.episodes && (
            <div className="absolute bottom-24 right-6 z-10 flex items-center gap-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-glow animate-fade-in">
              <div className="relative h-12 w-12">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="16" fill="none"
                    stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={(2 * Math.PI * 16) * (1 - autoplayCountdown / AUTOPLAY_COUNTDOWN)}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-sm font-semibold">{autoplayCountdown}</div>
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Up next</p>
                <p className="text-sm font-medium">Ep {episode + 1}: {getEpisodeTitle(drama, episode + 1)}</p>
              </div>
              <button onClick={() => setAutoplayCountdown(null)} className="rounded-full border border-border bg-elevated px-3 py-1.5 text-xs hover:text-foreground text-muted-foreground">Cancel</button>
            </div>
          )}

          {/* Bottom controls */}
          <div className={cn("absolute inset-x-6 bottom-6 z-10 space-y-3 transition-opacity duration-300", controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none")}>
            {/* Progress bar */}
            <div className="relative">
              <div
                ref={barRef}
                onClick={onBarClick}
                onMouseMove={onBarMove}
                onMouseLeave={() => setHoverTime(null)}
                className="group relative h-2 w-full cursor-pointer overflow-visible rounded-full bg-white/20"
              >
                <div className="h-full rounded-full bg-gradient-purple transition-[width] duration-150" style={{ width: `${progressPct}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-primary opacity-0 shadow-glow transition-opacity group-hover:opacity-100" style={{ left: `calc(${progressPct}% - 7px)` }} />
              </div>
              {hoverTime !== null && (
                <div className="pointer-events-none absolute -top-9 -translate-x-1/2 rounded-md bg-elevated/95 px-2 py-1 text-[11px] text-foreground shadow" style={{ left: hoverX }}>
                  {fmt(hoverTime)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} className="grid h-12 w-12 place-items-center rounded-full bg-gradient-purple shadow-glow">
                  {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>
                <button onClick={() => seekBy(-10)} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-elevated/80 text-muted-foreground hover:text-foreground" aria-label="Rewind 10 seconds">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => seekBy(10)} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-elevated/80 text-muted-foreground hover:text-foreground" aria-label="Forward 10 seconds">
                  <RotateCw size={16} />
                </button>
                <span className="ml-2 text-xs tabular-nums text-muted-foreground">{fmt(position)} / {fmt(duration)}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <button onClick={() => setMuted((m) => !m)} aria-label="Toggle mute" className="hover:text-foreground">
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={requestFullscreen} aria-label="Fullscreen" className="hover:text-foreground">
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Episode sidebar */}
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-border/50 bg-surface/60 p-4 md:block">
          <h3 className="mb-3 text-sm font-semibold">Episodes</h3>
          <div className="space-y-1.5">
            {episodes.map((n) => {
              const isActive = n === episode;
              const epPct = isActive ? progressPct : (episodeProgress[n] ?? 0) * 100;
              return (
                <button
                  key={n}
                  onClick={() => switchEpisode(n)}
                  className={cn(
                    "block w-full rounded-xl border px-3 py-2 text-left transition-colors",
                    isActive ? "border-primary bg-primary/15" : "border-border bg-elevated text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn("font-medium", isActive && "text-foreground")}>Ep {n} · {getEpisodeTitle(drama, n)}</span>
                    <span className="text-[11px]">{60 + (n % 7)}m</span>
                  </div>
                  {epPct > 0 && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-purple" style={{ width: `${Math.min(100, epPct)}%` }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};