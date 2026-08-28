import { useState } from "react";
import { AppShell } from "@/game/GameShell";
import { MOCK_RANKING } from "@/game/gameData";
import { usePlayer } from "@/game/usePlayer";
import { playSound } from "@/game/sound";


const MEDALS = ["🥇", "🥈", "🥉"];

export default function RankingPage() {
  const player = usePlayer();
  const [tab, setTab] = useState<"weekly" | "all">("weekly");

  const list = [
    ...MOCK_RANKING.map((r) => ({ ...r, isMe: false })),
    {
      id: "me",
      name: player.name,
      city: player.city,
      xp: player.totalXp,
      weeklyXp: player.totalXp,
      isMe: true,
    },
  ].sort((a, b) => (tab === "weekly" ? b.weeklyXp - a.weeklyXp : b.xp - a.xp));

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-black">Ranking</h1>

      <div className="mt-4 flex rounded-2xl bg-secondary p-1">
        {(["weekly", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              playSound("click");
              setTab(t);
            }}
            className={`flex-1 rounded-xl py-2.5 text-xs font-extrabold transition-all ${
              tab === t ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
            }`}
          >
            {t === "weekly" ? "SEMANAL" : "GERAL"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2 pb-6">
        {list.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${
              p.isMe
                ? "border-primary bg-primary-soft shadow-soft"
                : "border-border bg-card shadow-soft"
            }`}
          >
            <span className="w-7 text-center font-display text-sm font-black">
              {MEDALS[i] ?? i + 1}
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-lg">
              {p.isMe ? player.avatar : "🦸"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {p.name} {p.isMe && <span className="text-primary">(você)</span>}
              </p>
              <p className="text-[11px] text-muted-foreground">{p.city}</p>
            </div>
            <span className="font-display text-sm font-extrabold text-primary">
              {(tab === "weekly" ? p.weeklyXp : p.xp).toLocaleString("pt-BR")} XP
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
