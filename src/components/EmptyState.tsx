import { Link } from "react-router-dom";

interface Props {
  emoji?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export const EmptyState = ({ emoji = "✨", title, description, ctaLabel, ctaTo }: Props) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-20 text-center">
    <div className="text-6xl">{emoji}</div>
    <h3 className="mt-4 text-xl font-semibold">{title}</h3>
    {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
    {ctaLabel && ctaTo && (
      <Link
        to={ctaTo}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-purple px-5 py-2.5 text-sm font-medium shadow-glow"
      >
        {ctaLabel} →
      </Link>
    )}
  </div>
);