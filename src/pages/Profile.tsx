import { useMemo } from "react";
import { Link } from "react-router-dom";
import { dramas, moods } from "@/data/dramas";
import { useAppStore } from "@/store/AppStore";
import { PageHeader } from "@/components/PageHeader";
import { DramaCard } from "@/components/DramaCard";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { watchlist, likedDramas, mood } = useAppStore();

  const moodProfile = useMemo(() => {
    const moodScores: Record<string, number> = {};
    const tropeScores: Record<string, number> = {};
    const emotionScores: Record<string, number> = {};
    const pacingScores: Record<string, number> = { Fast: 0, Medium: 0, Slow: 0 };

    const interacted = new Set([
      ...watchlist.map((w) => w.dramaId),
      ...likedDramas,
    ]);

    interacted.forEach((id) => {
      const d = dramas.find((x) => x.id === id);
      if (!d) return;
      const weight = likedDramas.includes(id) ? 2 : 1;
      d.moods.forEach((m) => { moodScores[m] = (moodScores[m] || 0) + weight; });
      d.tropes.forEach((t) => { tropeScores[t] = (tropeScores[t] || 0) + weight; });
      d.emotionalJourney.forEach((e) => { emotionScores[e] = (emotionScores[e] || 0) + weight; });
      pacingScores[d.pacing] += weight;
    });

    if (mood) moodScores[mood] = (moodScores[mood] || 0) + 3;

    const sorted = (obj: Record<string, number>) =>
      Object.entries(obj).sort((a, b) => b[1] - a[1]);

    const topMoods = sorted(moodScores).slice(0, 3);
    const topTropes = sorted(tropeScores).slice(0, 4);
    const topEmotions = sorted(emotionScores).slice(0, 6);
    const favPacing = sorted(pacingScores)[0]?.[0] || "Medium";
    const total = Object.values(moodScores).reduce((a, b) => a + b, 0);

    return { topMoods, topTropes, topEmotions, favPacing, total, interactedCount: interacted.size };
  }, [watchlist, likedDramas, mood]);

  const recommendations = useMemo(() => {
    const interacted = new Set([...watchlist.map((w) => w.dramaId), ...likedDramas]);
    const topMoodIds = moodProfile.topMoods.map(([m]) => m);
    const topTropeIds = moodProfile.topTropes.map(([t]) => t);

    return dramas
      .filter((d) => !interacted.has(d.id))
      .map((d) => {
        let score = 0;
        d.moods.forEach((m) => { if (topMoodIds.includes(m)) score += 3; });
        d.tropes.forEach((t) => { if (topTropeIds.includes(t)) score += 2; });
        if (d.pacing === moodProfile.favPacing) score += 1;
        return { ...d, score };
      })
      .filter((d) => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [watchlist, likedDramas, moodProfile]);

  const profileTitle = useMemo(() => {
    const top = moodProfile.topMoods[0]?.[0];
    const titles: Record<string, string> = {
      "Butterflies": "The Romantic Dreamer 🦋",
      "Cry it out": "The Emotional Voyager 😭",
      "Revenge energy": "The Justice Seeker 🔥",
      "Feel good": "The Serotonin Chaser 😂",
      "Epic saga": "The Epic Explorer ⚔️",
      "Slow burn": "The Patient Heart 🌙",
    };
    return titles[top || ""] || "The Drama Explorer ✨";
  }, [moodProfile]);

  const hasData = moodProfile.interactedCount > 0;

  return (
    <div className="space-y-8 px-4 pt-6 md:px-8 md:pt-8">
      <PageHeader title="Your Drama Mood Profile" subtitle="Your emotional fingerprint based on what you watch" />

      {/* Profile Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-elevated to-surface p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Your archetype</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{profileTitle}</h2>
          {hasData ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Based on {moodProfile.interactedCount} drama{moodProfile.interactedCount !== 1 ? "s" : ""} you've explored
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Start adding dramas to your watchlist to build your profile
            </p>
          )}
        </div>
      </div>

      {hasData ? (
        <>
          {/* Mood breakdown */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">🎭 Your Mood Spectrum</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {moodProfile.topMoods.map(([moodId, score], i) => {
                const m = moods.find((x) => x.id === moodId);
                const pct = moodProfile.total > 0 ? Math.round((score / moodProfile.total) * 100) : 0;
                return (
                  <div key={moodId} className={cn(
                    "rounded-2xl border border-border p-5 transition-all hover:border-primary/50",
                    i === 0 ? "bg-primary/10" : "bg-elevated"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{m?.emoji}</span>
                      <span className="text-2xl font-semibold">{pct}%</span>
                    </div>
                    <p className="mt-2 font-medium">{moodId}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                      <div className="h-full bg-gradient-purple transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Emotional map */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">💫 Emotions You're Drawn To</h2>
            <div className="flex flex-wrap gap-2">
              {moodProfile.topEmotions.map(([emotion, score], i) => (
                <div key={emotion} className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-all",
                  i === 0 ? "border-primary bg-primary/20 text-foreground" :
                  i < 3 ? "border-border bg-elevated text-foreground" :
                  "border-border bg-surface text-muted-foreground"
                )} style={{ fontSize: `${Math.max(12, 16 - i * 1.5)}px` }}>
                  {emotion}
                </div>
              ))}
            </div>
          </section>

          {/* Trope DNA */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">🧬 Your Trope DNA</h2>
            <div className="flex flex-wrap gap-2">
              {moodProfile.topTropes.map(([trope]) => (
                <span key={trope} className="rounded-full bg-gold/15 px-3 py-1.5 text-xs text-gold">{trope}</span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Preferred pacing: <span className="text-foreground font-medium">{moodProfile.favPacing}</span>
            </p>
          </section>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">🎯 Recommended For You</h2>
              <p className="text-sm text-muted-foreground">Based on your emotional patterns, not just genres</p>
              <div className="no-scrollbar flex gap-4 overflow-x-auto overflow-y-hidden pb-2">
                {recommendations.map((d) => (
                  <DramaCard key={d.id} drama={d} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-6xl">🎬</span>
          <p className="text-lg font-medium">Your profile is waiting</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Add dramas to your watchlist, like your favorites, and set your mood — we'll build your unique emotional profile.
          </p>
          <Link to="/discover" className="rounded-full bg-gradient-purple px-6 py-3 text-sm font-semibold shadow-glow transition-transform hover:scale-105">
            Start Discovering →
          </Link>
        </div>
      )}
    </div>
  );
}