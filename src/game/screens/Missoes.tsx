import { AppShell } from "@/game/GameShell";
import { XPBar } from "@/game/uiKit";
import { DAILY_MISSIONS, POWER_UPS } from "@/game/gameData";
import { usePlayer } from "@/game/usePlayer";


export default function MissionsPage() {
  const player = usePlayer();

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-black">Missões</h1>
      <p className="mt-1 text-sm text-muted-foreground">Renovam todo dia. Mantenha o streak 🔥.</p>

      <div className="mt-5 space-y-2">
        {DAILY_MISSIONS.map((m) => {
          const value = Math.min(m.goal, player.missionProgress[m.id] ?? 0);
          const done = value >= m.goal;
          return (
            <div key={m.id} className="surface-card flex items-center gap-3 p-4">
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${
                  done ? "gradient-hero" : "bg-secondary"
                }`}
              >
                {done ? "✅" : m.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{m.title}</p>
                <XPBar value={value} max={m.goal} showLabel={false} className="mt-2" />
              </div>
              <span className="shrink-0 text-xs font-extrabold text-primary">
                {done ? "✓" : `+${m.xp}`}
              </span>
            </div>
          );
        })}
      </div>

      <h2 className="mt-8 font-display text-[15px] font-extrabold">Power-ups da partida</h2>
      <div className="mt-3 flex flex-wrap gap-2 pb-6">
        {POWER_UPS.map((p) => (
          <span
            key={p.name}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-accent-foreground"
          >
            <span className="text-sm">{p.icon}</span>
            {p.name}
          </span>
        ))}
      </div>
    </AppShell>
  );
}
