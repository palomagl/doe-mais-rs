import { useCallback, useEffect, useRef, useState } from "react";
import { PHASES, QUIZ, type QuizQuestion } from "@/game/gameData";
import { playSound } from "@/game/sound";
import { usePlayer, type RunResult } from "@/game/usePlayer";

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(pattern);
  }
}

type ItemKind = "bag" | "heart" | "star" | "gem" | "turbo" | "shield" | "multiplier" | "life";

type Entity = {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: ItemKind | "obstacle";
  vy?: number;
  taken?: boolean;
  tall?: boolean;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string; text?: string };

const ICONS: Record<string, string> = {
  bag: "🩸",
  heart: "❤️",
  star: "⭐",
  gem: "💎",
  turbo: "⚡",
  shield: "🛡️",
  multiplier: "✖️",
  life: "💗",
};

const GROUND_RATIO = 0.82;
const RUN_DURATION = 75; // seconds

export type GameStatus = "ready" | "running" | "quiz" | "over";

export function useGameEngine(phaseId: number, onFinish: (r: RunResult) => void) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phase = PHASES.find((p) => p.id === phaseId) ?? PHASES[0]!;

  // Preferências do jogador (Configurações) lidas pela game loop.
  const { haptics, reducedFx } = usePlayer();
  const prefsRef = useRef({ haptics, reducedFx });
  prefsRef.current = { haptics, reducedFx };

  const [status, setStatus] = useState<GameStatus>("ready");
  const [hud, setHud] = useState({
    score: 0,
    combo: 1,
    lives: 3,
    bags: 0,
    time: RUN_DURATION,
    progress: 0,
    shield: false,
    multiplier: false,
    turbo: false,
  });
  const [question, setQuestion] = useState<QuizQuestion | null>(null);

  const stateRef = useRef({
    t: 0,
    elapsed: 0,
    dist: 0,
    speed: phase.speed,
    score: 0,
    xp: 0,
    combo: 1,
    bestCombo: 1,
    lives: 3,
    bags: 0,
    hearts: 0,
    stars: 0,
    correct: 0,
    asked: 0,
    shield: 0,
    turbo: 0,
    multiplier: 0,
    invuln: 0,
    quizAt: 18,
    y: 0,
    vy: 0,
    sliding: 0,
    jumps: 0,
    entities: [] as Entity[],
    particles: [] as Particle[],
    running: false,
    quizPaused: false,
    finished: false,
    askedIds: [] as string[],
  });

  const finish = useCallback(
    (completed: boolean) => {
      const s = stateRef.current;
      if (s.finished) return;
      s.finished = true;
      s.running = false;
      playSound(completed ? "levelup" : "gameover");
      if (prefsRef.current.haptics) vibrate(completed ? [40, 30, 40, 30, 80] : [120, 40, 120]);
      setStatus("over");
      onFinish({
        score: Math.round(s.score),
        xp: Math.round(s.score * 0.35 + s.correct * 100 + (completed ? 200 : 0)),
        bags: s.bags,
        hearts: s.hearts,
        stars: s.stars,
        correct: s.correct,
        totalQuestions: s.asked,
        bestCombo: Math.round(s.bestCombo),
        phaseId,
        completed,
      });
    },
    [onFinish, phaseId],
  );

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s.running || s.quizPaused) return;
    if (s.jumps < 2) {
      s.vy = -13.5;
      s.jumps += 1;
      s.sliding = 0;
      playSound("jump");
    }
  }, []);

  const slide = useCallback(() => {
    const s = stateRef.current;
    if (!s.running || s.quizPaused) return;
    s.sliding = 34;
    if (s.y < 0) s.vy = 12;
  }, []);

  const start = useCallback(() => {
    const s = stateRef.current;
    Object.assign(s, {
      t: 0,
      elapsed: 0,
      dist: 0,
      speed: phase.speed,
      score: 0,
      combo: 1,
      bestCombo: 1,
      lives: 3,
      bags: 0,
      hearts: 0,
      stars: 0,
      correct: 0,
      asked: 0,
      shield: 0,
      turbo: 0,
      multiplier: 0,
      invuln: 0,
      quizAt: 18,
      y: 0,
      vy: 0,
      sliding: 0,
      jumps: 0,
      entities: [],
      particles: [],
      running: true,
      quizPaused: false,
      finished: false,
      askedIds: [],
    });
    setQuestion(null);
    setStatus("running");
  }, [phase.speed]);

  const answer = useCallback(
    (index: number) => {
      const s = stateRef.current;
      const q = question;
      if (!q) return;
      const ok = index === q.answer;
      if (ok) {
        s.correct += 1;
        s.score += 50;
        s.combo = Math.min(30, s.combo + 2);
        s.bestCombo = Math.max(s.bestCombo, s.combo);
        playSound("correct");
      } else {
        s.combo = Math.max(1, Math.floor(s.combo / 2));
        playSound("wrong");
      }
      return ok;
    },
    [question],
  );

  const resumeFromQuiz = useCallback(() => {
    const s = stateRef.current;
    s.quizPaused = false;
    setQuestion(null);
    if (!s.finished) setStatus("running");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const burst = (x: number, y: number, color: string, text?: string) => {
      const s = stateRef.current;
      if (text) s.particles.push({ x, y: y - 10, vx: 0, vy: -1.2, life: 1, color, text });
      const count = prefsRef.current.reducedFx ? 2 : 8;
      for (let i = 0; i < count; i++) {
        s.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 3 - 1,
          life: 1,
          color,
        });
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 16.666, 3);
      last = now;
      const s = stateRef.current;
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const groundY = H * GROUND_RATIO;

      if (s.running && !s.quizPaused) {
        s.t += dt;
        s.elapsed += dt / 60;
        const boost = s.turbo > 0 ? 1.6 : 1;
        const speed = (s.speed + s.elapsed * 0.02) * boost;
        s.dist += speed * dt;
        s.score += 0.15 * dt * boost * (s.multiplier > 0 ? 2 : 1);

        // physics
        s.vy += 0.62 * dt;
        s.y += s.vy * dt;
        if (s.y > 0) {
          s.y = 0;
          s.vy = 0;
          s.jumps = 0;
        }
        if (s.sliding > 0) s.sliding -= dt;
        if (s.shield > 0) s.shield -= dt;
        if (s.turbo > 0) s.turbo -= dt;
        if (s.multiplier > 0) s.multiplier -= dt;
        if (s.invuln > 0) s.invuln -= dt;

        // spawn
        if (Math.random() < phase.obstacleRate * dt) {
          const tall = Math.random() < 0.35;
          s.entities.push({
            x: W + 40,
            y: tall ? groundY - 120 : groundY - 44,
            w: tall ? 30 : 40,
            h: tall ? 46 : 44,
            kind: "obstacle",
            tall,
          });
        }
        if (Math.random() < 0.065 * dt) {
          const roll = Math.random();
          const kind: ItemKind =
            roll < 0.52
              ? "bag"
              : roll < 0.68
                ? "heart"
                : roll < 0.8
                  ? "star"
                  : roll < 0.87
                    ? "gem"
                    : roll < 0.92
                      ? "turbo"
                      : roll < 0.96
                        ? "shield"
                        : roll < 0.99
                          ? "multiplier"
                          : "life";
          const lane = Math.random() < 0.45 ? groundY - 150 : groundY - 60;
          s.entities.push({ x: W + 30, y: lane, w: 30, h: 30, kind });
        }

        const playerX = W * 0.18;
        const ph = s.sliding > 0 ? 34 : 58;
        const py = groundY - ph + s.y;

        for (const e of s.entities) {
          e.x -= speed * dt * 1.15;
          if (e.taken) continue;
          const hit =
            e.x < playerX + 34 && e.x + e.w > playerX - 4 && e.y < py + ph && e.y + e.h > py;
          if (!hit) continue;
          if (e.kind === "obstacle") {
            if (s.invuln > 0) continue;
            if (s.shield > 0) {
              s.shield = 0;
              s.invuln = 45;
              burst(e.x, e.y, "#3b82f6", "PROTEGIDO");
              e.taken = true;
              continue;
            }
            e.taken = true;
            s.lives -= 1;
            s.combo = 1;
            s.invuln = 110;
            playSound("hit");
            if (prefsRef.current.haptics) vibrate(60);
            burst(playerX, py, "#b91c1c", "-1 VIDA");
            if (s.lives <= 0) finish(false);
          } else {
            e.taken = true;
            const mult = s.multiplier > 0 ? 2 : 1;
            playSound("collect");
            switch (e.kind) {
              case "bag":
                s.bags += 1;
                s.combo = Math.min(30, s.combo + 0.5);
                s.score += 10 * s.combo * mult;
                burst(e.x, e.y, "#dc2626", `+${Math.round(10 * s.combo * mult)}`);
                break;
              case "heart":
                s.hearts += 1;
                s.score += 15 * mult;
                burst(e.x, e.y, "#f43f5e", "+15");
                break;
              case "star":
                s.stars += 1;
                s.score += 25 * mult;
                burst(e.x, e.y, "#f59e0b", "+25");
                break;
              case "gem":
                s.score += 60 * mult;
                burst(e.x, e.y, "#06b6d4", "+60");
                break;
              case "turbo":
                s.turbo = 260;
                burst(e.x, e.y, "#eab308", "TURBO!");
                break;
              case "shield":
                s.shield = 400;
                burst(e.x, e.y, "#3b82f6", "PROTEÇÃO");
                break;
              case "multiplier":
                s.multiplier = 300;
                burst(e.x, e.y, "#a855f7", "x2 PONTOS");
                break;
              case "life":
                s.lives = Math.min(5, s.lives + 1);
                burst(e.x, e.y, "#22c55e", "+1 VIDA");
                break;
            }
            s.bestCombo = Math.max(s.bestCombo, s.combo);
          }
        }
        s.entities = s.entities.filter((e) => e.x > -80 && !e.taken);

        // quiz trigger
        if (s.elapsed >= s.quizAt && s.asked < 10) {
          s.quizPaused = true;
          s.asked += 1;
          s.quizAt = s.elapsed + 16;
          const pool = QUIZ.filter((q) => !s.askedIds.includes(q.id));
          const src = pool.length ? pool : QUIZ;
          const q = src[Math.floor(Math.random() * src.length)]!;
          s.askedIds.push(q.id);
          setQuestion(q);
          setStatus("quiz");
        }

        if (s.elapsed >= RUN_DURATION) finish(true);
      }

      // particles
      for (const p of s.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.12 * dt;
        p.life -= 0.02 * dt;
      }
      s.particles = s.particles.filter((p) => p.life > 0);

      // ---------- render ----------
      const pal = phase.palette;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, pal.sky);
      grad.addColorStop(1, "#ffffff");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // sun
      ctx.fillStyle = "rgba(220,38,38,0.10)";
      ctx.beginPath();
      ctx.arc(W * 0.78, H * 0.2, 46, 0, Math.PI * 2);
      ctx.fill();

      // far hills
      const drawHills = (offset: number, color: string, height: number) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        for (let x = 0; x <= W; x += 20) {
          const y =
            groundY - height - Math.sin((x + s.dist * offset) * 0.006) * height * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, groundY);
        ctx.closePath();
        ctx.fill();
      };
      drawHills(0.25, pal.far, 70);
      drawHills(0.5, pal.near, 40);

      // ground
      ctx.fillStyle = pal.ground;
      ctx.fillRect(0, groundY, W, H - groundY);
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      for (let i = 0; i < W / 60 + 2; i++) {
        const x = ((i * 60 - (s.dist % 60)) + W) % (W + 60);
        ctx.fillRect(x, groundY + 18, 28, 4);
      }

      // entities
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const e of s.entities) {
        if (e.kind === "obstacle") {
          ctx.fillStyle = "#7f1d1d";
          roundRect(ctx, e.x, e.y, e.w, e.h, 8);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.font = "16px system-ui";
          ctx.fillText(e.tall ? "🚧" : "⛔", e.x + e.w / 2, e.y + e.h / 2);
        } else {
          const bob = Math.sin((s.t + e.x) * 0.08) * 4;
          ctx.font = "26px system-ui";
          ctx.fillText(ICONS[e.kind] ?? "🩸", e.x + e.w / 2, e.y + e.h / 2 + bob);
        }
      }

      // player
      const playerX = W * 0.18;
      const ph = s.sliding > 0 ? 34 : 58;
      const py = groundY - ph + s.y;
      ctx.save();
      if (s.invuln > 0 && Math.floor(s.t / 5) % 2 === 0) ctx.globalAlpha = 0.4;
      // shadow
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.beginPath();
      ctx.ellipse(playerX + 15, groundY + 4, 20, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // body
      ctx.fillStyle = "#dc2626";
      roundRect(ctx, playerX, py, 30, ph, 12);
      ctx.fill();
      // cape
      ctx.fillStyle = "#991b1b";
      ctx.beginPath();
      ctx.moveTo(playerX, py + 6);
      ctx.quadraticCurveTo(playerX - 22 - Math.sin(s.t * 0.3) * 4, py + 20, playerX - 6, py + ph - 4);
      ctx.lineTo(playerX + 4, py + ph - 6);
      ctx.closePath();
      ctx.fill();
      // head
      ctx.fillStyle = "#fde3d3";
      ctx.beginPath();
      ctx.arc(playerX + 15, py - 8, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#7f1d1d";
      ctx.beginPath();
      ctx.arc(playerX + 15, py - 13, 12, Math.PI, Math.PI * 2);
      ctx.fill();
      // legs
      ctx.strokeStyle = "#7f1d1d";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      const swing = Math.sin(s.t * 0.35) * 8;
      ctx.beginPath();
      ctx.moveTo(playerX + 10, py + ph);
      ctx.lineTo(playerX + 10 + swing, groundY + (s.y < 0 ? s.y * 0 : 0));
      ctx.moveTo(playerX + 20, py + ph);
      ctx.lineTo(playerX + 20 - swing, groundY);
      ctx.stroke();
      if (s.shield > 0) {
        ctx.strokeStyle = "rgba(59,130,246,0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(playerX + 15, py + ph / 2 - 4, 40, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // particles render
      for (const p of s.particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        if (p.text) {
          ctx.fillStyle = p.color;
          ctx.font = "bold 14px system-ui";
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      setHudThrottled({
        score: Math.round(s.score),
        combo: Math.round(s.combo * 10) / 10,
        lives: s.lives,
        bags: s.bags,
        time: Math.max(0, Math.ceil(RUN_DURATION - s.elapsed)),
        progress: Math.min(1, s.elapsed / RUN_DURATION),
        shield: s.shield > 0,
        multiplier: s.multiplier > 0,
        turbo: s.turbo > 0,
      });
    };

    let lastHud = 0;
    const setHudThrottled = (v: typeof hud) => {
      const now = performance.now();
      if (now - lastHud < 100) return;
      lastHud = now;
      setHud(v);
    };

    raf = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        jump();
      }
      if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        slide();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, finish, jump, slide]);

  return { canvasRef, status, hud, question, start, jump, slide, answer, resumeFromQuiz, phase, finish };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
