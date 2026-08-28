import { Link, useGamePathname } from "@/game/nav";
import { Link as RouterLink } from "react-router-dom";
import { ArrowLeft, Home, Map, Trophy, Target, User } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { hydratePlayer, usePlayer } from "@/game/usePlayer";
import { playSound } from "@/game/sound";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Início", icon: Home },
  { to: "/mapa", label: "Mapa", icon: Map },
  { to: "/missoes", label: "Missões", icon: Target },
  { to: "/ranking", label: "Ranking", icon: Trophy },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

/** Volta para o app Doe+ RS (fora do jogo). */
export function ExitToApp({ className }: { className?: string }) {
  return (
    <RouterLink
      to="/dashboard"
      onClick={() => playSound("click")}
      aria-label="Voltar para o app Doe+ RS"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-muted-foreground shadow-soft transition-colors hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      App
    </RouterLink>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-primary-foreground shadow-glow">
        <span className="text-lg leading-none">🩸</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="font-display text-sm font-extrabold tracking-tight">
            DOE<span className="text-primary">+</span> HERO
          </p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Sistema DOE+ RS
          </p>
        </div>
      )}
    </div>
  );
}

export function AppShell({
  children,
  hideNav = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) {
  const pathname = useGamePathname();
  const player = usePlayer();

  useEffect(() => {
    hydratePlayer();
  }, []);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[520px] flex-col bg-background shadow-card sm:min-h-screen">
      {!hideNav && (
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border/70 bg-card/90 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <ExitToApp />
            <BrandMark compact />
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-accent-foreground">
              🔥 {player.streak}
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
              🪙 {player.coins}
            </span>
          </div>
        </header>
      )}

      {hideNav && (
        <ExitToApp className="absolute left-4 top-4 z-30 bg-card/90 backdrop-blur-xl" />
      )}

      <main className={cn("flex-1", !hideNav && "px-4 pb-28 pt-4")}>{children}</main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[520px] -translate-x-1/2 border-t border-border/70 bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
          <ul className="flex items-stretch justify-between">
            {NAV.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to} className="flex-1">
                  <Link
                    to={item.to}
                    onClick={() => playSound("click")}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[11px] font-semibold transition-colors",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-10 place-items-center rounded-xl transition-all",
                        active && "bg-primary-soft",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.6 : 2} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
