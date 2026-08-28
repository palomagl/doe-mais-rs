import { Link } from "@/game/nav";
import { AppShell } from "@/game/GameShell";
import { SectionTitle, StatChip, XPBar } from "@/game/uiKit";
import { ACHIEVEMENTS, xpForLevel } from "@/game/gameData";
import { achievementStats, usePlayer } from "@/game/usePlayer";


export default function ProfilePage() {
  const player = usePlayer();
  const need = xpForLevel(player.level);
  const stats = achievementStats(player);
  const unlocked = ACHIEVEMENTS.filter((a) => a.check(stats));

  return (
    <AppShell>
      <section className="surface-card overflow-hidden p-0">
        <div className="gradient-hero px-5 pb-12 pt-6 text-primary-foreground">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Perfil do herói</p>
        </div>
        <div className="-mt-10 px-5 pb-5">
          <div className="flex items-end gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-3xl border-4 border-card bg-primary-soft text-4xl shadow-soft">
              {player.avatar}
            </div>
            <div className="pb-1">
              <h1 className="font-display text-xl font-black">{player.name}</h1>
              <p className="text-xs font-semibold text-muted-foreground">
                {player.city} • Nível {player.level}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
              <span>Progresso para o nível {player.level + 1}</span>
              <span className="text-primary">{Math.max(0, need - player.xp)} XP restantes</span>
            </div>
            <XPBar value={player.xp} max={need} />
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <StatChip icon="🏅" label="Pontos" value={player.score.toLocaleString("pt-BR")} />
        <StatChip icon="🚀" label="Recorde" value={player.bestScore.toLocaleString("pt-BR")} />
        <StatChip icon="🔥" label="Streak" value={`${player.streak}d`} />
        <StatChip icon="🎖️" label="Badges" value={unlocked.length} />
      </div>

      <SectionTitle
        action={
          <Link to="/conquistas" className="text-xs font-bold text-primary">
            Ver todas
          </Link>
        }
      >
        Conquistas recentes
      </SectionTitle>
      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
        {(unlocked.length ? unlocked : ACHIEVEMENTS.slice(0, 3)).map((a) => (
          <div
            key={a.id}
            className={`surface-card min-w-[110px] p-3 text-center ${
              unlocked.includes(a) ? "" : "opacity-45"
            }`}
          >
            <div className="text-2xl">{a.icon}</div>
            <p className="mt-1 text-[11px] font-extrabold leading-tight">{a.title}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
