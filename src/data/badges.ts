export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number; // number of donations required
}

export const BADGES: Badge[] = [
  { id: "first_drop", title: "Primeira Gota", description: "Sua primeira doação registrada", icon: "💧", requirement: 1 },
  { id: "bronze", title: "Doador Bronze", description: "3 doações realizadas", icon: "🥉", requirement: 3 },
  { id: "silver", title: "Doador Prata", description: "5 doações realizadas", icon: "🥈", requirement: 5 },
  { id: "gold", title: "Doador Ouro", description: "10 doações realizadas", icon: "🥇", requirement: 10 },
  { id: "hero", title: "Salvador de Vidas", description: "20 doações — um verdadeiro herói", icon: "🦸", requirement: 20 },
  { id: "legend", title: "Lenda Gaúcha", description: "50 doações — você é inspiração!", icon: "👑", requirement: 50 },
];

export const LIVES_PER_DONATION = 4;

export function badgesEarned(donationCount: number): Badge[] {
  return BADGES.filter((b) => donationCount >= b.requirement);
}
