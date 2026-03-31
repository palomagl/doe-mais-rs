import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, UserPlus, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo-doers.png";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id, is_existing_donor")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        navigate("/dashboard", { replace: true });
      }
    };
    checkProfile();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground px-6 pt-16 pb-14 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-4 -left-8 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10 flex flex-col items-center">
          <img src={logo} alt="Doe+ RS" width={80} height={80} className="drop-shadow-xl mb-4" />
          <h1 className="text-3xl font-extrabold tracking-tight">
            Doe<span className="opacity-80">+</span> RS
          </h1>
          <p className="text-sm opacity-80 mt-2 text-center max-w-xs">
            Salve vidas doando sangue. Simples, rápido e perto de você.
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex-1 px-6 pt-8 pb-12 flex flex-col">
        <p className="text-sm text-muted-foreground mb-6 text-center">Como podemos te ajudar?</p>

        <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
          <button
            onClick={() => navigate("/donor-register")}
            className="flex items-center gap-4 w-full rounded-2xl bg-primary text-primary-foreground p-5 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Heart className="w-7 h-7" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Sou doador</p>
              <p className="text-sm opacity-80">Já doei e quero continuar</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/new-donor")}
            className="flex items-center gap-4 w-full rounded-2xl bg-card text-foreground border-2 border-border p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shrink-0">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Quero doar</p>
              <p className="text-sm text-muted-foreground">Primeira vez? Vamos te ajudar</p>
            </div>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-auto pt-8 flex justify-center gap-8">
          <div className="text-center">
            <Droplets className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">6</p>
            <p className="text-[10px] text-muted-foreground">Hemocentros</p>
          </div>
          <div className="text-center">
            <Heart className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">4</p>
            <p className="text-[10px] text-muted-foreground">Vidas por doação</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
