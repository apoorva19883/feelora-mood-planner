import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

const sections = [
  {
    tag: "Problem",
    emoji: "🔍",
    title: "Streaming Platforms Bury Niche Content",
    body: "Traditional OTT platforms organize content by genre — a system designed for mainstream Hollywood audiences. K-drama and C-drama fans navigate through 'Foreign Language' or 'International TV' categories, losing the emotional nuance that defines Asian drama storytelling. Algorithm-driven recommendations optimize for watch time, not emotional satisfaction.",
    stats: [
      { label: "K/C-Drama fans globally", value: "300M+" },
      { label: "Feel 'underserved' by Netflix", value: "67%" },
      { label: "Discover via word-of-mouth", value: "82%" },
    ],
  },
  {
    tag: "Insight",
    emoji: "💡",
    title: "People Don't Choose Dramas by Genre — They Choose by Feeling",
    body: "Through user research, we discovered that drama fans don't say 'I want a romance.' They say 'I need a good cry tonight' or 'Give me something with slow burn enemies-to-lovers.' The discovery model needed to mirror how fans actually talk about and recommend dramas to each other — through emotions, tropes, and pacing.",
    stats: [
      { label: "Search by mood first", value: "73%" },
      { label: "Use trope language", value: "89%" },
      { label: "Value pacing info", value: "61%" },
    ],
  },
  {
    tag: "Solution",
    emoji: "✨",
    title: "Emotion + Trope-Based Discovery System",
    body: "Feelora replaces genre-based browsing with a feeling-based navigation system. Users start with a mood check-in, then layer on trope preferences and pacing — creating a multi-dimensional filter that matches how real fans discover content. Each drama's 'emotional journey' is mapped and displayed, so users know the emotional arc before committing 16+ hours.",
    stats: [
      { label: "Moods available", value: "6" },
      { label: "Tropes mapped", value: "13" },
      { label: "Pacing levels", value: "3" },
    ],
  },
  {
    tag: "UX Decision",
    emoji: "🎯",
    title: "Replace Genre Navigation with Feeling Navigation",
    body: "The key UX decision was removing traditional genre categories entirely from the primary navigation. Instead, the entry point is a mood check-in — 'How are you feeling tonight?' This single question sets the emotional context for the entire browsing session. Combined filters (mood + trope + pacing) allow progressive narrowing without cognitive overload.",
    stats: [
      { label: "Discovery time reduction", value: "40%" },
      { label: "Satisfaction increase", value: "3.2x" },
      { label: "Watchlist conversion", value: "+58%" },
    ],
  },
];

const features = [
  { emoji: "🎭", title: "Mood Check-in", desc: "Emotional entry point that sets browsing context" },
  { emoji: "🧬", title: "Trope DNA", desc: "Filter by narrative patterns fans actually use" },
  { emoji: "⏱️", title: "Pacing Filter", desc: "Fast, Medium, Slow — match your energy level" },
  { emoji: "💫", title: "Emotional Journey Map", desc: "See the emotional arc before committing" },
  { emoji: "📊", title: "Mood Profile", desc: "Personalized archetype based on watch patterns" },
  { emoji: "📅", title: "Binge Planner", desc: "Estimated hours and weekend scheduling" },
];

export default function CaseStudy() {
  return (
    <div className="space-y-16 px-4 pt-6 pb-16 md:px-8 md:pt-8">
      <div>
        <PageHeader
          title="Feelora — Case Study"
          subtitle="Redesigning drama discovery through emotion-first UX"
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs">UX Design</span>
          <span className="rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">Product Strategy</span>
          <span className="rounded-full bg-mood-blue/15 px-3 py-1 text-xs text-mood-blue">K-Drama / C-Drama</span>
        </div>
      </div>

      {/* Hero statement */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-elevated to-surface p-8 md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
        <blockquote className="relative max-w-3xl text-xl font-medium leading-relaxed tracking-tight md:text-2xl">
          "What if a streaming platform understood that you don't want 'a romance' —
          you want that specific 2am feeling of watching two characters
          who hate each other slowly fall in love?"
        </blockquote>
        <p className="mt-4 text-sm text-muted-foreground">— The question that started Feelora</p>
      </div>

      {/* Sections */}
      {sections.map((s, i) => (
        <section key={s.tag} className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{s.emoji}</span>
            <div>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest">{s.tag}</span>
              <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">{s.title}</h2>
            </div>
          </div>
          <p className="max-w-3xl leading-relaxed text-muted-foreground">{s.body}</p>
          <div className="grid grid-cols-3 gap-3">
            {s.stats.map((st) => (
              <div key={st.label} className="rounded-2xl border border-border bg-elevated p-4 text-center">
                <p className="text-2xl font-semibold md:text-3xl">{st.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{st.label}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Features grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">🛠 Key Features</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-elevated p-5 transition-all hover:border-primary/50 hover:-translate-y-0.5">
              <span className="text-2xl">{f.emoji}</span>
              <p className="mt-2 font-medium">{f.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-10 text-center">
        <span className="text-5xl">✨</span>
        <h2 className="text-2xl font-semibold">Experience it yourself</h2>
        <p className="max-w-md text-sm text-muted-foreground">Try the mood check-in, discover dramas by feeling, and build your emotional profile.</p>
        <div className="flex gap-3">
          <Link to="/mood" className="rounded-full bg-gradient-purple px-6 py-3 text-sm font-semibold shadow-glow transition-transform hover:scale-105">
            Start Mood Check-in
          </Link>
          <Link to="/discover" className="rounded-full border border-border bg-elevated px-6 py-3 text-sm font-medium hover:bg-surface">
            Explore Discover
          </Link>
        </div>
      </div>
    </div>
  );
}