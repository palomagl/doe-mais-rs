import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    sex: "",
    bloodType: "",
    city: "",
    lastDonation: "",
  });

  const isValid = form.name && form.sex && form.bloodType && form.city;

  const handleSubmit = () => {
    if (isValid) {
      localStorage.setItem("donor", JSON.stringify(form));
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col">
      <button onClick={() => navigate("/")} className="text-muted-foreground mb-6 flex items-center gap-1 text-sm">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">Sou doador ❤️</h1>
      <p className="text-muted-foreground text-sm mb-8">Preencha seus dados para acompanhar suas doações.</p>

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
          <div className="flex gap-3">
            {["Masculino", "Feminino", "Outro"].map((s) => (
              <button
                key={s}
                onClick={() => setForm({ ...form, sex: s })}
                className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                  form.sex === s
                    ? "border-primary bg-accent text-accent-foreground"
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
                    ? "border-primary bg-primary text-primary-foreground"
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
        disabled={!isValid}
        className="mt-8 w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-semibold text-lg shadow-lg disabled:opacity-40 disabled:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Continuar <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DonorRegister;
