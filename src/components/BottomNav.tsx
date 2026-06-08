import { useNavigate, useLocation } from "react-router-dom";
import { Home, MapPin, Gift, User, Scale } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/dashboard", icon: Home, label: "Início" },
    { path: "/centers", icon: MapPin, label: "Locais" },
    { path: "/rewards", icon: Gift, label: "Prêmios" },
    { path: "/benefits", icon: Scale, label: "Direitos" },
    { path: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 glass border-t border-border/60 z-50 shadow-[0_-8px_24px_-12px_hsl(var(--primary)/0.18)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all active:scale-95 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={`flex items-center justify-center rounded-xl transition-all ${
                isActive ? "bg-primary/12 w-9 h-9" : "w-9 h-9"
              }`}>
                <tab.icon className={`w-[18px] h-[18px] ${isActive ? "stroke-[2.5]" : ""}`} />
              </div>
              <span className={`text-[9.5px] font-semibold leading-none truncate max-w-full ${isActive ? "text-primary" : ""}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


export default BottomNav;
