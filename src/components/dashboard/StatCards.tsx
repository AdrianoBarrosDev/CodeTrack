import React from 'react';
import { Check, Star, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const StatCards: React.FC = () => {
  const { problems, topics, areas, user } = useApp();

  const totalSolved = problems.filter((p) => p.status === 'Resolvido').length;
  const starCount = problems.filter((p) => p.isStar).length;
  
  // Tópicos que têm pelo menos 1 problema resolvido
  const topicsStudied = new Set(
    problems.filter((p) => p.status === 'Resolvido').map((p) => p.topicId)
  ).size;

  const completionRate = Math.round((totalSolved / user.metaGlobal) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Problemas Resolvidos */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Problemas resolvidos</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {totalSolved}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+6 nos últimos 3 dias</span>
          </div>
        </div>
      </div>

      {/* 2. Problemas Estrela */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Problemas Estrela</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-4 h-4 stroke-[2]" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {starCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Referências para revisitar
          </div>
        </div>
      </div>

      {/* 3. Assuntos Estudados */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Assuntos estudados</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-brand-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 stroke-[2]" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {topicsStudied || topics.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Em {areas.length} áreas de conhecimento
          </div>
        </div>
      </div>

      {/* 4. Taxa de Conclusão */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Taxa de conclusão</span>
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Target className="w-4 h-4 stroke-[2]" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {completionRate}%
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {totalSolved} de {user.metaGlobal} problemas da meta
          </div>
        </div>
      </div>
    </div>
  );
};
