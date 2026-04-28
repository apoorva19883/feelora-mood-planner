import { ReactNode } from "react";
import { Drama } from "@/data/dramas";
import { DramaCard } from "./DramaCard";

export const DramaRow = ({ title, dramas, emptyText }: { title: ReactNode; dramas: Drama[]; emptyText?: string }) => {
  if (dramas.length === 0 && emptyText) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </section>
    );
  }
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {dramas.map((d) => <DramaCard key={d.id} drama={d} />)}
      </div>
    </section>
  );
};