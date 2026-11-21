import { Problem } from '../types';

export const formatDatePtBR = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;

  const months = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ];

  const mIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${months[mIdx] || month}`;
};

export const getFullCurrentDatePtBR = (): string => {
  // Conforme o cabeçalho do mockup: "Sábado, 21 de novembro de 2026"
  return 'Sábado, 21 de novembro de 2026';
};

export type ReviewStatusCategory = 'pendente' | 'hoje' | 'em_breve' | 'nunca' | 'em_dia';

export const getReviewStatus = (problem: Problem): { label: string; type: ReviewStatusCategory; colorClass: string } => {
  if (!problem.isStar) {
    return { label: 'Normal', type: 'em_dia', colorClass: 'text-slate-500 bg-slate-100' };
  }

  if (!problem.dataUltimaRevisao && !problem.proximaRevisao) {
    return { label: 'Nunca revisado', type: 'nunca', colorClass: 'text-slate-600 bg-slate-100' };
  }

  const todayStr = '2026-11-21'; // Data de referência da aplicação
  const nextRev = problem.proximaRevisao || '';

  if (nextRev < todayStr) {
    return { label: 'Revisão pendente', type: 'pendente', colorClass: 'text-amber-700 bg-amber-50 border border-amber-200' };
  }

  if (nextRev === todayStr) {
    return { label: 'Revisar hoje', type: 'hoje', colorClass: 'text-orange-700 bg-orange-50 border border-orange-200' };
  }

  // Verifica se está nos próximos dias (dentro do limite de 2 meses)
  return { label: `Revisar em ${formatDatePtBR(nextRev)}`, type: 'em_breve', colorClass: 'text-indigo-700 bg-indigo-50 border border-indigo-200' };
};

export const calculateMaxReviewDate = (fromDateStr: string = '2026-11-21'): string => {
  const parts = fromDateStr.split('-');
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  // Adiciona 60 dias (2 meses)
  date.setDate(date.getDate() + 60);
  return date.toISOString().split('T')[0];
};

export const addDaysToDate = (fromDateStr: string, days: number): string => {
  const parts = fromDateStr.split('-');
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const sanitizeUrl = (url?: string): string => {
  if (!url) return '#';
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // Se não tiver protocolo, assume https:// se for um domínio válido
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(trimmed)) {
      return `https://${trimmed}`;
    }
  }
  return '#';
};

