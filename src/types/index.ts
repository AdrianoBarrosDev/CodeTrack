export type ProblemStatus = 'Resolvido' | 'Em andamento' | 'Revisar';

export type ReviewResult = 
  | 'Lembrei completamente'
  | 'Lembrei parcialmente'
  | 'Precisei estudar novamente'
  | 'Não consegui resolver';

export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatarUrl?: string;
  metaGlobal: number; // ex: 200 problemas
}

export interface Area {
  id: string;
  userId: string;
  nome: string;
  descricao?: string;
  ordem: number;
  cor: string; // Hex para barras e badges
  icone: string; // Identificador de ícone
}

export interface Topic {
  id: string;
  areaId: string;
  userId: string;
  nome: string;
  descricao?: string;
  metaProblemas?: number;
  nivelDominio?: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Mestre';
  dataCriacao: string;
}

export interface Problem {
  id: string;
  userId: string;
  topicId: string;
  nome: string;
  url: string;
  plataforma: 'CSES' | 'Codeforces' | 'AtCoder' | 'Beecrowd' | 'CodeChef' | 'LeetCode' | 'Outra';
  dificuldade?: string; // ex: "800", "1400", "Fácil", "Médio", "Difícil"
  dataResolucao: string; // YYYY-MM-DD
  status: ProblemStatus;
  observacoes?: string;
  isStar: boolean;
  conceitoPrincipal?: string;
  motivoEstrela?: string;
  dataUltimaRevisao?: string;
  qtdRevisoes?: number;
  proximaRevisao?: string; // Limite de 2 meses
  dataCriacao: string;
}

export interface Review {
  id: string;
  problemId: string;
  userId: string;
  dataRevisao: string; // YYYY-MM-DD
  resultado: ReviewResult;
  observacoes?: string;
  proximaRevisao?: string; // YYYY-MM-DD
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
}
