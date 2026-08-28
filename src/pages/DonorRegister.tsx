import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { capitalizeWords, formatCpf, isCpf, normalizeText } from "@/lib/format";
import { rsCities } from "@/data/rsCities";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sex: "",
    bloodType: "",
    city: "",
    cpf: "",
    birthDate: "",
    lastDonation: "",
  });

  const filteredCities = rsCities.filter((c) =>
    normalizeText(c).includes(normalizeText(form.city))
  );

  const validCity = Boolean(
    form.city.trim() &&
      rsCities.some((c) => normalizeText(c) === normalizeText(form.city))
  );
  const cityError = form.city.trim() && !validCity ? "Escolha uma cidade válida do RS." : null;

  const birthTimestamp = form.birthDate ? Date.parse(form.birthDate) : NaN;
  const isValidBirthDate =
    Boolean(form.birthDate) &&
    !Number.isNaN(birthTimestamp) &&
    birthTimestamp <= Date.now();
  const birthDateError = form.birthDate && !isValidBirthDate ? "Data inválida." : null;

  const cpfError = form.cpf && !isCpf(form.cpf) ? "CPF inválido." : null;
  const isValid =
    form.name.trim().length >= 2 &&
    form.sex &&
    form.bloodType &&
    validCity &&
    isCpf(form.cpf) &&
    isValidBirthDate;

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        name: capitalizeWords(form.name.trim()),
        sex: form.sex,
        blood_type: form.bloodType,
        city: form.city.trim(),
        cpf: form.cpf.trim(),
        birth_date: form.birthDate || null,
        last_donation: form.lastDonation || null,
        is_existing_donor: true,
      });
      if (error) {
        if (error.message.includes("duplicate") || error.code === "23505") {
          toast({ title: "Perfil já existe", description: "Você já tem um cadastro.", variant: "destructive" });
          navigate("/dashboard");
          return;
        }
        throw error;
      }
      navigate("/dashboard");
    } catch (e) {
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
        <h1 className="text-2xl font-bold text-foreground mb-1">Sou doador ❤️</h1>
        <p className="text-muted-foreground text-sm mb-6">Preencha seus dados para acompanhar suas doações.</p>

        <div className="flex flex-col gap-5 flex-1">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nome completo *</label>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: capitalizeWords(e.target.value) })}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Sexo *</label>
            <div className="flex gap-2">
              {["Masculino", "Feminino", "Outro"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, sex: s })}
                  className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all active:scale-[0.97] ${
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
            <label className="text-sm font-medium text-foreground mb-1.5 block">Tipo sanguíneo *</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodTypes.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => setForm({ ...form, bloodType: bt })}
                  className={`rounded-xl border py-3 text-sm font-bold transition-all active:scale-[0.97] ${
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">CPF *</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                inputMode="numeric"
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {cpfError && <p className="text-xs text-destructive mt-1">{cpfError}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Data de nascimento *</label>
              <input
                type="date"
                value={form.birthDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {birthDateError && <p className="text-xs text-destructive mt-1">{birthDateError}</p>}
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-foreground mb-1.5 block">Cidade *</label>
            <input
              type="text"
              placeholder="Ex: Porto Alegre"
              value={form.city}
              onChange={(e) => { setForm({ ...form, city: e.target.value }); setShowCities(true); }}
              onFocus={() => setShowCities(true)}
              onBlur={() => setTimeout(() => setShowCities(false), 200)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {cityError && <p className="text-xs text-destructive mt-1">{cityError}</p>}
            {showCities && (
              <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-xl mt-1 shadow-lg z-20 max-h-40 overflow-y-auto">
                {filteredCities.length > 0 ? (
                  filteredCities.slice(0, 5).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onMouseDown={() => { setForm({ ...form, city: c }); setShowCities(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      {c}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">Nenhuma cidade encontrada.</div>
                )}
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

export default DonorRegister;
