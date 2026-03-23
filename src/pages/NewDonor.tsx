import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const NewDonor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", age: "", city: "" });

  const isValid = form.name.trim() && form.age && form.city.trim();

  const handleSubmit = () => {
    if (isValid) {
      localStorage.setItem("newDonor", JSON.stringify(form));
      navigate("/eligibility-quiz");
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col">
      <button onClick={() => navigate("/")} className="text-muted-foreground mb-6 flex items-center gap-1 text-sm">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">Quero doar 🩸</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Vamos ver se você pode doar agora. Primeiro, nos conte um pouco sobre você.
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
        disabled={!isValid}
        className="mt-8 w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-semibold text-lg shadow-lg disabled:opacity-40 disabled:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Continuar <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NewDonor;
