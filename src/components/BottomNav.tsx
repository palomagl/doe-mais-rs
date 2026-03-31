import { useNavigate, useLocation } from "react-router-dom";
import { Home, MapPin, Gift, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/dashboard", icon: Home, label: "Início" },
    { path: "/centers", icon: MapPin, label: "Locais" },
    { path: "/rewards", icon: Gift, label: "Prêmios" },
    { path: "/profile", icon: User, label: "Perfil" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border px-2 pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-muted-foreground hover:text-destructive transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Sair</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
