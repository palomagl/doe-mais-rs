import { Link } from "@/game/nav";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppShell, BrandMark } from "@/game/GameShell";
import { SectionTitle, StatChip, XPBar } from "@/game/uiKit";
import { DAILY_MISSIONS, PHASES, xpForLevel } from "@/game/gameData";
import { hydratePlayer, usePlayer } from "@/game/usePlayer";
import { playSound } from "@/game/sound";
import { LoginForm } from "@/game/LoginForm";


function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1900);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center gradient-hero">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <div className="grid h-24 w-24 place-items-center rounded-3xl bg-card text-5xl shadow-glow animate-float">
          🩸
        </div>
        <div>
          <h1 className="font-display text-3xl font-black text-primary-foreground">DOE+ HERO</h1>
          <p className="mt-1 text-sm font-medium text-primary-foreground/80">
            Sistema Digital de Apoio ao Doador
          </p>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 140 }}
          transition={{ duration: 1.6 }}
          className="h-1.5 rounded-full bg-primary-foreground/70"
        />
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const [splash, setSplash] = useState(true);
  const player = usePlayer();

  useEffect(() => {
    hydratePlayer();
  }, []);

  const phase = PHASES.find((p) => p.id === player.unlockedPhase) ?? PHASES[PHASES.length - 1]!;
  const need = xpForLevel(player.level);

  if (splash) return <Splash onDone={() => setSplash(false)} />;

  if (!player.loggedIn) {
    return (
      <AppShell hideNav>
        <LoginInline />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl gradient-hero p-5 text-primary-foreground shadow-glow"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold opacity-90">Olá, Herói! 👋</p>
            <h1 className="font-display text-2xl font-black">{player.name}</h1>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-foreground/15 text-3xl backdrop-blur">
            {player.avatar}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs font-bold">
          <span>NÍVEL {player.level}</span>
          <span>
            {player.xp} / {need} XP
          </span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-primary-foreground/25">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (player.xp / need) * 100)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-primary-foreground"
          />
        </div>
      </motion.section>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <StatChip icon="🏅" label="Pontos" value={player.score.toLocaleString("pt-BR")} />
        <StatChip icon="🩸" label="Bolsas" value={player.bags} />
      </div>

      <SectionTitle>Continue sua missão</SectionTitle>
      <Link
        to="/jogar/$phase"
        params={{ phase: String(phase.id) }}
        onClick={() => playSound("click")}
        className="surface-card block overflow-hidden p-0 transition-transform active:scale-[0.99]"
      >
        <div className="flex items-center gap-4 p-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl">
            {phase.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
              Fase {phase.id} • {phase.city}
            </p>
            <p className="font-display text-base font-extrabold">{phase.name}</p>
          </div>
        </div>
        <div className="gradient-hero px-4 py-3 text-center text-sm font-extrabold text-primary-foreground">
          ▶ JOGAR AGORA
        </div>
      </Link>

      <SectionTitle
        action={
          <Link to="/missoes" className="text-xs font-bold text-primary">
            Ver todas
          </Link>
        }
      >
        Missões de hoje
      </SectionTitle>
      <div className="space-y-2 pb-4">
        {DAILY_MISSIONS.slice(0, 2).map((m) => {
          const prog = Math.min(1, (player.missionProgress[m.id] ?? 0) / m.goal);
          return (
            <div key={m.id} className="surface-card flex items-center gap-3 p-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-xl">
                {m.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{m.title}</p>
                <XPBar
                  value={Math.min(m.goal, player.missionProgress[m.id] ?? 0)}
                  max={m.goal}
                  showLabel={false}
                  className="mt-1.5"
                />
              </div>
              <span className="text-xs font-extrabold text-primary">
                {prog >= 1 ? "✓" : `+${m.xp}`}
              </span>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

function LoginInline() {
  return (
    <div className="flex min-h-screen flex-col justify-between p-6">
      <div className="pt-10">
        <BrandMark />
        <h1 className="mt-8 font-display text-3xl font-black leading-tight">
          Seja o herói de <span className="text-primary">alguém hoje.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Entre para jogar a Corrida pela Vida, cumprir missões e aprender sobre doação de sangue.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
