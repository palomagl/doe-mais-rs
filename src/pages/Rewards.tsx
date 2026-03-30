import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, Star, Trophy, Check } from "lucide-react";
import { rewards, Reward, POINTS_PER_DONATION } from "@/data/rewards";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo-doers.png";

const categoryLabels: Record<string, string> = {
  food: "Alimentação",
  health: "Saúde",
  entertainment: "Lazer",
  transport: "Transporte",
};

const Rewards = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const storedPoints = localStorage.getItem("rewardPoints");
    if (storedPoints) setPoints(Number(storedPoints));
    const storedRedeemed = localStorage.getItem("redeemedRewards");
    if (storedRedeemed) setRedeemedIds(JSON.parse(storedRedeemed));
  }, []);

  const handleRedeem = (reward: Reward) => {
    if (points < reward.pointsCost) {
      toast({
        title: "Pontos insuficientes",
        description: `Você precisa de mais ${reward.pointsCost - points} pontos.`,
        variant: "destructive",
      });
      return;
    }

    const newPoints = points - reward.pointsCost;
    setPoints(newPoints);
    localStorage.setItem("rewardPoints", String(newPoints));

    const newRedeemed = [...redeemedIds, reward.id];
    setRedeemedIds(newRedeemed);
    localStorage.setItem("redeemedRewards", JSON.stringify(newRedeemed));

    toast({
      title: "Recompensa resgatada! 🎉",
      description: `Você resgatou: ${reward.title}`,
    });
  };

  const filteredRewards = filter === "all" ? rewards : rewards.filter((r) => r.category === filter);
  const donationsCount = Math.floor(points / POINTS_PER_DONATION) || Number(localStorage.getItem("donations") ? JSON.parse(localStorage.getItem("donations")!).length : 0);

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/dashboard")} className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Recompensas</h1>
      </div>

      {/* Points Card */}
      <div className="rounded-2xl bg-primary text-primary-foreground p-6 mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Seus pontos</span>
          </div>
          <p className="text-4xl font-extrabold mb-1">{points}</p>
          <p className="text-sm opacity-80">+{POINTS_PER_DONATION} pontos por doação</p>
        </div>
      </div>

      {/* Level Badge */}
      <div className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
          <Trophy className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-bold text-foreground">
            {points >= 1000 ? "Doador Ouro 🥇" : points >= 500 ? "Doador Prata 🥈" : "Doador Bronze 🥉"}
          </p>
          <p className="text-xs text-muted-foreground">
            {points >= 1000
              ? "Você é um herói do RS!"
              : `Faltam ${(points >= 500 ? 1000 : 500) - points} pts para o próximo nível`}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {[
          { key: "all", label: "Todos" },
          { key: "food", label: "🍽 Alimentação" },
          { key: "health", label: "💊 Saúde" },
          { key: "entertainment", label: "🎬 Lazer" },
          { key: "transport", label: "🚗 Transporte" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`whitespace-nowrap text-sm px-4 py-2 rounded-full border transition-all ${
              filter === cat.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Rewards List */}
      <div className="flex flex-col gap-3">
        {filteredRewards.map((reward) => {
          const isRedeemed = redeemedIds.includes(reward.id);
          const canAfford = points >= reward.pointsCost;

          return (
            <div
              key={reward.id}
              className={`rounded-2xl bg-card border p-4 flex items-center gap-4 transition-all ${
                isRedeemed ? "border-primary/30 opacity-70" : "border-border"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl shrink-0">
                {reward.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{reward.title}</p>
                <p className="text-xs text-muted-foreground truncate">{reward.partner}</p>
                <p className="text-xs text-primary font-bold mt-1">{reward.pointsCost} pts</p>
              </div>
              {isRedeemed ? (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-primary" />
                </div>
              ) : (
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    canAfford
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Resgatar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;
