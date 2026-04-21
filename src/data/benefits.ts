export interface DonorBenefit {
  id: string;
  title: string;
  description: string;
  law?: string;
  icon: string;
  category: "education" | "transport" | "leisure" | "work";
}

export const DONOR_BENEFITS: DonorBenefit[] = [
  {
    id: "1",
    title: "Meia-entrada em eventos",
    description: "Doadores regulares de sangue têm direito a meia-entrada em eventos culturais, esportivos e de lazer no RS.",
    law: "Lei Estadual nº 13.891/2012",
    icon: "🎭",
    category: "leisure",
  },
  {
    id: "2",
    title: "Isenção em concursos públicos",
    description: "Doadores regulares têm isenção da taxa de inscrição em concursos públicos estaduais.",
    law: "Lei Estadual nº 13.891/2012",
    icon: "📝",
    category: "work",
  },
  {
    id: "3",
    title: "Folga remunerada no trabalho",
    description: "Trabalhadores CLT podem se ausentar 1 dia por ano (sem prejuízo de salário) para doação de sangue.",
    law: "CLT, Art. 473, IV",
    icon: "💼",
    category: "work",
  },
  {
    id: "4",
    title: "Prioridade em transplantes",
    description: "Doadores regulares têm prioridade em fila de transplantes em caso de necessidade.",
    icon: "🏥",
    category: "leisure",
  },
  {
    id: "5",
    title: "Dispensa de serviço militar",
    description: "Doadores regulares podem ser dispensados de exercícios militares obrigatórios.",
    law: "Decreto 57.654/66",
    icon: "🎖️",
    category: "work",
  },
  {
    id: "6",
    title: "Meia-entrada em transporte intermunicipal",
    description: "Em algumas cidades do RS, doadores regulares têm desconto no transporte intermunicipal.",
    icon: "🚌",
    category: "transport",
  },
];
