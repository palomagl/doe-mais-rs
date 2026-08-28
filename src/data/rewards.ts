export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: "food" | "health" | "entertainment" | "transport";
  partner: string;
  icon: string;
}

export const POINTS_PER_DONATION = 150;

export const rewards: Reward[] = [
  {
    id: "1",
    title: "15% off em farmácia",
    description: "Desconto em qualquer produto da rede parceira",
    pointsCost: 200,
    category: "health",
    partner: "Farmácia Popular",
    icon: "💊",
  },
  {
    id: "2",
    title: "Açaí grátis 300ml",
    description: "Um açaí 300ml em qualquer unidade participante",
    pointsCost: 300,
    category: "food",
    partner: "Açaí do Sul",
    icon: "🍇",
  },
  {
    id: "3",
    title: "1 ingresso de cinema",
    description: "Válido de segunda a quinta em salas 2D",
    pointsCost: 450,
    category: "entertainment",
    partner: "CineRS",
    icon: "🎬",
  },
  {
    id: "4",
    title: "R$10 off no Uber",
    description: "Cupom de desconto para uma corrida",
    pointsCost: 250,
    category: "transport",
    partner: "Uber",
    icon: "🚗",
  },
  {
    id: "7",
    title: "Ingresso de teatro",
    description: "Desconto em ingresso para apresentações culturais em teatros parceiros.",
    pointsCost: 400,
    category: "entertainment",
    partner: "Teatro RS",
    icon: "🎭",
  },
  {
    id: "8",
    title: "Desconto em transporte coletivo",
    description: "Cupom para desconto em passagem intermunicipal com empresas parceiras.",
    pointsCost: 300,
    category: "transport",
    partner: "Viação RS",
    icon: "🚌",
  },
  {
    id: "5",
    title: "Café + pão de queijo",
    description: "Combo café da manhã na padaria parceira",
    pointsCost: 150,
    category: "food",
    partner: "Padaria Gaúcha",
    icon: "☕",
  },
  {
    id: "6",
    title: "20% off em academia",
    description: "Desconto na mensalidade por 1 mês",
    pointsCost: 500,
    category: "health",
    partner: "FitRS",
    icon: "💪",
  },
];
