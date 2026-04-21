import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const rsCities = [
  "Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria",
  "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande",
  "Passo Fundo", "Sapucaia do Sul", "Uruguaiana", "Santa Cruz do Sul", "Bagé",
];

const NewDonor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", city: "" });
  const [citySearch, setCitySearch] = useState("");
  const [showCities, setShowCities] = useState(false);

  const filteredCities = rsCities.filter((c) =>
    c.toLowerCase().includes((form.city || citySearch).toLowerCase())
  );

  const isValid = form.name.trim().length >= 2 && form.age && Number(form.age) >= 16 && Number(form.age) <= 69 && form.city.trim();

  const ageError = form.age && (Number(form.age) < 16 || Number(form.age) > 69)
    ? "A idade deve ser entre 16 e 69 anos."
    : null;

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        name: form.name.trim(),
        city: form.city.trim(),
        is_existing_donor: false,
      });
      if (error) {
        if (error.message.includes("duplicate") || error.code === "23505") {
          toast({ title: "Perfil já existe", description: "Você já tem um cadastro.", variant: "destructive" });
          navigate("/dashboard");
          return;
        }
        throw error;
      }
      navigate("/eligibility-quiz");
    } catch (e: any) {
      toast({ title: "Erro", description: e.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-page pt-6 pb-4 container-mobile-lg w-full">
        <button onClick={() => navigate("/")} className="text-muted-foreground flex items-center gap-1 text-sm active:scale-95">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>

      <div className="px-page pb-8 flex flex-col flex-1 container-mobile-lg w-full">
        <h1 className="text-2xl font-bold text-foreground mb-1">Quero doar 🩸</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Vamos ver se você pode doar. Primeiro, nos conte sobre você.
        </p>

        <div className="flex flex-col gap-5 flex-1">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nome *</label>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Idade *</label>
            <input
              type="number"
              placeholder="Ex: 25"
              min={16}
              max={69}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className={`w-full rounded-xl border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                ageError ? "border-destructive" : "border-input"
              }`}
            />
            {ageError && <p className="text-xs text-destructive mt-1">{ageError}</p>}
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-foreground mb-1.5 block">Cidade *</label>
            <input
              type="text"
              placeholder="Ex: Porto Alegre"
              value={form.city}
              onChange={(e) => {
                setForm({ ...form, city: e.target.value });
                setShowCities(true);
              }}
              onFocus={() => setShowCities(true)}
              onBlur={() => setTimeout(() => setShowCities(false), 200)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {showCities && form.city && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-xl mt-1 shadow-lg z-20 max-h-40 overflow-y-auto">
                {filteredCities.slice(0, 5).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onMouseDown={() => { setForm({ ...form, city: c }); setShowCities(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
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
