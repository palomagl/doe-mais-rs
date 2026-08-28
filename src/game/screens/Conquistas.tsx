import { AppShell } from "@/game/GameShell";
import { ACHIEVEMENTS } from "@/game/gameData";
import { achievementStats, usePlayer } from "@/game/usePlayer";


export default function AchievementsPage() {
  const player = usePlayer();
  const stats = achievementStats(player);
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.check(stats)).length;

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-black">Conquistas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {unlockedCount} de {ACHIEVEMENTS.length} badges desbloqueados.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 pb-6">
        {ACHIEVEMENTS.map((a) => {
          const done = a.check(stats);
          const pct = Math.round(a.progress(stats) * 100);
          return (
            <div
              key={a.id}
              className={`surface-card p-4 text-center ${done ? "" : "opacity-70"}`}
            >
              <div
                className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl text-2xl ${
                  done ? "gradient-gold" : "bg-secondary grayscale"
                }`}
              >
                {a.icon}
              </div>
              <p className="mt-2 font-display text-sm font-extrabold">{a.title}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{a.description}</p>
              {!done && (
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full gradient-hero transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
