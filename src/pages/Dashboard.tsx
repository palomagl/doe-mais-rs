import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Droplets, AlertTriangle, Plus, Gift } from "lucide-react";
import { POINTS_PER_DONATION } from "@/data/rewards";
import { differenceInDays, format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import logo from "@/assets/logo-doers.png";

interface DonorData {
  name: string;
  sex: string;
  bloodType: string;
  city: string;
  lastDonation: string;
}

interface Donation {
  date: string;
  location: string;
}

const DONATION_INTERVAL_DAYS_M = 60;
const DONATION_INTERVAL_DAYS_F = 90;

const Dashboard = () => {
  const navigate = useNavigate();
  const [donor, setDonor] = useState<DonorData | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("donor");
    if (!stored) {
      navigate("/");
      return;
    }
    setDonor(JSON.parse(stored));
    const storedDonations = localStorage.getItem("donations");
    if (storedDonations) setDonations(JSON.parse(storedDonations));
  }, [navigate]);

  if (!donor) return null;

  const interval = donor.sex === "Feminino" ? DONATION_INTERVAL_DAYS_F : DONATION_INTERVAL_DAYS_M;
  const lastDonationDate = donor.lastDonation ? new Date(donor.lastDonation) : null;
  const nextDonationDate = lastDonationDate ? addDays(lastDonationDate, interval) : null;
  const daysUntilNext = nextDonationDate ? differenceInDays(nextDonationDate, new Date()) : 0;
  const canDonate = !lastDonationDate || daysUntilNext <= 0;

  const addDonation = () => {
    const newDonation: Donation = {
      date: new Date().toISOString().split("T")[0],
      location: "Hemocentro RS",
    };
    const updated = [newDonation, ...donations];
    setDonations(updated);
    localStorage.setItem("donations", JSON.stringify(updated));
    const updatedDonor = { ...donor, lastDonation: newDonation.date };
    setDonor(updatedDonor);
    localStorage.setItem("donor", JSON.stringify(updatedDonor));

    // Add reward points
    const currentPoints = Number(localStorage.getItem("rewardPoints") || "0");
    const newPoints = currentPoints + POINTS_PER_DONATION;
    localStorage.setItem("rewardPoints", String(newPoints));
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Doe+ RS" width={40} height={40} />
          <div>
            <p className="text-sm text-muted-foreground">Olá,</p>
            <p className="font-bold text-foreground">{donor.name.split(" ")[0]}</p>
          </div>
        </div>
        <span className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1.5 rounded-full">
          {donor.bloodType}
        </span>
      </div>

      {/* Status Card */}
      <div className={`rounded-2xl p-6 mb-6 shadow-md ${canDonate ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
        {canDonate ? (
          <>
            <Droplets className="w-8 h-8 mb-3 opacity-80" />
            <h2 className="text-xl font-bold mb-1">Você pode doar!</h2>
            <p className="text-sm opacity-80">Encontre um hemocentro perto de você.</p>
          </>
        ) : (
          <>
            <Clock className="w-8 h-8 mb-3 text-warning" />
            <h2 className="text-xl font-bold mb-1">Aguarde {daysUntilNext} dias</h2>
            <p className="text-sm text-muted-foreground">
              Próxima doação: {nextDonationDate && format(nextDonationDate, "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <button
          onClick={() => navigate("/centers")}
          className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-5 hover:border-primary transition-all active:scale-[0.98]"
        >
          <MapPin className="w-6 h-6 text-primary" />
          <span className="text-xs font-medium text-foreground">Hemocentros</span>
        </button>
        <button
          onClick={addDonation}
          className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-5 hover:border-primary transition-all active:scale-[0.98]"
        >
          <Plus className="w-6 h-6 text-primary" />
          <span className="text-xs font-medium text-foreground">Registrar</span>
        </button>
        <button
          onClick={() => navigate("/rewards")}
          className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-5 hover:border-primary transition-all active:scale-[0.98]"
        >
          <Gift className="w-6 h-6 text-primary" />
          <span className="text-xs font-medium text-foreground">Recompensas</span>
        </button>
      </div>

      {/* Alert */}
      <div className="rounded-2xl bg-accent border border-border p-4 flex items-start gap-3 mb-8">
        <AlertTriangle className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-accent-foreground">Estoque baixo: O-</p>
          <p className="text-xs text-muted-foreground">O tipo O- está em falta no RS. Se puder, doe!</p>
        </div>
      </div>

      {/* History */}
      <h3 className="font-bold text-foreground mb-4">Histórico de doações</h3>
      {donations.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma doação registrada ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {donations.map((d, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl bg-card border border-border p-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
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
  );
};

export default Dashboard;
