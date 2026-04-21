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
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl transition-all active:scale-95 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <tab.icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-[9px] sm:text-[10px] font-semibold leading-tight truncate max-w-full ${isActive ? "text-primary" : ""}`}>
                {tab.label}
              </span>
              {isActive && <div className="w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
