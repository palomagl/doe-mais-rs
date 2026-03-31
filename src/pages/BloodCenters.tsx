import { useState } from "react";
import { Search, MapPin, Phone, Clock } from "lucide-react";
import { bloodCenters } from "@/data/bloodCenters";
import BottomNav from "@/components/BottomNav";

const BloodCenters = () => {
  const [search, setSearch] = useState("");

  const filtered = bloodCenters.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 pt-10 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Hemocentros 📍</h1>
          <p className="text-sm opacity-80 mt-1">Encontre o mais próximo no RS</p>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-10">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
          />
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.map((center) => (
            <div
              key={center.id}
              className="rounded-2xl bg-card border border-border p-5 hover:border-primary transition-all"
            >
              <h3 className="font-bold text-foreground mb-3 text-sm leading-snug">{center.name}</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{center.address} — {center.city}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a href={`tel:${center.phone}`} className="text-xs text-primary font-medium">{center.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground">{center.hours}</p>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum hemocentro encontrado.</p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BloodCenters;
