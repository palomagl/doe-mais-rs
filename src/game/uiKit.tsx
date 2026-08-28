import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function XPBar({
  value,
  max,
  className,
  showLabel = true,
}: {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full gradient-hero transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">
          {value.toLocaleString("pt-BR")} / {max.toLocaleString("pt-BR")} XP
        </p>
      )}
    </div>
  );
}

export function StatChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="surface-card flex flex-col items-center gap-0.5 px-2 py-3">
      <span className="text-lg leading-none">{icon}</span>
      <span className="font-display text-base font-extrabold">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-end justify-between">
      <h2 className="font-display text-[15px] font-extrabold">{children}</h2>
      {action}
    </div>
  );
}
