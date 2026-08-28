export type Phase = {
  id: number;
  name: string;
  emoji: string;
  city: string;
  description: string;
  targetScore: number;
  speed: number;
  obstacleRate: number;
  palette: { sky: string; ground: string; far: string; near: string };
};

export const PHASES: Phase[] = [
  {
    id: 1,
    name: "Primeiros Passos",
    emoji: "❤️",
    city: "Porto Alegre",
    description: "Aprenda o básico da doação enquanto corre pela orla do Guaíba.",
    targetScore: 600,
    speed: 4.6,
    obstacleRate: 0.012,
    palette: { sky: "#ffe9e6", ground: "#f3d8d3", far: "#f6c9c2", near: "#e8a79c" },
  },
  {
    id: 2,
    name: "O Caminho do Doador",
    emoji: "🩸",
    city: "Serra Gaúcha",
    description: "Colete bolsas pelas vinhas e descubra quem pode doar.",
    targetScore: 1200,
    speed: 5.3,
    obstacleRate: 0.016,
    palette: { sky: "#ffeede", ground: "#e9dcc8", far: "#e2c9a5", near: "#c8a878" },
  },
  {
    id: 3,
    name: "Missão Hemocentro",
    emoji: "🏥",
    city: "Hemocentro RS",
    description: "Dentro do hemocentro: perguntas mais difíceis, recompensas maiores.",
    targetScore: 1900,
    speed: 6,
    obstacleRate: 0.02,
    palette: { sky: "#eaf1ff", ground: "#dfe6f2", far: "#cfd9ec", near: "#aebbd6" },
  },
  {
    id: 4,
    name: "Herói da Comunidade",
    emoji: "⭐",
    city: "Missões",
    description: "Mobilize a comunidade e mantenha o combo vivo.",
    targetScore: 2600,
    speed: 6.7,
    obstacleRate: 0.024,
    palette: { sky: "#f1ecff", ground: "#e3ddf2", far: "#d2c9ea", near: "#b0a3d8" },
  },
  {
    id: 5,
    name: "Salve Vidas",
    emoji: "🌎",
    city: "Rio Grande do Sul",
    description: "A corrida final. Cada bolsa coletada pode salvar até 4 vidas.",
    targetScore: 3400,
    speed: 7.4,
    obstacleRate: 0.028,
    palette: { sky: "#ffe6ea", ground: "#efd2d8", far: "#e6b9c3", near: "#c98d9c" },
  },
];

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "Quanto tempo dura aproximadamente uma doação de sangue?",
    options: ["5 minutos", "30 a 40 minutos", "2 horas", "5 horas"],
    answer: 1,
    explanation:
      "Todo o processo leva de 30 a 40 minutos; a coleta em si dura cerca de 10 minutos.",
  },
  {
    id: "q2",
    question: "Qual é a idade permitida para doar sangue no Brasil?",
    options: ["14 a 50 anos", "16 a 69 anos", "21 a 45 anos", "18 a 30 anos"],
    answer: 1,
    explanation:
      "De 16 a 69 anos — menores de 18 precisam de autorização e a 1ª doação deve ocorrer até os 60.",
  },
  {
    id: "q3",
    question: "Qual o peso mínimo para doar sangue?",
    options: ["45 kg", "50 kg", "60 kg", "70 kg"],
    answer: 1,
    explanation: "É necessário pesar no mínimo 50 kg.",
  },
  {
    id: "q4",
    question: "Uma única doação pode ajudar até quantas pessoas?",
    options: ["1 pessoa", "2 pessoas", "4 pessoas", "10 pessoas"],
    answer: 2,
    explanation:
      "O sangue é separado em hemácias, plaquetas e plasma, podendo beneficiar até 4 pacientes.",
  },
  {
    id: "q5",
    question: "Qual tipo sanguíneo é o doador universal de hemácias?",
    options: ["AB+", "O-", "A+", "B-"],
    answer: 1,
    explanation: "O negativo é doador universal de hemácias; AB+ é receptor universal.",
  },
  {
    id: "q6",
    question: "Com que frequência um homem pode doar sangue?",
    options: ["A cada 30 dias", "A cada 60 dias", "A cada 90 dias", "1 vez por ano"],
    answer: 1,
    explanation: "Homens: a cada 60 dias (até 4x/ano). Mulheres: a cada 90 dias (até 3x/ano).",
  },
  {
    id: "q7",
    question: "É preciso estar em jejum para doar sangue?",
    options: [
      "Sim, jejum de 12h",
      "Não, e é recomendado estar alimentado",
      "Sim, jejum de 4h",
      "Só para plaquetas",
    ],
    answer: 1,
    explanation:
      "Não se doa em jejum. Evite apenas alimentos gordurosos nas 3 horas anteriores.",
  },
  {
    id: "q8",
    question: "Quanto sangue é coletado em uma doação padrão?",
    options: ["100 ml", "450 ml", "1 litro", "2 litros"],
    answer: 1,
    explanation: "Cerca de 450 ml, volume rapidamente reposto pelo organismo.",
  },
  {
    id: "q9",
    question: "Após tatuagem, qual o período de espera para doar?",
    options: ["Não pode mais doar", "6 meses", "24 horas", "10 anos"],
    answer: 1,
    explanation: "O período recomendado é de 6 meses após tatuagens ou piercings.",
  },
  {
    id: "q10",
    question: "Quem doa sangue precisa levar o quê ao hemocentro?",
    options: [
      "Nada, só boa vontade",
      "Documento oficial com foto",
      "Exame de sangue recente",
      "Receita médica",
    ],
    answer: 1,
    explanation: "Documento oficial com foto emitido nos últimos 10 anos.",
  },
  {
    id: "q11",
    question: "Após doar, quanto tempo se recomenda evitar esforço físico intenso?",
    options: ["Nenhum", "Cerca de 12 horas", "1 semana", "1 mês"],
    answer: 1,
    explanation: "Evite esforços intensos por cerca de 12 horas e hidrate-se bem.",
  },
  {
    id: "q12",
    question: "Pessoas com gripe ou resfriado podem doar?",
    options: [
      "Sim, sem restrição",
      "Não, devem aguardar 7 dias após os sintomas",
      "Sim, se tomarem remédio",
      "Somente plasma",
    ],
    answer: 1,
    explanation: "É preciso aguardar cerca de 7 dias após o fim dos sintomas.",
  },
];

export type Mission = {
  id: string;
  icon: string;
  title: string;
  goal: number;
  metric: "bags" | "correct" | "runs" | "combo";
  xp: number;
  coins: number;
};

export const DAILY_MISSIONS: Mission[] = [
  { id: "m1", icon: "🩸", title: "Colete 50 bolsas de sangue", goal: 50, metric: "bags", xp: 200, coins: 60 },
  { id: "m2", icon: "🧠", title: "Acerte 5 perguntas sobre doação", goal: 5, metric: "correct", xp: 250, coins: 80 },
  { id: "m3", icon: "⭐", title: "Faça 1 partida completa", goal: 1, metric: "runs", xp: 120, coins: 40 },
  { id: "m4", icon: "🔥", title: "Alcance um combo x10", goal: 10, metric: "combo", xp: 300, coins: 100 },
];

export type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  check: (s: AchievementStats) => boolean;
  progress: (s: AchievementStats) => number;
};

export type AchievementStats = {
  missionsCompleted: number;
  hearts: number;
  level: number;
  streak: number;
  correctAnswers: number;
  phasesCompleted: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    icon: "🩸",
    title: "Primeiro Passo",
    description: "Complete sua primeira missão.",
    check: (s) => s.missionsCompleted >= 1,
    progress: (s) => Math.min(1, s.missionsCompleted / 1),
  },
  {
    id: "a2",
    icon: "❤️",
    title: "Coração Solidário",
    description: "Colete 100 corações.",
    check: (s) => s.hearts >= 100,
    progress: (s) => Math.min(1, s.hearts / 100),
  },
  {
    id: "a3",
    icon: "🏆",
    title: "Doador de Elite",
    description: "Alcance o nível 10.",
    check: (s) => s.level >= 10,
    progress: (s) => Math.min(1, s.level / 10),
  },
  {
    id: "a4",
    icon: "🔥",
    title: "Sequência Imparável",
    description: "Jogue por 7 dias consecutivos.",
    check: (s) => s.streak >= 7,
    progress: (s) => Math.min(1, s.streak / 7),
  },
  {
    id: "a5",
    icon: "🏥",
    title: "Conhecedor",
    description: "Acerte 20 perguntas sobre doação.",
    check: (s) => s.correctAnswers >= 20,
    progress: (s) => Math.min(1, s.correctAnswers / 20),
  },
  {
    id: "a6",
    icon: "🚀",
    title: "Herói RS",
    description: "Complete todas as fases.",
    check: (s) => s.phasesCompleted >= PHASES.length,
    progress: (s) => Math.min(1, s.phasesCompleted / PHASES.length),
  },
];

export type RankedPlayer = { id: string; name: string; city: string; xp: number; weeklyXp: number };

export const MOCK_RANKING: RankedPlayer[] = [
  { id: "r1", name: "Ana Lovato", city: "Porto Alegre", xp: 12540, weeklyXp: 3120 },
  { id: "r2", name: "João Bertoldi", city: "Caxias do Sul", xp: 11830, weeklyXp: 2870 },
  { id: "r3", name: "Maria Führ", city: "Santa Maria", xp: 10920, weeklyXp: 2610 },
  { id: "r4", name: "Rafael Kunz", city: "Pelotas", xp: 9480, weeklyXp: 2240 },
  { id: "r5", name: "Camila Rocha", city: "Canoas", xp: 8710, weeklyXp: 1980 },
  { id: "r6", name: "Diego Vargas", city: "Gravataí", xp: 7650, weeklyXp: 1720 },
  { id: "r7", name: "Letícia Prass", city: "Novo Hamburgo", xp: 6890, weeklyXp: 1490 },
  { id: "r8", name: "Bruno Salaberry", city: "Bagé", xp: 5980, weeklyXp: 1280 },
  { id: "r9", name: "Fernanda Alves", city: "Passo Fundo", xp: 5240, weeklyXp: 1060 },
  { id: "r10", name: "Tiago Menezes", city: "Rio Grande", xp: 4610, weeklyXp: 880 },
];

export const POWER_UPS = [
  { icon: "🩸", name: "Blood Boost", description: "Aumenta a pontuação de cada bolsa." },
  { icon: "❤️", name: "Vida Extra", description: "Recupera uma vida perdida." },
  { icon: "⚡", name: "Turbo", description: "Velocidade temporária e mais pontos." },
  { icon: "🛡️", name: "Proteção", description: "Atravessa um obstáculo sem perder vida." },
  { icon: "⭐", name: "Multiplicador", description: "Dobra a pontuação por alguns segundos." },
];

export const xpForLevel = (level: number) => 400 + (level - 1) * 250;
