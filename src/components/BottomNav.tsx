import { useNavigate, useLocation } from "react-router-dom";
import { Home, MapPin, Gift, User, Scale } from "lucide-react";
import { tapHaptic } from "@/lib/native";

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

  const handleTap = (path: string) => {
    if (location.pathname !== path) {
      tapHaptic();
      navigate(path);
    }
  };

  return (
    <nav
      className="bottom-nav-fixed bg-card/95 backdrop-blur-xl border-t border-border/70 shadow-soft"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1 pt-1.5">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => handleTap(tab.path)}
              className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-2xl transition-transform active:scale-95 ripple"
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Material 3 pill indicator */}
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-primary/15 w-14 h-8"
                    : "w-14 h-8"
                }`}
              >
                <tab.icon
                  className={`w-[22px] h-[22px] transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.4 : 2}
                />
              </div>
              <span
                className={`text-[10.5px] leading-none truncate max-w-full transition-colors ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground font-medium"
                }`}
              >
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
