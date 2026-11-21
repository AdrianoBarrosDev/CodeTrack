import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';

export const StudyHeatmap: React.FC = () => {
  const { activityData, problems } = useApp();

  // Mapear contagens reais de problemas por data
  const computedActivity = useMemo(() => {
    const map = new Map<string, number>();

    // Inicializa com os dados de activityData (se houver histórico)
    activityData.forEach((d) => {
      map.set(d.date, d.count);
    });

    // Sobrepõe ou garante os problemas reais cadastrados
    const problemsByDate = new Map<string, number>();
    problems
      .filter((p) => p.status === 'Resolvido' && p.dataResolucao)
      .forEach((p) => {
        problemsByDate.set(p.dataResolucao, (problemsByDate.get(p.dataResolucao) || 0) + 1);
      });

    // Se temos problemas cadastrados, sincronizamos com a contagem real
    problemsByDate.forEach((count, date) => {
      map.set(date, Math.max(map.get(date) || 0, count));
    });

    // Converter para array ordenado por data
    const dates = Array.from(map.keys()).sort();
    return dates.map((date) => ({
      date,
      count: map.get(date) || 0,
    }));
  }, [activityData, problems]);

  // Contagem de problemas e dias ativos coerente com a base
  const totalSolved = useMemo(() => {
    const solvedFromProblems = problems.filter((p) => p.status === 'Resolvido').length;
    const solvedFromActivity = computedActivity.reduce((acc, d) => acc + d.count, 0);
    return Math.max(solvedFromProblems, solvedFromActivity);
  }, [problems, computedActivity]);

  const activeDaysCount = useMemo(() => {
    return computedActivity.filter((d) => d.count > 0).length;
  }, [computedActivity]);

  // Dividir os dados em semanas (7 dias por coluna)
  const weeks = useMemo(() => {
    const res: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];

    computedActivity.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === computedActivity.length - 1) {
        res.push(currentWeek);
        currentWeek = [];
      }
    });
    return res;
  }, [computedActivity]);

  // Calcular meses de cabeçalho dinamicamente
  const monthLabels = useMemo(() => {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const seenMonths = new Set<string>();
    const labels: string[] = [];

    weeks.forEach((week) => {
      const firstDay = week[0]?.date;
      if (firstDay) {
        const [, m] = firstDay.split('-');
        const mIdx = parseInt(m, 10) - 1;
        const name = monthNames[mIdx];
        if (name && !seenMonths.has(name)) {
          seenMonths.add(name);
          labels.push(name);
        }
      }
    });

    return labels.length > 0 ? labels : ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'];
  }, [weeks]);

  // Função para retornar a cor (tons de pêssego / salmão / terracota suave)
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-slate-100/70 hover:bg-slate-200';
    if (count === 1) return 'bg-[#FAD9C8] hover:bg-[#F7C6AE]'; // Pêssego claro
    if (count === 2) return 'bg-[#EFA782] hover:bg-[#EA966D]'; // Salmão médio
    return 'bg-[#C97A52] hover:bg-[#B86B44]'; // Terracota escuro
  };

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
            {monthLabels.map((m, idx) => (
              <span key={`${m}-${idx}`}>{m}</span>
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
