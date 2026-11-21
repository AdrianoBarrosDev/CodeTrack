import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const ActivityChartCard: React.FC = () => {
  const { problems } = useApp();
  const [viewMode, setViewMode] = useState<'Semana' | 'Mês'>('Semana');

  // Determinar data base (usando a data atual ou a mais recente dos problemas)
  const baseDate = useMemo(() => {
    const solvedDates = problems
      .filter((p) => p.status === 'Resolvido' && p.dataResolucao)
      .map((p) => p.dataResolucao)
      .sort();
    const latestProblemDate = solvedDates.length > 0 ? solvedDates[solvedDates.length - 1] : null;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Se a data mais recente cadastrada for mais nova (ex: ambiente simulado em 2026), respeita essa data
    const refStr = latestProblemDate && latestProblemDate > todayStr ? latestProblemDate : todayStr;
    const [y, m, d] = refStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [problems]);

  // Dados da semana atual (Segunda a Domingo)
  const { weekData, weekTotal, weekActiveDays } = useMemo(() => {
    // Achar a segunda-feira da semana da baseDate
    const current = new Date(baseDate);
    const dayOfWeek = current.getDay(); // 0 = Dom, 1 = Seg, ...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(current);
    monday.setDate(current.getDate() + diffToMonday);

    const daysLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const data: { day: string; date: string; problemas: number }[] = [];

    let total = 0;
    let activeDays = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      const count = problems.filter(
        (p) => p.status === 'Resolvido' && p.dataResolucao === dateStr
      ).length;

      data.push({
        day: daysLabels[i],
        date: dateStr,
        problemas: count,
      });

      total += count;
      if (count > 0) activeDays++;
    }

    return { weekData: data, weekTotal: total, weekActiveDays: activeDays };
  }, [problems, baseDate]);

  // Dados das últimas 4 semanas para o Mês
  const { monthData, monthTotal, monthActiveDays } = useMemo(() => {
    const data: { day: string; problemas: number }[] = [];
    let total = 0;
    let activeDaysCount = 0;

    for (let w = 3; w >= 0; w--) {
      let weekCount = 0;
      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(baseDate);
        dateObj.setDate(baseDate.getDate() - (w * 7 + (6 - d)));
        const dateStr = dateObj.toISOString().split('T')[0];

        const count = problems.filter(
          (p) => p.status === 'Resolvido' && p.dataResolucao === dateStr
        ).length;

        weekCount += count;
        if (count > 0) activeDaysCount++;
      }
      data.push({
        day: `Sem ${4 - w}`,
        problemas: weekCount,
      });
      total += weekCount;
    }

    return { monthData: data, monthTotal: total, monthActiveDays: activeDaysCount };
  }, [problems, baseDate]);

  const currentData = viewMode === 'Semana' ? weekData : monthData;
  const currentTotal = viewMode === 'Semana' ? weekTotal : monthTotal;
  const currentActiveDays = viewMode === 'Semana' ? weekActiveDays : monthActiveDays;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Atividade de estudos</h3>
            <p className="text-xs text-slate-400 mt-0.5">Pequenos passos, grandes conquistas.</p>
          </div>

          {/* Toggle Semana / Mês */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold text-slate-500">
            <button
              onClick={() => setViewMode('Semana')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'Semana'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-700'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('Mês')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'Mês'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'hover:text-slate-700'
              }`}
            >
              Mês
            </button>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-44 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderRadius: '10px',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
                formatter={(value: any) => [`${value} problema${Number(value) !== 1 ? 's' : ''}`, 'Resolvidos']}
              />
              <Bar dataKey="problemas" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Stats Dinâmicos */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
        <span className="font-semibold text-slate-800">
          {currentTotal} problema{currentTotal !== 1 ? 's' : ''}{' '}
          <span className="font-normal text-slate-400">
            {viewMode === 'Semana' ? 'nesta semana' : 'nas últimas 4 semanas'}
          </span>
        </span>
        <span className="font-semibold text-emerald-600 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> {currentActiveDays} dia{currentActiveDays !== 1 ? 's' : ''} de estudo
        </span>
      </div>
    </div>
  );
};
