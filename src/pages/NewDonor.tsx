import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const NewDonor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", city: "" });

  const isValid = form.name.trim() && form.age && form.city.trim();

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        name: form.name,
        city: form.city,
        is_existing_donor: false,
      });
      if (error) throw error;
      navigate("/eligibility-quiz");
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
        <h1 className="text-2xl font-bold text-foreground mb-1">Quero doar 🩸</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Vamos ver se você pode doar. Primeiro, nos conte sobre você.
        </p>

        <div className="flex flex-col gap-5 flex-1">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Idade</label>
            <input
              type="number"
              placeholder="Ex: 25"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
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

export default NewDonor;
