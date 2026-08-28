import { Link } from "@/game/nav";
import { AppShell } from "@/game/GameShell";
import { PHASES } from "@/game/gameData";
import { usePlayer } from "@/game/usePlayer";
import { playSound } from "@/game/sound";
import { Lock } from "lucide-react";


export default function MapPage() {
  const player = usePlayer();

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-black">Mapa de fases</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Cinco jornadas pelo Rio Grande do Sul. Conclua uma fase para desbloquear a próxima.
      </p>

      <div className="relative mt-6 space-y-3 pb-6">
        <div className="absolute bottom-6 left-[38px] top-6 w-0.5 bg-border" />
        {PHASES.map((phase) => {
          const unlocked = phase.id <= player.unlockedPhase;
          const stars = player.phaseStars[phase.id] ?? 0;
          const content = (
            <div
              className={`surface-card relative flex items-center gap-4 p-4 ${
                unlocked ? "" : "opacity-60"
              }`}
            >
              <div
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${
                  unlocked ? "gradient-hero text-primary-foreground" : "bg-secondary"
                }`}
              >
                {unlocked ? phase.emoji : <Lock className="h-5 w-5 text-muted-foreground" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
                  Fase {phase.id} • {phase.city}
                </p>
                <p className="font-display text-[15px] font-extrabold">{phase.name}</p>
                <p className="mt-1 text-sm">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className={i <= stars ? "" : "opacity-25"}>
                      ⭐
                    </span>
                  ))}
                  <span className="ml-2 text-[11px] font-semibold text-muted-foreground">
                    meta {phase.targetScore.toLocaleString("pt-BR")} pts
                  </span>
                </p>
              </div>
            </div>
          );

          return unlocked ? (
            <Link
              key={phase.id}
              to="/jogar/$phase"
              params={{ phase: String(phase.id) }}
              onClick={() => playSound("click")}
              className="block transition-transform active:scale-[0.99]"
            >
              {content}
            </Link>
          ) : (
            <div key={phase.id}>{content}</div>
          );
        })}
      </div>
    </AppShell>
  );
}
