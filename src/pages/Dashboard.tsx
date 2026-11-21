import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getFullCurrentDatePtBR } from '../utils/helpers';
import { StatCards } from '../components/dashboard/StatCards';
import { AreaProgress } from '../components/dashboard/AreaProgress';
import { ActivityChartCard } from '../components/dashboard/ActivityChartCard';
import { RecentActivityTable } from '../components/dashboard/RecentActivityTable';
import { ReviewProblemsCard } from '../components/dashboard/ReviewProblemsCard';
import { StudyHeatmap } from '../components/dashboard/StudyHeatmap';

export const Dashboard: React.FC = () => {
  const { user, openAddProblem } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Dashboard Top Greeting & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{getFullCurrentDatePtBR()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Olá, {user.nome} <span className="text-2xl animate-pulse">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cada problema resolvido é um passo à frente. Vamos continuar?
          </p>
        </div>

        <button
          onClick={() => openAddProblem()}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-brand-500/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Adicionar problema
        </button>
      </div>

      {/* 4 Cards de Indicadores */}
      <StatCards />

      {/* Progresso por área + Atividade de estudos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaProgress />
        <ActivityChartCard />
      </div>

      {/* Atividade recente + Problemas para revisar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityTable />
        </div>
        <div>
          <ReviewProblemsCard />
        </div>
      </div>

      {/* Seu mapa de estudos (Heatmap) */}
      <StudyHeatmap />

      {/* Rodapé motivacional */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60">
        <span>Seu progresso, um problema por vez.</span>
        <span className="flex items-center gap-1 text-slate-500 font-medium mt-2 sm:mt-0">
          ⚡ Continue construindo sua melhor versão.
        </span>
      </div>
    </div>
  );
};
