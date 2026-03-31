import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Star, Trophy, Check } from "lucide-react";
import { rewards, Reward, POINTS_PER_DONATION } from "@/data/rewards";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

const Rewards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("reward_points")
        .eq("user_id", user.id)
        .maybeSingle();
      if (p) setPoints(p.reward_points);

      const { data: r } = await supabase
        .from("redeemed_rewards")
        .select("reward_id")
        .eq("user_id", user.id);
      if (r) setRedeemedIds(r.map((x) => x.reward_id));
    };
    load();
  }, [user]);

  const handleRedeem = async (reward: Reward) => {
    if (!user) return;
    if (points < reward.pointsCost) {
      toast({ title: "Pontos insuficientes", description: `Faltam ${reward.pointsCost - points} pontos.`, variant: "destructive" });
      return;
    }

    const newPoints = points - reward.pointsCost;
    await supabase.from("profiles").update({ reward_points: newPoints }).eq("user_id", user.id);
    await supabase.from("redeemed_rewards").insert({ user_id: user.id, reward_id: reward.id });

    setPoints(newPoints);
    setRedeemedIds([...redeemedIds, reward.id]);
    toast({ title: "Resgatado! 🎉", description: reward.title });
  };

  const filtered = filter === "all" ? rewards : rewards.filter((r) => r.category === filter);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-10 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Seus pontos</span>
          </div>
          <p className="text-4xl font-extrabold">{points}</p>
          <p className="text-sm opacity-80 mt-1">+{POINTS_PER_DONATION} pontos por doação</p>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-10">
        {/* Level */}
        <div className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4 mb-5 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
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

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {[
            { key: "all", label: "Todos" },
            { key: "food", label: "🍽 Comida" },
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
                  : "bg-card text-foreground border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.map((reward) => {
            const isRedeemed = redeemedIds.includes(reward.id);
            const canAfford = points >= reward.pointsCost;
            return (
              <div
                key={reward.id}
                className={`rounded-2xl bg-card border p-4 flex items-center gap-3 transition-all ${
                  isRedeemed ? "border-primary/30 opacity-60" : "border-border"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl shrink-0">
                  {reward.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{reward.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{reward.partner}</p>
                  <p className="text-xs text-primary font-bold mt-0.5">{reward.pointsCost} pts</p>
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
                        ? "bg-primary text-primary-foreground active:scale-95"
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

      <BottomNav />
    </div>
  );
};

export default Rewards;
