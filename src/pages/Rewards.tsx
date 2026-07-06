import { useEffect, useState } from "react";
import { Gift, Star, Trophy, Check, Loader2 } from "lucide-react";
import { rewards, Reward, POINTS_PER_DONATION } from "@/data/rewards";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { successHaptic, tapHaptic } from "@/lib/native";
import BottomNav from "@/components/BottomNav";

const Rewards = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

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
      setLoading(false);
    };
    load();
  }, [user]);

  const handleRedeem = async (reward: Reward) => {
    if (!user || redeeming) return;
    if (points < reward.pointsCost) {
      tapHaptic();
      toast({ title: "Pontos insuficientes", description: `Faltam ${reward.pointsCost - points} pontos.`, variant: "destructive" });
      return;
    }

    setRedeeming(reward.id);
    try {
      const { error } = await supabase.rpc("redeem_reward", { _reward_id: reward.id });
      if (error) throw error;

      const { data: p } = await supabase
        .from("profiles").select("reward_points").eq("user_id", user.id).maybeSingle();
      if (p) setPoints(p.reward_points);
      setRedeemedIds((prev) => (prev.includes(reward.id) ? prev : [...prev, reward.id]));
      successHaptic();
      toast({ title: "Resgatado! 🎉", description: reward.title });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Tente novamente.";
      toast({ title: "Erro ao resgatar", description: msg, variant: "destructive" });
    } finally {
      setRedeeming(null);
    }

  };

  const filtered = filter === "all" ? rewards : rewards.filter((r) => r.category === filter);

  const levelInfo = points >= 1000
    ? { label: "Doador Ouro 🥇", desc: "Você é um herói do RS!", next: null }
    : points >= 500
    ? { label: "Doador Prata 🥈", desc: `Faltam ${1000 - points} pts para Ouro`, next: 1000 }
    : { label: "Doador Bronze 🥉", desc: `Faltam ${500 - points} pts para Prata`, next: 500 };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-nav animate-page-in">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-page pt-10 pb-8 rounded-b-[2rem] relative overflow-hidden">
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

      <div className="px-page -mt-4 relative z-10 container-mobile-lg">
        {/* Level with progress */}
        <div className="rounded-2xl bg-card border border-border p-4 mb-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{levelInfo.label}</p>
              <p className="text-xs text-muted-foreground">{levelInfo.desc}</p>
            </div>
          </div>
          {levelInfo.next && (
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (points / levelInfo.next) * 100)}%` }}
              />
            </div>
          )}
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
              className={`whitespace-nowrap text-sm px-4 py-2 rounded-full border transition-all active:scale-[0.97] ${
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
            const isRedeeming = redeeming === reward.id;
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
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] text-primary font-medium mt-1">Resgatado</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || !!isRedeeming}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 ${
                      canAfford
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Resgatar"}
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
