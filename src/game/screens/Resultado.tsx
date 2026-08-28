import { Link } from "@/game/nav";
import { motion } from "framer-motion";
import { AppShell } from "@/game/GameShell";
import { usePlayer, xpForLevel } from "@/game/usePlayer";
import { playSound } from "@/game/sound";
import { XPBar } from "@/game/uiKit";


export default function ResultPage() {
  const player = usePlayer();
  const r = player.lastResult;

  if (!r) {
    return (
      <AppShell>
        <div className="surface-card mt-10 p-6 text-center">
          <p className="text-sm font-bold">Nenhuma partida registrada ainda.</p>
          <Link
            to="/mapa"
            className="mt-4 inline-block rounded-2xl gradient-hero px-5 py-3 text-sm font-extrabold text-primary-foreground"
          >
            Ir para o mapa
          </Link>
        </div>
      </AppShell>
    );
  }

  const rows = [
    { label: "Pontuação", value: r.score.toLocaleString("pt-BR"), icon: "🏅" },
    { label: "XP ganho", value: `+${r.xp}`, icon: "⚡" },
    { label: "Bolsas coletadas", value: r.bags, icon: "🩸" },
    { label: "Perguntas certas", value: `${r.correct}/${r.totalQuestions}`, icon: "🧠" },
  ];

  return (
    <AppShell>
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="surface-card overflow-hidden p-0"
      >
        <div className="gradient-hero px-5 py-7 text-center text-primary-foreground">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary-foreground/15 text-3xl backdrop-blur animate-float">
            {r.completed ? "🎉" : "💪"}
          </div>
          <h1 className="mt-3 font-display text-2xl font-black">
            {r.completed ? "MISSÃO CONCLUÍDA! ❤️" : "FIM DE JOGO"}
          </h1>
          <p className="mt-1 text-xs font-semibold opacity-90">
            {r.completed
              ? `Fase ${r.phaseId} concluída. Você ajudou a salvar vidas!`
              : "Você perdeu todas as vidas — tente novamente, herói."}
          </p>
        </div>

        <div className="divide-y divide-border">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="flex items-center justify-between px-5 py-3"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span className="text-base">{row.icon}</span>
                {row.label}
              </span>
              <span className="font-display text-base font-extrabold">{row.value}</span>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-border p-5">
          <p className="mb-2 text-xs font-bold">
            Nível {player.level} • {player.xp}/{xpForLevel(player.level)} XP
          </p>
          <XPBar value={player.xp} max={xpForLevel(player.level)} showLabel={false} />
        </div>
      </motion.div>

      <div className="mt-4 space-y-2 pb-6">
        <Link
          to="/jogar/$phase"
          params={{ phase: String(r.phaseId) }}
          onClick={() => playSound("click")}
          className="block rounded-2xl gradient-hero py-4 text-center text-sm font-extrabold text-primary-foreground shadow-glow active:scale-[0.98]"
        >
          JOGAR NOVAMENTE
        </Link>
        <Link
          to="/mapa"
          onClick={() => playSound("click")}
          className="block rounded-2xl bg-card py-4 text-center text-sm font-extrabold shadow-soft active:scale-[0.98]"
        >
          CONTINUAR
        </Link>
        <Link
          to="/ranking"
          onClick={() => playSound("click")}
          className="block rounded-2xl border border-border py-4 text-center text-sm font-extrabold text-muted-foreground active:scale-[0.98]"
        >
          VER RANKING
        </Link>
      </div>
    </AppShell>
  );
}
