import { useNavigate, Link } from "@/game/nav";
import { useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart } from "lucide-react";
import { useGameEngine } from "@/game/useGameEngine";
import { applyRun, type RunResult } from "@/game/usePlayer";
import { playSound } from "@/game/sound";


export default function GameplayPage() {
  const { phase: phaseParam } = useParams();
  const navigate = useNavigate();
  const [answered, setAnswered] = useState<{ index: number; ok: boolean } | null>(null);

  const handleFinish = useCallback(
    (result: RunResult) => {
      applyRun(result);
      setTimeout(() => navigate({ to: "/resultado" }), 700);
    },
    [navigate],
  );

  const game = useGameEngine(Number(phaseParam) || 1, handleFinish);
  const { canvasRef, status, hud, question, start, jump, slide, answer, resumeFromQuiz, phase } =
    game;

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[520px] overflow-hidden bg-background">
      {/* HUD */}
      <div className="absolute inset-x-0 top-0 z-20 p-3">
        <div className="flex items-center gap-2">
          <Link
            to="/mapa"
            onClick={() => playSound("click")}
            className="grid h-9 w-9 place-items-center rounded-xl bg-card/90 shadow-soft backdrop-blur"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-1 items-center gap-1.5 rounded-xl bg-card/90 px-3 py-2 shadow-soft backdrop-blur">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].slice(0, Math.max(3, hud.lives)).map((i) => (
                <Heart
                  key={i}
                  className={`h-4 w-4 ${i <= hud.lives ? "fill-primary text-primary" : "text-border"}`}
                />
              ))}
            </div>
            <p className="ml-auto font-display text-sm font-black leading-none">
              {hud.score.toLocaleString("pt-BR")} pts
            </p>
          </div>
          <div className="rounded-xl bg-primary px-3 py-2 text-primary-foreground shadow-glow">
            <p className="font-display text-sm font-black leading-none">x{hud.combo}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-card/90 backdrop-blur">
            <div
              className="h-full rounded-full gradient-hero"
              style={{ width: `${hud.progress * 100}%` }}
            />
          </div>
          <span className="rounded-lg bg-card/90 px-2 py-0.5 text-[11px] font-extrabold backdrop-blur">
            ⏱ {hud.time}s
          </span>
          <span className="rounded-lg bg-card/90 px-2 py-0.5 text-[11px] font-extrabold backdrop-blur">
            🩸 {hud.bags}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {hud.shield && <Pill>🛡️ Proteção</Pill>}
          {hud.turbo && <Pill>⚡ Turbo</Pill>}
          {hud.multiplier && <Pill>⭐ x2 pontos</Pill>}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          if (e.clientY - rect.top > rect.height * 0.75) slide();
          else jump();
        }}
        className="h-screen w-full touch-none"
      />

      {/* Touch controls */}
      {status === "running" && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex gap-3 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            onPointerDown={jump}
            className="h-20 flex-1 rounded-3xl gradient-hero text-base font-extrabold text-primary-foreground shadow-glow active:scale-95"
          >
            PULAR ⤴
          </button>
          <button
            onPointerDown={slide}
            className="h-20 flex-1 rounded-3xl bg-card text-base font-extrabold shadow-card active:scale-95"
          >
            DESLIZAR ⤵
          </button>
        </div>
      )}

      {/* Start screen */}
      <AnimatePresence>
        {status === "ready" && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 grid place-items-center bg-background/85 p-6 backdrop-blur-md"
          >
            <div className="surface-card w-full max-w-sm p-6 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-hero text-3xl text-primary-foreground shadow-glow animate-pulse-ring">
                {phase.emoji}
              </div>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-primary">
                Fase {phase.id} • {phase.city}
              </p>
              <h2 className="font-display text-xl font-black">{phase.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{phase.description}</p>
              <ul className="mt-4 space-y-1 text-left text-xs font-semibold text-muted-foreground">
                <li>👆 Toque para pular (duplo!) · 👇 embaixo para deslizar</li>
                <li>🩸 Colete bolsas · 🧠 responda os quizzes</li>
              </ul>
              <button
                onClick={() => {
                  playSound("click");
                  start();
                }}
                className="mt-5 w-full rounded-2xl gradient-hero py-4 text-sm font-extrabold text-primary-foreground shadow-glow active:scale-[0.98]"
              >
                COMEÇAR CORRIDA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz */}
      <AnimatePresence>
        {status === "quiz" && question && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end bg-primary-deep/50 p-4 backdrop-blur-sm sm:items-center"
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              className="w-full rounded-3xl bg-card p-5 shadow-card"
            >
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                🧠 Desafio de conhecimento
              </p>
              <h3 className="mt-2 font-display text-lg font-black leading-snug">
                {question.question}
              </h3>
              <div className="mt-4 space-y-2">
                {question.options.map((opt, i) => {
                  const state = answered
                    ? i === question.answer
                      ? "correct"
                      : i === answered.index
                        ? "wrong"
                        : "idle"
                    : "idle";
                  return (
                    <button
                      key={opt}
                      disabled={!!answered}
                      onClick={() => {
                        const ok = answer(i) ?? false;
                        setAnswered({ index: i, ok });
                        setTimeout(() => {
                          setAnswered(null);
                          resumeFromQuiz();
                        }, 1700);
                      }}
                      className={`w-full rounded-2xl border p-3.5 text-left text-sm font-bold transition-all ${
                        state === "correct"
                          ? "border-success bg-success/10"
                          : state === "wrong"
                            ? "border-destructive bg-destructive/10"
                            : "border-border bg-secondary/60 active:scale-[0.99]"
                      }`}
                    >
                      <span className="mr-2 text-primary">
                        {String.fromCharCode(65 + i)})
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {answered && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 rounded-2xl bg-primary-soft p-3 text-xs font-semibold text-accent-foreground"
                  >
                    {answered.ok ? "✅ Correto! +100 XP e +50 pontos. " : "❌ Quase! "}
                    {question.explanation}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {status === "over" && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-background/80 backdrop-blur">
          <p className="font-display text-lg font-black">Calculando recompensas…</p>
        </div>
      )}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-extrabold text-primary-foreground shadow-glow">
      {children}
    </span>
  );
}
