import { useNavigate } from "react-router-dom";
import { moods } from "@/data/dramas";
import { useAppStore } from "@/store/AppStore";
import { cn } from "@/lib/utils";

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning 👋";
  if (h < 18) return "Good Afternoon 👋";
  return "Good Evening 👋";
};

export default function Mood() {
  const navigate = useNavigate();
  const { setMood } = useAppStore();

  const pick = (id: string) => {
    setMood(id);
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10 md:py-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-glow" />
            <span className="text-lg font-semibold tracking-tight">feelora</span>
          </div>
          <p className="text-sm text-muted-foreground">{greet()}</p>
        </div>

        <div className="mt-16 max-w-2xl animate-fade-in">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            How are you feeling tonight?
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            We'll find your perfect drama.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {moods.map((m, i) => (
            <button
              key={m.id}
              onClick={() => pick(m.id)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={cn(
                "group relative flex h-44 flex-col items-start justify-between overflow-hidden rounded-3xl border border-border bg-elevated p-5 text-left transition-all hover:-translate-y-1 hover:shadow-glow animate-scale-in",
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", m.gradient)} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="relative text-4xl drop-shadow-lg md:text-5xl">{m.emoji}</div>
              <div className="relative">
                <p className="text-base font-semibold">{m.name}</p>
                <p className="text-xs text-foreground/80">{m.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => { setMood(null); navigate("/"); }}
          className="mt-10 self-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Skip and browse everything →
        </button>
      </div>
    </div>
  );
}