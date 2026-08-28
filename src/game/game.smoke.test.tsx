import { act, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it, vi } from "vitest";

import GameLayout from "./GameLayout";
import Home from "./screens/Home";
import Mapa from "./screens/Mapa";
import Missoes from "./screens/Missoes";
import Ranking from "./screens/Ranking";
import Perfil from "./screens/Perfil";
import Conquistas from "./screens/Conquistas";
import Resultado from "./screens/Resultado";
import Jogar from "./screens/Jogar";

// Herói já "logado" antes do primeiro render — assim a Home mostra o painel
// (com a navegação inferior) em vez da tela de login.
beforeAll(() => {
  localStorage.setItem(
    "doemais-hero-state-v1",
    JSON.stringify({ loggedIn: true, name: "Teste", unlockedPhase: 1 }),
  );
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/jogo" element={<GameLayout />}>
          <Route index element={<Home />} />
          <Route path="mapa" element={<Mapa />} />
          <Route path="missoes" element={<Missoes />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="conquistas" element={<Conquistas />} />
          <Route path="resultado" element={<Resultado />} />
          <Route path="jogar/:phase" element={<Jogar />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

const GAME_ROUTES = [
  "/jogo",
  "/jogo/mapa",
  "/jogo/missoes",
  "/jogo/ranking",
  "/jogo/perfil",
  "/jogo/conquistas",
  "/jogo/resultado",
  "/jogo/jogar/1",
];

describe("DOE+ Hero — integração no app", () => {
  it("monta cada rota do jogo sem erro", () => {
    for (const path of GAME_ROUTES) {
      const { unmount } = renderAt(path);
      unmount();
    }
  });

  it("não existe mais tela de configurações", () => {
    const { container } = renderAt("/jogo");
    expect(container.querySelector('a[href="/jogo/configuracoes"]')).toBeNull();
  });

  it("botão de voltar leva ao app (/dashboard)", () => {
    renderAt("/jogo/mapa");
    expect(
      screen.getByRole("link", { name: /voltar para o app doe\+ rs/i }),
    ).toHaveAttribute("href", "/dashboard");
  });

  it("a navegação inferior aponta para as rotas certas", () => {
    renderAt("/jogo/mapa");
    const nav = screen.getByRole("navigation");
    const href = (name: RegExp) =>
      within(nav).getByRole("link", { name }).getAttribute("href");
    expect(href(/início/i)).toBe("/jogo");
    expect(href(/mapa/i)).toBe("/jogo/mapa");
    expect(href(/missões/i)).toBe("/jogo/missoes");
    expect(href(/ranking/i)).toBe("/jogo/ranking");
    expect(href(/perfil/i)).toBe("/jogo/perfil");
  });

  it("Home leva para o gameplay e para as missões", () => {
    vi.useFakeTimers();
    try {
      renderAt("/jogo");
      act(() => {
        vi.advanceTimersByTime(2500); // encerra o splash
      });
      expect(screen.getByRole("link", { name: /jogar agora/i })).toHaveAttribute(
        "href",
        "/jogo/jogar/1",
      );
      expect(
        within(screen.getByRole("main")).getByRole("link", { name: /ver todas/i }),
      ).toHaveAttribute("href", "/jogo/missoes");
    } finally {
      vi.useRealTimers();
    }
  });

  it("Resultado sem partida oferece caminho para o mapa", () => {
    renderAt("/jogo/resultado");
    expect(screen.getByRole("link", { name: /ir para o mapa/i })).toHaveAttribute(
      "href",
      "/jogo/mapa",
    );
  });

  it("Perfil linka para as conquistas", () => {
    renderAt("/jogo/perfil");
    expect(screen.getByRole("link", { name: /ver todas/i })).toHaveAttribute(
      "href",
      "/jogo/conquistas",
    );
  });
});
