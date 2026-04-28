import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { fakeReactions } from "@/data/dramas";

export interface PlannerEntry {
  dramaId: number;
  episodesPerWeek: number;
  watched: number;
  startedAt: string; // ISO date
}

export interface WatchlistEntry {
  dramaId: number;
  status: "watching" | "completed" | "want";
  watched: number;
  addedAt: string;
}

type ReactionMap = Record<number, Record<string, number>>;

export interface WatchProgress {
  episode: number;
  positionSec: number;
  durationSec: number;
  updatedAt: string;
}
export type WatchProgressMap = Record<number, WatchProgress>;

interface AppState {
  mood: string | null;
  setMood: (m: string | null) => void;

  watchlist: WatchlistEntry[];
  toggleWatchlist: (id: number) => boolean;
  isInWatchlist: (id: number) => boolean;
  setStatus: (id: number, status: WatchlistEntry["status"]) => void;
  bumpProgress: (id: number, by?: number) => void;

  planner: PlannerEntry[];
  addToPlanner: (id: number, epsPerWeek?: number) => void;
  removeFromPlanner: (id: number) => void;
  updatePlanner: (id: number, patch: Partial<PlannerEntry>) => void;

  recentSearches: string[];
  pushRecentSearch: (q: string) => void;

  reactions: ReactionMap;
  bumpReaction: (id: number, emoji: string) => void;

  bingeMode: boolean;
  setBingeMode: (v: boolean) => void;

  watchProgress: WatchProgressMap;
  saveWatchProgress: (id: number, p: WatchProgress) => void;
  clearWatchProgress: (id: number) => void;

  likedDramas: number[];
  toggleLike: (id: number) => boolean;
  isLiked: (id: number) => boolean;
}

const Ctx = createContext<AppState | null>(null);

const initialReactions: ReactionMap = Object.fromEntries(
  fakeReactions.map((r) => [r.id, { ...r.reactions }]),
);

export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const [mood, setMood] = useLocalStorage<string | null>("feelora.mood", null);
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistEntry[]>("feelora.watchlist", []);
  const [planner, setPlanner] = useLocalStorage<PlannerEntry[]>("feelora.planner", []);
  const [recentSearches, setRecent] = useLocalStorage<string[]>("feelora.recent", []);
  const [reactions, setReactions] = useLocalStorage<ReactionMap>("feelora.reactions", initialReactions);
  const [bingeMode, setBingeMode] = useLocalStorage<boolean>("feelora.binge", false);
  const [watchProgress, setWatchProgress] = useLocalStorage<WatchProgressMap>("feelora.progress", {});
  const [likedDramas, setLiked] = useLocalStorage<number[]>("feelora.liked", []);

  const saveWatchProgress = useCallback(
    (id: number, p: WatchProgress) =>
      setWatchProgress((prev) => ({ ...prev, [id]: p })),
    [setWatchProgress],
  );
  const clearWatchProgress = useCallback(
    (id: number) =>
      setWatchProgress((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      }),
    [setWatchProgress],
  );
  const isLiked = useCallback((id: number) => likedDramas.includes(id), [likedDramas]);
  const toggleLike = useCallback(
    (id: number) => {
      let liked = false;
      setLiked((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        liked = true;
        return [...prev, id];
      });
      return liked;
    },
    [setLiked],
  );

  const isInWatchlist = useCallback(
    (id: number) => watchlist.some((w) => w.dramaId === id),
    [watchlist],
  );

  const toggleWatchlist = useCallback(
    (id: number) => {
      let added = false;
      setWatchlist((prev) => {
        if (prev.some((w) => w.dramaId === id)) {
          return prev.filter((w) => w.dramaId !== id);
        }
        added = true;
        return [
          ...prev,
          { dramaId: id, status: "want", watched: 0, addedAt: new Date().toISOString() },
        ];
      });
      return added;
    },
    [setWatchlist],
  );

  const setStatus = useCallback(
    (id: number, status: WatchlistEntry["status"]) => {
      setWatchlist((prev) => {
        const existing = prev.find((w) => w.dramaId === id);
        if (!existing) {
          return [...prev, { dramaId: id, status, watched: 0, addedAt: new Date().toISOString() }];
        }
        return prev.map((w) => (w.dramaId === id ? { ...w, status } : w));
      });
    },
    [setWatchlist],
  );

  const bumpProgress = useCallback(
    (id: number, by = 1) => {
      setWatchlist((prev) => {
        const existing = prev.find((w) => w.dramaId === id);
        if (!existing) {
          return [
            ...prev,
            { dramaId: id, status: "watching", watched: by, addedAt: new Date().toISOString() },
          ];
        }
        return prev.map((w) =>
          w.dramaId === id
            ? { ...w, watched: Math.max(0, w.watched + by), status: w.status === "want" ? "watching" : w.status }
            : w,
        );
      });
    },
    [setWatchlist],
  );

  const addToPlanner = useCallback(
    (id: number, epsPerWeek = 4) => {
      setPlanner((prev) => {
        if (prev.some((p) => p.dramaId === id)) return prev;
        return [
          ...prev,
          { dramaId: id, episodesPerWeek: epsPerWeek, watched: 0, startedAt: new Date().toISOString() },
        ];
      });
    },
    [setPlanner],
  );

  const removeFromPlanner = useCallback(
    (id: number) => setPlanner((prev) => prev.filter((p) => p.dramaId !== id)),
    [setPlanner],
  );

  const updatePlanner = useCallback(
    (id: number, patch: Partial<PlannerEntry>) =>
      setPlanner((prev) => prev.map((p) => (p.dramaId === id ? { ...p, ...patch } : p))),
    [setPlanner],
  );

  const pushRecentSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setRecent((prev) => [trimmed, ...prev.filter((r) => r.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8));
    },
    [setRecent],
  );

  const bumpReaction = useCallback(
    (id: number, emoji: string) => {
      setReactions((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), [emoji]: ((prev[id]?.[emoji] ?? 0) + 1) },
      }));
    },
    [setReactions],
  );

  const value = useMemo<AppState>(
    () => ({
      mood, setMood,
      watchlist, toggleWatchlist, isInWatchlist, setStatus, bumpProgress,
      planner, addToPlanner, removeFromPlanner, updatePlanner,
      recentSearches, pushRecentSearch,
      reactions, bumpReaction,
      bingeMode, setBingeMode,
      watchProgress, saveWatchProgress, clearWatchProgress,
      likedDramas, toggleLike, isLiked,
    }),
    [mood, watchlist, planner, recentSearches, reactions, bingeMode, watchProgress, likedDramas, setMood, toggleWatchlist, isInWatchlist, setStatus, bumpProgress, addToPlanner, removeFromPlanner, updatePlanner, pushRecentSearch, bumpReaction, setBingeMode, saveWatchProgress, clearWatchProgress, toggleLike, isLiked],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAppStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
};