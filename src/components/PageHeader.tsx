import { ReactNode } from "react";
export const PageHeader = ({ title, subtitle, right }: { title: ReactNode; subtitle?: ReactNode; right?: ReactNode }) => (
  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
    <div>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {right}
  </div>
);