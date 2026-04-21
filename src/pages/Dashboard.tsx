import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Droplets, AlertTriangle, Plus, Gift, Calendar, TrendingUp, Award, Scale, ChevronRight } from "lucide-react";
import { POINTS_PER_DONATION } from "@/data/rewards";
import { BADGES, badgesEarned } from "@/data/badges";
import { celebrateDonation, celebrateBadge } from "@/lib/celebrate";
import { differenceInDays, format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import ImpactCounter from "@/components/ImpactCounter";
import BadgeGrid from "@/components/BadgeGrid";
import logo from "@/assets/logo-doers.png";

interface Profile {
  name: string;
  sex: string;
  blood_type: string;
  city: string;
  last_donation: string | null;
  reward_points: number;
}

interface Donation {
  id: string;
  date: string;
  location: string;
}

// Per spec: Male 90 / Female 60 days
const DONATION_INTERVAL_DAYS_M = 90;
const DONATION_INTERVAL_DAYS_F = 60;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const { data: p, error: pErr } = await supabase
        .from("profiles")
        .select("name, sex, blood_type, city, last_donation, reward_points")
        .eq("user_id", user.id)
        .maybeSingle();

      if (pErr) throw pErr;
      if (!p) { navigate("/", { replace: true }); return; }
      setProfile(p);

      const { data: d } = await supabase
        .from("donations").select("id, date, location")
        .eq("user_id", user.id).order("date", { ascending: false });
      if (d) setDonations(d);

      const { data: b } = await supabase
        .from("user_badges").select("badge_id").eq("user_id", user.id);
      if (b) setUnlockedBadges(new Set(b.map((x) => x.badge_id)));
    } catch {
      setError(true);
    }
  }, [user, navigate]);

  useEffect(() => { load(); }, [load]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-10 h-10 text-destructive mb-4" />
        <p className="text-foreground font-bold mb-2">Erro ao carregar dados</p>
        <button onClick={() => { setError(false); load(); }} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Droplets className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  const interval = profile.sex === "Feminino" ? DONATION_INTERVAL_DAYS_F : DONATION_INTERVAL_DAYS_M;
  const lastDate = profile.last_donation ? new Date(profile.last_donation) : null;
  const nextDate = lastDate ? addDays(lastDate, interval) : null;
  const daysLeft = nextDate ? differenceInDays(nextDate, new Date()) : 0;
  const canDonate = !lastDate || daysLeft <= 0;
  const donationCount = donations.length;

  const checkAndUnlockBadges = async (newCount: number) => {
    const earned = badgesEarned(newCount);
    const newOnes = earned.filter((b) => !unlockedBadges.has(b.id));
    if (newOnes.length === 0) return;
    const inserts = newOnes.map((b) => ({ user_id: user!.id, badge_id: b.id }));
    await supabase.from("user_badges").insert(inserts);
    const next = new Set(unlockedBadges);
    newOnes.forEach((b) => next.add(b.id));
    setUnlockedBadges(next);
    setTimeout(() => {
      celebrateBadge();
      toast({ title: `${newOnes[0].icon} Nova conquista!`, description: newOnes[0].title });
    }, 800);
  };

  const addDonation = async () => {
    if (!user || loadingAdd) return;
    if (!canDonate) {
      toast({
        title: "Ainda não é hora",
        description: `Aguarde mais ${daysLeft} dias para a próxima doação.`,
        variant: "destructive",
      });
      return;
    }
    setLoadingAdd(true);
    const today = new Date().toISOString().split("T")[0];
    try {
      const { error: insErr } = await supabase.from("donations").insert({
        user_id: user.id, date: today, location: "Hemocentro RS",
      });
      if (insErr) throw insErr;

      const newPoints = profile.reward_points + POINTS_PER_DONATION;
      const { error: updErr } = await supabase
        .from("profiles").update({ last_donation: today, reward_points: newPoints })
        .eq("user_id", user.id);
      if (updErr) throw updErr;

      const newDonations = [{ id: crypto.randomUUID(), date: today, location: "Hemocentro RS" }, ...donations];
      setProfile({ ...profile, last_donation: today, reward_points: newPoints });
      setDonations(newDonations);
      celebrateDonation();
      toast({ title: "Doação registrada! 🎉", description: `+${POINTS_PER_DONATION} pontos · 4 vidas salvas!` });
      checkAndUnlockBadges(newDonations.length);
    } catch {
      toast({ title: "Erro ao registrar", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setLoadingAdd(false);
    }
  };

  const earnedCount = badgesEarned(donationCount).length;

  return (
    <div className="min-h-screen bg-background pb-nav">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-page pt-10 pb-10 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-2 -left-6 w-20 h-20 bg-white/5 rounded-full" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Doe+ RS" width={36} height={36} className="rounded-xl" />
            <div>
              <p className="text-xs opacity-80">Olá,</p>
              <p className="font-bold text-lg">{profile.name.split(" ")[0]} 👋</p>
            </div>
          </div>
          {profile.blood_type && (
            <span className="bg-white/20 backdrop-blur text-sm font-bold px-3 py-1.5 rounded-full">
              {profile.blood_type}
            </span>
          )}
        </div>
      </div>

      <div className="px-page -mt-6 relative z-10 container-mobile-lg flex flex-col gap-5">
        {/* Impact */}
        <ImpactCounter donationCount={donationCount} />

        {/* Status */}
        <div className={`rounded-2xl p-5 shadow-md ${
          canDonate ? "bg-card border-2 border-primary" : "bg-card border border-border"
        }`}>
          {canDonate ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground">Você está apto a doar! 🩸</h2>
                <p className="text-sm text-muted-foreground">Encontre um hemocentro perto de você.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--warning))]/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-[hsl(var(--warning))]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground">Período de espera</h2>
                <p className="text-sm text-muted-foreground">
                  Faltam {daysLeft} dias · {nextDate && format(nextDate, "dd 'de' MMM", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-card border border-border p-3 text-center">
            <Calendar className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{donationCount}</p>
            <p className="text-[10px] text-muted-foreground">Doações</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-3 text-center">
            <Gift className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{profile.reward_points}</p>
            <p className="text-[10px] text-muted-foreground">Pontos</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-3 text-center">
            <Award className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{earnedCount}/{BADGES.length}</p>
            <p className="text-[10px] text-muted-foreground">Conquistas</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate("/centers")}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-4 hover:border-primary transition-all active:scale-[0.97]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">Hemocentros</span>
          </button>
          <button
            onClick={addDonation}
            disabled={loadingAdd}
            className={`flex flex-col items-center gap-2 rounded-2xl bg-card border p-4 transition-all active:scale-[0.97] ${
              canDonate ? "border-primary/50 hover:border-primary" : "border-border opacity-60"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${canDonate ? "bg-primary/10" : "bg-muted"}`}>
              {loadingAdd ? <Droplets className="w-5 h-5 text-primary animate-pulse" /> : <Plus className="w-5 h-5 text-primary" />}
            </div>
            <span className="text-xs font-semibold text-foreground">Registrar</span>
          </button>
          <button
            onClick={() => navigate("/rewards")}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-4 hover:border-primary transition-all active:scale-[0.97]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">Prêmios</span>
          </button>
        </div>

        {/* Badges */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Conquistas</h3>
            <span className="text-xs text-muted-foreground">{earnedCount} desbloqueadas</span>
          </div>
          <BadgeGrid donationCount={donationCount} compact />
        </div>

        {/* Benefits link */}
        <button
          onClick={() => navigate("/benefits")}
          className="rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-center gap-3 active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-200 dark:bg-amber-800 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-amber-700 dark:text-amber-200" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-foreground">Seus benefícios legais</p>
            <p className="text-xs text-muted-foreground">Meia-entrada, isenções e mais</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Alert */}
        <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Estoque baixo: O-</p>
            <p className="text-xs text-muted-foreground">O tipo O- está em falta no RS. Se puder, doe!</p>
          </div>
        </div>

        {/* History */}
        <div>
          <h3 className="font-bold text-foreground mb-3">Histórico de doações</h3>
          {donations.length === 0 ? (
            <div className="rounded-2xl bg-card border border-border p-8 text-center">
              <Droplets className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma doação registrada ainda.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {donations.map((d) => (
                <div key={d.id} className="flex items-center gap-4 rounded-xl bg-card border border-border p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Droplets className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {format(new Date(d.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{d.location}</p>
                  </div>
                  <span className="text-xs text-primary font-bold shrink-0">+{POINTS_PER_DONATION}pts</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
