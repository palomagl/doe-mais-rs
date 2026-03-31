import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Droplets, AlertTriangle, Plus, Gift } from "lucide-react";
import { POINTS_PER_DONATION } from "@/data/rewards";
import { differenceInDays, format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
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

const DONATION_INTERVAL_DAYS_M = 60;
const DONATION_INTERVAL_DAYS_F = 90;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("name, sex, blood_type, city, last_donation, reward_points")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!p) {
        navigate("/", { replace: true });
        return;
      }
      setProfile(p);

      const { data: d } = await supabase
        .from("donations")
        .select("id, date, location")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (d) setDonations(d);
    };
    load();
  }, [user, navigate]);

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

  const addDonation = async () => {
    if (!user) return;
    setLoadingAdd(true);
    const today = new Date().toISOString().split("T")[0];
    try {
      await supabase.from("donations").insert({
        user_id: user.id,
        date: today,
        location: "Hemocentro RS",
      });

      const newPoints = profile.reward_points + POINTS_PER_DONATION;
      await supabase
        .from("profiles")
        .update({ last_donation: today, reward_points: newPoints })
        .eq("user_id", user.id);

      setProfile({ ...profile, last_donation: today, reward_points: newPoints });
      setDonations([{ id: crypto.randomUUID(), date: today, location: "Hemocentro RS" }, ...donations]);
      toast({ title: "Doação registrada! 🎉", description: `+${POINTS_PER_DONATION} pontos` });
    } catch {
      toast({ title: "Erro ao registrar", variant: "destructive" });
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-10 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Doe+ RS" width={36} height={36} className="rounded-xl" />
            <div>
              <p className="text-xs opacity-80">Olá,</p>
              <p className="font-bold text-lg">{profile.name.split(" ")[0]}</p>
            </div>
          </div>
          {profile.blood_type && (
            <span className="bg-white/20 backdrop-blur text-sm font-bold px-3 py-1.5 rounded-full">
              {profile.blood_type}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-10">
        {/* Status */}
        <div className={`rounded-2xl p-5 mb-5 shadow-lg ${
          canDonate
            ? "bg-card border-2 border-primary"
            : "bg-card border border-border"
        }`}>
          {canDonate ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Você pode doar!</h2>
                <p className="text-sm text-muted-foreground">Encontre um hemocentro perto de você.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Aguarde {daysLeft} dias</h2>
                <p className="text-sm text-muted-foreground">
                  Próxima: {nextDate && format(nextDate, "dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
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
            className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-4 hover:border-primary transition-all active:scale-[0.97]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
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

        {/* Alert */}
        <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-4 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Estoque baixo: O-</p>
            <p className="text-xs text-muted-foreground">O tipo O- está em falta no RS. Se puder, doe!</p>
          </div>
        </div>

        {/* Points summary */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 flex items-center gap-3 mb-6">
          <Gift className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{profile.reward_points} pontos</p>
            <p className="text-xs text-muted-foreground">Resgate prêmios na aba Recompensas</p>
          </div>
          <button onClick={() => navigate("/rewards")} className="text-xs text-primary font-bold">Ver →</button>
        </div>

        {/* History */}
        <h3 className="font-bold text-foreground mb-3">Histórico de doações</h3>
        {donations.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma doação registrada ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {donations.map((d) => (
              <div key={d.id} className="flex items-center gap-4 rounded-xl bg-card border border-border p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(d.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-muted-foreground">{d.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
