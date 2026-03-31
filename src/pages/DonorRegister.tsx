import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sex: "",
    bloodType: "",
    city: "",
    lastDonation: "",
  });

  const isValid = form.name && form.sex && form.bloodType && form.city;

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        name: form.name,
        sex: form.sex,
        blood_type: form.bloodType,
        city: form.city,
        last_donation: form.lastDonation || null,
        is_existing_donor: true,
      });
      if (error) throw error;
      navigate("/dashboard");
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-6 pb-4">
        <button onClick={() => navigate("/")} className="text-muted-foreground flex items-center gap-1 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>

      <div className="px-6 pb-8 flex flex-col flex-1">
        <h1 className="text-2xl font-bold text-foreground mb-1">Sou doador ❤️</h1>
        <p className="text-muted-foreground text-sm mb-6">Preencha seus dados para acompanhar suas doações.</p>

        <div className="flex flex-col gap-5 flex-1">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nome completo</label>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Sexo</label>
            <div className="flex gap-2">
              {["Masculino", "Feminino", "Outro"].map((s) => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, sex: s })}
                  className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                    form.sex === s
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Tipo sanguíneo</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodTypes.map((bt) => (
                <button
                  key={bt}
                  onClick={() => setForm({ ...form, bloodType: bt })}
                  className={`rounded-xl border py-3 text-sm font-bold transition-all ${
                    form.bloodType === bt
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Cidade</label>
            <input
              type="text"
              placeholder="Ex: Porto Alegre"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Data da última doação</label>
            <input
              type="date"
              value={form.lastDonation}
              onChange={(e) => setForm({ ...form, lastDonation: e.target.value })}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-semibold text-lg shadow-lg disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continuar <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
    </div>
  );
};

export default DonorRegister;
