import { useSyncExternalStore } from "react";
import {
  ACHIEVEMENTS,
  DAILY_MISSIONS,
  PHASES,
  xpForLevel,
  type AchievementStats,
} from "@/game/gameData";

export type RunResult = {
  score: number;
  xp: number;
  bags: number;
  hearts: number;
  stars: number;
  correct: number;
  totalQuestions: number;
  bestCombo: number;
  phaseId: number;
  completed: boolean;
};

export type PlayerState = {
  name: string;
  avatar: string;
  city: string;
  loggedIn: boolean;
  level: number;
  xp: number;
  totalXp: number;
  coins: number;
  score: number;
  bestScore: number;
  lives: number;
  streak: number;
  lastPlayed: string | null;
  bags: number;
  hearts: number;
  stars: number;
  correctAnswers: number;
  runs: number;
  bestCombo: number;
  unlockedPhase: number;
  phaseStars: Record<number, number>;
  missionProgress: Record<string, number>;
  missionsCompleted: number;
  claimedMissions: string[];
  unlockedAchievements: string[];
  lastResult: RunResult | null;
  sound: boolean;
  haptics: boolean;
  reducedFx: boolean;
};

const KEY = "doemais-hero-state-v1";

const initialState: PlayerState = {
  name: "Herói RS",
  avatar: "🦸",
  city: "Porto Alegre",
  loggedIn: false,
  level: 1,
  xp: 0,
  totalXp: 0,
  coins: 120,
  score: 0,
  bestScore: 0,
  lives: 5,
  streak: 1,
  lastPlayed: null,
  bags: 0,
  hearts: 0,
  stars: 0,
  correctAnswers: 0,
  runs: 0,
  bestCombo: 0,
  unlockedPhase: 1,
  phaseStars: {},
  missionProgress: {},
  missionsCompleted: 0,
  claimedMissions: [],
  unlockedAchievements: [],
  lastResult: null,
  sound: true,
  haptics: true,
  reducedFx: false,
};

let state: PlayerState = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function hydratePlayer() {
  if (hydrated || typeof localStorage === "undefined") return;
  hydrated = true;
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      state = { ...initialState, ...(JSON.parse(raw) as PlayerState) };
    } catch {
      state = initialState;
    }
  }
  // streak handling
  const today = new Date().toDateString();
  if (state.lastPlayed && state.lastPlayed !== today) {
    const diff = Math.round(
      (new Date(today).getTime() - new Date(state.lastPlayed).getTime()) / 86400000,
    );
    if (diff > 1) state.streak = 1;
    state.missionProgress = {};
    state.claimedMissions = [];
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function usePlayer(): PlayerState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initialState,
  );
}

export function setPlayer(patch: Partial<PlayerState>) {
  state = { ...state, ...patch };
  persist();
  emit();
}

export function achievementStats(s: PlayerState): AchievementStats {
  return {
    missionsCompleted: s.missionsCompleted,
    hearts: s.hearts,
    level: s.level,
    streak: s.streak,
    correctAnswers: s.correctAnswers,
    phasesCompleted: Object.keys(s.phaseStars).length,
  };
}

export type ApplyRunOutcome = {
  leveledUp: boolean;
  newLevel: number;
  newAchievements: string[];
  completedMissions: string[];
};

export function applyRun(result: RunResult): ApplyRunOutcome {
  const s = { ...state };
  const today = new Date().toDateString();
  if (s.lastPlayed !== today) {
    const diff = s.lastPlayed
      ? Math.round((new Date(today).getTime() - new Date(s.lastPlayed).getTime()) / 86400000)
      : 999;
    s.streak = diff === 1 ? s.streak + 1 : 1;
    s.lastPlayed = today;
  }

  s.xp += result.xp;
  s.totalXp += result.xp;
  s.score += result.score;
  s.bestScore = Math.max(s.bestScore, result.score);
  s.bags += result.bags;
  s.hearts += result.hearts;
  s.stars += result.stars;
  s.correctAnswers += result.correct;
  s.runs += 1;
  s.bestCombo = Math.max(s.bestCombo, result.bestCombo);
  s.coins += Math.round(result.score / 20) + result.correct * 10;
  s.lastResult = result;

  let leveledUp = false;
  while (s.xp >= xpForLevel(s.level)) {
    s.xp -= xpForLevel(s.level);
    s.level += 1;
    leveledUp = true;
  }

  if (result.completed) {
    const earned = result.correct >= 8 ? 3 : result.correct >= 5 ? 2 : 1;
    s.phaseStars = { ...s.phaseStars, [result.phaseId]: Math.max(s.phaseStars[result.phaseId] ?? 0, earned) };
    if (result.phaseId >= s.unlockedPhase && s.unlockedPhase < PHASES.length) {
      s.unlockedPhase = result.phaseId + 1;
    }
  }

  const progress = { ...s.missionProgress };
  const completedMissions: string[] = [];
  for (const m of DAILY_MISSIONS) {
    const before = progress[m.id] ?? 0;
    if (before >= m.goal) continue;
    const delta =
      m.metric === "bags"
        ? result.bags
        : m.metric === "correct"
          ? result.correct
          : m.metric === "runs"
            ? 1
            : result.bestCombo;
    const next = m.metric === "combo" ? Math.max(before, delta) : before + delta;
    progress[m.id] = next;
    if (next >= m.goal) {
      completedMissions.push(m.id);
      s.missionsCompleted += 1;
      s.xp += m.xp;
      s.totalXp += m.xp;
      s.coins += m.coins;
    }
  }
  s.missionProgress = progress;

  while (s.xp >= xpForLevel(s.level)) {
    s.xp -= xpForLevel(s.level);
    s.level += 1;
    leveledUp = true;
  }

  const stats = achievementStats(s);
  const newAchievements = ACHIEVEMENTS.filter(
    (a) => a.check(stats) && !s.unlockedAchievements.includes(a.id),
  ).map((a) => a.id);
  s.unlockedAchievements = [...s.unlockedAchievements, ...newAchievements];

  state = s;
  persist();
  emit();

  return { leveledUp, newLevel: s.level, newAchievements, completedMissions };
}

export function resetProgress() {
  state = { ...initialState, name: state.name, avatar: state.avatar, loggedIn: state.loggedIn };
  persist();
  emit();
}

export { xpForLevel };
