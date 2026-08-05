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
import { useGuest, useRequireAccount } from "@/lib/guest";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import ImpactCounter from "@/components/ImpactCounter";
import BadgeGrid from "@/components/BadgeGrid";
import ShareButton from "@/components/ShareButton";
import { successHaptic, tapHaptic } from "@/lib/native";
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
  const guest = useGuest();
  const requireAccount = useRequireAccount();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (guest) {
      setProfile({ name: "Visitante", sex: "", blood_type: "", city: "", last_donation: null, reward_points: 0 });
      setDonations([]);
      setUnlockedBadges(new Set());
      return;
    }
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
  }, [user, guest, navigate]);

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




  const addDonation = async () => {
    if (requireAccount("registrar doações")) return;
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
      const { error: rpcErr } = await supabase.rpc("record_donation", {
        _location: "Hemocentro RS",
        _date: today,
      });
      if (rpcErr) throw rpcErr;

      // Refresh authoritative data from server
      const [{ data: p }, { data: d }, { data: b }] = await Promise.all([
        supabase.from("profiles")
          .select("name, sex, blood_type, city, last_donation, reward_points")
          .eq("user_id", user.id).maybeSingle(),
        supabase.from("donations").select("id, date, location")
          .eq("user_id", user.id).order("date", { ascending: false }),
        supabase.from("user_badges").select("badge_id").eq("user_id", user.id),
      ]);
      if (p) setProfile(p);
      if (d) setDonations(d);

      const prevBadgeIds = unlockedBadges;
      const nextIds = new Set((b ?? []).map((x) => x.badge_id));
      setUnlockedBadges(nextIds);

      celebrateDonation();
      successHaptic();
      toast({ title: "Doação registrada! 🎉", description: `+${POINTS_PER_DONATION} pontos · 4 vidas salvas!` });

      const newlyUnlocked = [...nextIds].filter((id) => !prevBadgeIds.has(id));
      if (newlyUnlocked.length > 0) {
        const badge = BADGES.find((x) => x.id === newlyUnlocked[0]);
        setTimeout(() => {
          celebrateBadge();
          successHaptic();
          if (badge) toast({ title: `${badge.icon} Nova conquista!`, description: badge.title });
        }, 800);
      }
    } catch (err) {
      tapHaptic();
      const msg = err instanceof Error ? err.message : "Tente novamente.";
      toast({ title: "Erro ao registrar", description: msg, variant: "destructive" });
    } finally {
      setLoadingAdd(false);
    }
  };


  const earnedCount = badgesEarned(donationCount).length;

  return (
    <div className="min-h-screen pb-nav animate-page-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-red-700 text-primary-foreground px-page pt-9 pb-12 rounded-b-[2rem] relative overflow-hidden shadow-soft-lg">
        <div className="absolute -top-12 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="flex items-center justify-between gap-3 relative z-10 container-mobile-lg mx-auto">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img src={logo} alt="Doe+ RS" width={36} height={36} className="rounded-xl shrink-0 bg-white/15 p-1 backdrop-blur" />
            <div className="min-w-0">
              <p className="text-[11px] opacity-80 leading-none">Olá,</p>
              <p className="font-extrabold text-[17px] truncate mt-1">{profile.name.split(" ")[0]} 👋</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {profile.blood_type && (
              <span className="bg-white/20 backdrop-blur text-sm font-extrabold px-3 py-1.5 rounded-full ring-1 ring-white/30">
                {profile.blood_type}
              </span>
            )}
            <ShareButton
              variant="icon"
              label="Convidar amigos"
              text={`${profile.name?.split(" ")[0] || "Eu"} está usando o Doe+ RS para salvar vidas no Rio Grande do Sul. Vem doar comigo! 🩸`}
            />
          </div>
        </div>
      </div>


      <div className="px-page -mt-7 relative z-10 container-mobile-lg flex flex-col gap-4">

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
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-card border border-border p-3 text-center shadow-soft">
            <Calendar className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-xl font-extrabold text-foreground leading-none">{donationCount}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Doações</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-3 text-center shadow-soft">
            <Gift className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-xl font-extrabold text-foreground leading-none">{profile.reward_points}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Pontos</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-3 text-center shadow-soft">
            <Award className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-xl font-extrabold text-foreground leading-none">{earnedCount}<span className="text-xs text-muted-foreground font-bold">/{BADGES.length}</span></p>
            <p className="text-[10px] text-muted-foreground mt-1">Conquistas</p>
          </div>
        </div>


        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => navigate("/centers")}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3 hover:border-primary transition-all active:scale-[0.97] shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">Hemocentros</span>
          </button>
          <button
            onClick={addDonation}
            disabled={loadingAdd}
            className={`flex flex-col items-center gap-1.5 rounded-2xl bg-card border p-3 transition-all active:scale-[0.97] shadow-soft ${
              canDonate ? "border-primary/60 hover:border-primary" : "border-border opacity-60"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${canDonate ? "bg-primary/10" : "bg-muted"}`}>
              {loadingAdd ? <Droplets className="w-5 h-5 text-primary animate-pulse" /> : <Plus className="w-5 h-5 text-primary" />}
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">Registrar</span>
          </button>
          <button
            onClick={() => navigate("/rewards")}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3 hover:border-primary transition-all active:scale-[0.97] shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">Prêmios</span>
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
          <div className="flex-1 min-w-0">
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
