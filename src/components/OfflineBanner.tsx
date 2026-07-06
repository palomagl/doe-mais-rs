import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

const OfflineBanner = () => {
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  );

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  if (online) return null;
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-[hsl(var(--warning))] text-black text-xs font-semibold py-2 px-3 flex items-center justify-center gap-2 shadow-md"
      style={{ paddingTop: "calc(0.5rem + env(safe-area-inset-top))" }}
      role="status"
    >
      <WifiOff className="w-3.5 h-3.5" />
      Sem conexão — algumas ações ficarão indisponíveis
    </div>
  );
};

export default OfflineBanner;
