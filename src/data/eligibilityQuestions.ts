export interface EligibilityQuestion {
  id: number;
  question: string;
  category: string;
  options: {
    label: string;
    value: string;
    effect: "ok" | "wait" | "block";
    waitDays?: number;
    message?: string;
  }[];
}

export const eligibilityQuestions: EligibilityQuestion[] = [
  {
    id: 1,
    question: "Você tem entre 16 e 69 anos e pesa mais de 50kg?",
    category: "Requisitos básicos",
    options: [
      { label: "Sim", value: "yes", effect: "ok" },
      { label: "Não", value: "no", effect: "block", message: "Para doar sangue é necessário ter entre 16 e 69 anos e pesar mais de 50kg." },
    ],
  },
  {
    id: 2,
    question: "Você está com gripe, resfriado ou febre atualmente?",
    category: "Saúde atual",
    options: [
      { label: "Não", value: "no", effect: "ok" },
      { label: "Sim", value: "yes", effect: "wait", waitDays: 7, message: "Aguarde 7 dias após a recuperação completa." },
    ],
  },
  {
    id: 3,
    question: "Fez tatuagem ou piercing nos últimos 12 meses?",
    category: "Procedimentos",
    options: [
      { label: "Não", value: "no", effect: "ok" },
      { label: "Sim", value: "yes", effect: "wait", waitDays: 365, message: "É necessário aguardar 12 meses após tatuagem ou piercing." },
    ],
  },
  {
    id: 4,
    question: "Você consumiu bebida alcoólica nas últimas 12 horas?",
    category: "Substâncias",
    options: [
      { label: "Não", value: "no", effect: "ok" },
      { label: "Sim", value: "yes", effect: "wait", waitDays: 1, message: "Aguarde 12 horas após o consumo de álcool." },
    ],
  },
  {
    id: 5,
    question: "Você fez alguma cirurgia nos últimos 6 meses?",
    category: "Procedimentos",
    options: [
      { label: "Não", value: "no", effect: "ok" },
      { label: "Sim", value: "yes", effect: "wait", waitDays: 180, message: "Aguarde 6 meses após procedimentos cirúrgicos." },
    ],
  },
  {
    id: 6,
    question: "Você está grávida ou amamentando?",
    category: "Saúde",
    options: [
      { label: "Não / Não se aplica", value: "no", effect: "ok" },
      { label: "Sim", value: "yes", effect: "block", message: "Gestantes e lactantes não podem doar sangue." },
    ],
  },
  {
    id: 7,
    question: "Tomou alguma vacina nos últimos 30 dias?",
    category: "Vacinas",
    options: [
      { label: "Não", value: "no", effect: "ok" },
      { label: "Sim", value: "yes", effect: "wait", waitDays: 30, message: "Aguarde 30 dias após a vacinação." },
    ],
  },
  {
    id: 8,
    question: "Você dormiu pelo menos 6 horas na última noite?",
    category: "Bem-estar",
    options: [
      { label: "Sim", value: "yes", effect: "ok" },
      { label: "Não", value: "no", effect: "wait", waitDays: 1, message: "Descanse bem e tente novamente amanhã!" },
    ],
  },
];
