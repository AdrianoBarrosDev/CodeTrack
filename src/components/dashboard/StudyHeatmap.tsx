import React from 'react';
import { useApp } from '../../contexts/AppContext';

export const StudyHeatmap: React.FC = () => {
  const { activityData } = useApp();

  // Calcular dias ativos e total
  const activeDaysCount = activityData.filter((d) => d.count > 0).length;
  const totalSolved = activityData.reduce((acc, d) => acc + d.count, 0);

  // Dividir os dados em semanas (7 dias por coluna)
  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];

  activityData.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === activityData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Função para retornar a cor exata do mockup (tons de pêssego / salmão / terracota suave)
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-slate-100/70 hover:bg-slate-200';
    if (count === 1) return 'bg-[#FAD9C8] hover:bg-[#F7C6AE]'; // Pêssego claro
    if (count === 2) return 'bg-[#EFA782] hover:bg-[#EA966D]'; // Salmão médio
    return 'bg-[#C97A52] hover:bg-[#B86B44]'; // Terracota escuro
  };

  const months = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Seu mapa de estudos</h3>
          <p className="text-xs text-slate-400 mt-0.5">Um pouco todos os dias faz toda a diferença.</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>{activeDaysCount} dias ativos</span>
        </div>
      </div>

      {/* Month Labels */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[680px]">
          <div className="flex justify-between text-[11px] font-medium text-slate-400 px-2 mb-2">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* Grid Columns */}
          <div className="flex gap-1.5 justify-between">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} problema${day.count !== 1 ? 's' : ''} resolvido${day.count !== 1 ? 's' : ''}`}
                    className={`w-3.5 h-3.5 rounded-xs transition-colors cursor-pointer ${getCellColor(
                      day.count
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100 mt-3">
        <span className="text-slate-500 font-medium">
          <strong className="text-slate-800">{totalSolved} problemas</strong> resolvidos na sua jornada
        </span>

        {/* Legenda Menos -> Mais */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <span>Menos</span>
          <span className="w-3 h-3 rounded-xs bg-slate-100 border border-slate-200"></span>
          <span className="w-3 h-3 rounded-xs bg-[#FAD9C8]"></span>
          <span className="w-3 h-3 rounded-xs bg-[#EFA782]"></span>
          <span className="w-3 h-3 rounded-xs bg-[#C97A52]"></span>
          <span>Mais</span>
        </div>
      </div>
    </div>
  );
};
