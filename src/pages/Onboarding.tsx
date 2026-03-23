import { useNavigate } from "react-router-dom";
import { Heart, UserPlus } from "lucide-react";
import logo from "@/assets/logo-doers.png";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center gap-4 mb-12">
        <img src={logo} alt="Doe+ RS" width={100} height={100} className="drop-shadow-lg" />
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Doe<span className="text-primary">+</span> RS
        </h1>
        <p className="text-muted-foreground text-center text-sm max-w-xs">
          Salve vidas doando sangue. Simples, rápido e perto de você.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <button
          onClick={() => navigate("/donor-register")}
          className="flex items-center gap-4 w-full rounded-2xl bg-primary text-primary-foreground p-5 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Heart className="w-8 h-8 shrink-0" />
          <div className="text-left">
            <p className="font-bold text-lg">Sou doador</p>
            <p className="text-sm opacity-80">Já doei e quero continuar</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/new-donor")}
          className="flex items-center gap-4 w-full rounded-2xl bg-card text-foreground border border-border p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="w-8 h-8 shrink-0 text-primary" />
          <div className="text-left">
            <p className="font-bold text-lg">Quero doar</p>
            <p className="text-sm text-muted-foreground">Primeira vez? Vamos te ajudar</p>
          </div>
        </button>
      </div>

      <p className="mt-12 text-xs text-muted-foreground text-center">
        Doe+ RS — Incentivando a doação de sangue no Rio Grande do Sul
      </p>
    </div>
  );
};

export default Onboarding;
