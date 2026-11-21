import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const ActivityChartCard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'Semana' | 'Mês'>('Semana');

  const weekData = [
    { day: 'Seg', problemas: 1 },
    { day: 'Ter', problemas: 2 },
    { day: 'Qua', problemas: 1 },
    { day: 'Qui', problemas: 0 },
    { day: 'Sex', problemas: 2 },
    { day: 'Sáb', problemas: 2 },
    { day: 'Dom', problemas: 0 },
  ];

  const monthData = [
    { day: 'Sem 1', problemas: 8 },
    { day: 'Sem 2', problemas: 11 },
    { day: 'Sem 3', problemas: 9 },
    { day: 'Sem 4', problemas: 12 },
  ];

  const currentData = viewMode === 'Semana' ? weekData : monthData;

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
                formatter={(value: any) => [`${value} problemas`, 'Resolvidos']}
              />
              <Bar dataKey="problemas" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
        <span className="font-semibold text-slate-800">
          8 problemas <span className="font-normal text-slate-400">nesta semana</span>
        </span>
        <span className="font-semibold text-emerald-600 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> 5 dias de estudo
        </span>
      </div>
    </div>
  );
};
