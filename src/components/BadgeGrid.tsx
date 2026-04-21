import { BADGES, badgesEarned } from "@/data/badges";
import { Lock } from "lucide-react";

interface Props {
  donationCount: number;
  compact?: boolean;
}

const BadgeGrid = ({ donationCount, compact = false }: Props) => {
  const earned = new Set(badgesEarned(donationCount).map((b) => b.id));
  const list = compact ? BADGES.slice(0, 4) : BADGES;

  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-4" : "grid-cols-3"}`}>
      {list.map((badge) => {
        const unlocked = earned.has(badge.id);
        return (
          <div
            key={badge.id}
            className={`rounded-2xl p-3 text-center border transition-all ${
              unlocked
                ? "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-300 dark:border-amber-700 shadow-sm"
                : "bg-muted/30 border-border opacity-60"
            }`}
          >
            <div className={`text-3xl mb-1 ${unlocked ? "" : "grayscale"}`}>
              {unlocked ? badge.icon : <Lock className="w-6 h-6 mx-auto text-muted-foreground" />}
            </div>
            <p className="text-[10px] font-bold text-foreground leading-tight">{badge.title}</p>
            {!compact && (
              <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
                {unlocked ? "Conquistado!" : `${badge.requirement} doaç${badge.requirement === 1 ? "ão" : "ões"}`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BadgeGrid;
