import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Clock, Search } from "lucide-react";
import { bloodCenters } from "@/data/bloodCenters";

const BloodCenters = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = bloodCenters.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <button onClick={() => navigate(-1)} className="text-muted-foreground mb-6 flex items-center gap-1 text-sm">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">Hemocentros 📍</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Encontre o hemocentro mais próximo de você no RS.
      </p>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((center) => (
          <div
            key={center.id}
            className="rounded-2xl bg-card border border-border p-5 hover:border-primary transition-all"
          >
            <h3 className="font-bold text-foreground mb-2">{center.name}</h3>
            <div className="flex items-start gap-2 mb-1.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{center.address} — {center.city}</p>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">{center.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">{center.hours}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum hemocentro encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default BloodCenters;
