import { Outlet } from "react-router-dom";
import "./game-theme.css";

/**
 * Wrapper for every /jogo route. The `.doe-hero-game` class scopes the game's
 * design tokens so the game's look never leaks into the rest of the app.
 */
export default function GameLayout() {
  return (
    <div className="doe-hero-game min-h-screen">
      <Outlet />
    </div>
  );
}
