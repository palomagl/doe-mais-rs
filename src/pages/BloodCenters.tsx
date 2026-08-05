import { useState, useMemo } from "react";
import { Search, MapPin, Phone, Clock, ExternalLink, Navigation, AlertCircle } from "lucide-react";
import { bloodCenters } from "@/data/bloodCenters";
import { useGeolocation } from "@/hooks/useGeolocation";
import { haversineKm, formatDistance } from "@/lib/geo";
import BottomNav from "@/components/BottomNav";

const BloodCenters = () => {
  const [search, setSearch] = useState("");
  const { lat, lng, loading: geoLoading, error: geoError, request } = useGeolocation(true);

  const sorted = useMemo(() => {
    const list = bloodCenters.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase())
    );
    if (lat != null && lng != null) {
      return list
        .map((c) => ({ ...c, distance: haversineKm(lat, lng, c.lat, c.lng) }))
        .sort((a, b) => a.distance - b.distance);
    }
    return list.map((c) => ({ ...c, distance: undefined as number | undefined }));
  }, [search, lat, lng]);

  const openMaps = (center: typeof bloodCenters[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openWaze = (center: typeof bloodCenters[0]) => {
    const url = `https://waze.com/ul?ll=${center.lat},${center.lng}&navigate=yes`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background pb-nav animate-page-in">
      <div className="bg-primary text-primary-foreground px-page pt-10 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Hemocentros 📍</h1>
          <p className="text-sm opacity-80 mt-1">
            {lat ? "Ordenados por distância de você" : geoLoading ? "Solicitando permissão de localização..." : "Permita localização para ver os hemocentros mais próximos"}
          </p>
        </div>
      </div>

      <div className="px-page -mt-4 relative z-10 container-mobile-lg">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
          />
        </div>

        {geoError && (
          <button
            onClick={request}
            className="w-full rounded-2xl bg-muted/50 border border-border p-3 mb-4 flex items-center gap-2 text-left active:scale-[0.99]"
          >
            <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground flex-1">{geoError} — toque para tentar novamente</p>
          </button>
        )}

        <p className="text-xs text-muted-foreground mb-3">
          {sorted.length} hemocentro{sorted.length !== 1 ? "s" : ""}
          {geoLoading ? " · localizando..." : ""}
        </p>

        <div className="flex flex-col gap-3">
          {sorted.map((center) => (
            <div
              key={center.id}
              className="rounded-2xl bg-card border border-border p-5 hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm leading-snug">{center.name}</h3>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                    {center.region} • {center.city}
                  </p>
                  {center.distance !== undefined && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary mt-2">
                      <Navigation className="w-3 h-3" /> {formatDistance(center.distance)} de você
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{center.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a href={`tel:${center.phone}`} className="text-xs text-primary font-medium">{center.phone}</a>
                </div>
                {center.whatsapp && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <a
                      href={`https://wa.me/${center.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary font-medium"
                    >
                      WhatsApp: {center.whatsapp}
                    </a>
                  </div>
                )}
                {center.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                    <a
                      href={center.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary font-medium underline"
                    >
                      Agendamento online
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground">{center.hours}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openMaps(center)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold py-2.5 active:scale-[0.97]"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Google Maps
                </button>
                <button
                  onClick={() => openWaze(center)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-accent text-foreground text-xs font-semibold py-2.5 active:scale-[0.97]"
                >
                  <Navigation className="w-3.5 h-3.5" /> Waze
                </button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Nenhum hemocentro encontrado.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BloodCenters;
