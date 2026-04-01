import { useState } from "react";
import { Search, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { bloodCenters } from "@/data/bloodCenters";
import BottomNav from "@/components/BottomNav";

const BloodCenters = () => {
  const [search, setSearch] = useState("");

  const filtered = bloodCenters.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const openMaps = (center: typeof bloodCenters[0]) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

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

      <div className="px-5 -mt-4 relative z-10">
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

        {/* Count */}
        <p className="text-xs text-muted-foreground mb-3">
          {filtered.length} hemocentro{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.map((center) => (
            <div
              key={center.id}
              className="rounded-2xl bg-card border border-border p-5 hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-foreground text-sm leading-snug flex-1">{center.name}</h3>
                <button
                  onClick={() => openMaps(center)}
                  className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors active:scale-95"
                  aria-label="Abrir no Google Maps"
                >
                  <ExternalLink className="w-4 h-4 text-primary" />
                </button>
              </div>
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
            <div className="text-center py-12">
              <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Nenhum hemocentro encontrado.</p>
              <p className="text-xs text-muted-foreground mt-1">Tente buscar por outra cidade.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BloodCenters;
