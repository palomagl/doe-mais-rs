// Bridges the game's original TanStack-Router-style calls onto the app's
// React Router, and namespaces every game route under /jogo.
import { forwardRef, useCallback } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate as useRouterNavigate,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";

export const GAME_BASE = "/jogo";

type Params = Record<string, string | number> | undefined;

/** "/mapa" -> "/jogo/mapa", "/" -> "/jogo", filling ":param" / "$param" tokens. */
export function gamePath(to: string, params?: Params): string {
  let path = to;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`$${key}`, String(value)).replace(`:${key}`, String(value));
    }
  }
  if (path === "/" || path === "") return GAME_BASE;
  return `${GAME_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

type LinkProps = Omit<RouterLinkProps, "to"> & { to: string; params?: Params };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, params, ...rest },
  ref,
) {
  return <RouterLink ref={ref} to={gamePath(to, params)} {...rest} />;
});

type NavigateArg = string | { to: string; params?: Params };

export function useNavigate() {
  const navigate = useRouterNavigate();
  return useCallback(
    (arg: NavigateArg) => {
      if (typeof arg === "string") return navigate(gamePath(arg));
      return navigate(gamePath(arg.to, arg.params));
    },
    [navigate],
  );
}

/** Current path with the /jogo prefix stripped, so game code sees "/", "/mapa", ... */
export function useGamePathname(): string {
  const { pathname } = useLocation();
  if (pathname === GAME_BASE) return "/";
  if (pathname.startsWith(`${GAME_BASE}/`)) return pathname.slice(GAME_BASE.length);
  return pathname;
}
