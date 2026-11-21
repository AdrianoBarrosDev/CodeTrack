import React from 'react';
import {
  BarChart2,
  TrendingUp,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Flame
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { StudyHeatmap } from '../components/dashboard/StudyHeatmap';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

export const Statistics: React.FC = () => {
  const { problems, topics, areas, activityData } = useApp();

  const totalSolved = problems.filter((p) => p.status === 'Resolvido').length;
  const starCount = problems.filter((p) => p.isStar).length;
  const activeDays = activityData.filter((d) => d.count > 0).length;

  // Cálculo dinâmico de semanas decorridas com base nas datas de resolução
  const solvedDates = problems
    .filter((p) => p.status === 'Resolvido' && p.dataResolucao)
    .map((p) => p.dataResolucao)
    .sort();
  const firstDateStr = solvedDates.length > 0 ? solvedDates[0] : null;
  const lastDateStr = solvedDates.length > 0 ? solvedDates[solvedDates.length - 1] : null;
  
  let totalWeeks = 1;
  if (firstDateStr && lastDateStr) {
    const d1 = new Date(firstDateStr);
    const d2 = new Date(lastDateStr);
    const diffDays = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
    totalWeeks = Math.max(1, Math.ceil(diffDays / 7));
  }
  const avgPerWeek = (totalSolved / totalWeeks).toFixed(1);

  // Tópicos realmente estudados (com pelo menos 1 problema resolvido)
  const topicsStudied = new Set(
    problems.filter((p) => p.status === 'Resolvido').map((p) => p.topicId)
  ).size;

  // Distribuição por área
  const areaDistribution = areas.map((area) => {
    const areaTopicIds = topics.filter((t) => t.areaId === area.id).map((t) => t.id);
    const count = problems.filter(
      (p) => areaTopicIds.includes(p.topicId) && p.status === 'Resolvido'
    ).length;
    return {
      name: area.nome,
      problemas: count,
      color: area.cor,
    };
  });

  // Tópicos mais estudados
  const topicsWithCount = topics.map((topic) => {
    const count = problems.filter((p) => p.topicId === topic.id && p.status === 'Resolvido').length;
    const stars = problems.filter((p) => p.topicId === topic.id && p.isStar).length;
    const area = areas.find((a) => a.id === topic.areaId);
    return {
      ...topic,
      areaName: area?.nome || '',
      areaColor: area?.cor || '#4F46E5',
      solvedCount: count,
      starCount: stars,
    };
  }).sort((a, b) => b.solvedCount - a.solvedCount);

  const topTopics = topicsWithCount.slice(0, 5);
  const leastStudiedTopics = [...topicsWithCount].reverse().slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Estatísticas & Evolução
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Acompanhe seu ritmo de estudo, métricas de retenção e equilíbrio entre áreas.
        </p>
      </div>

      {/* Indicadores Gerais */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400">Total resolvidos</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalSolved}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400">Problemas Estrela</span>
          <div className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400" /> {starCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400">Dias Ativos</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
            <Flame className="w-4 h-4" /> {activeDays}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400">Média semanal</span>
          <div className="text-2xl font-bold text-brand-600 mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> {avgPerWeek}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400">Assuntos explorados</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {topicsStudied}
            <span className="text-xs font-normal text-slate-400 ml-1">/ {topics.length}</span>
          </div>
        </div>
      </div>

      {/* Mapa de Estudos (Heatmap) */}
      <StudyHeatmap />

      {/* Gráficos de Distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Área de Conhecimento */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Distribuição por Área
          </h3>
          <p className="text-xs text-slate-400 mb-4">Volume de problemas resolvidos por área.</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`${value} problemas`, 'Resolvidos']}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '10px', color: '#fff' }}
                />
                <Bar dataKey="problemas" radius={[6, 6, 0, 0]}>
                  {areaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proporção em Gráfico de Rosca */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Equilíbrio de Estudos
            </h3>
            <p className="text-xs text-slate-400 mb-4">Divisão proporcional do seu esforço.</p>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={areaDistribution}
                    dataKey="problemas"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {areaDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center pt-2 border-t border-slate-100 text-xs">
            {areaDistribution.map((a) => (
              <div key={a.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-slate-600 font-medium">{a.name} ({a.problemas})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tópicos Mais & Menos Estudados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Tópicos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Tópicos com Mais Exercícios</h3>
          </div>
          <div className="space-y-3">
            {topTopics.map((topic, idx) => (
              <div key={topic.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{topic.nome}</h4>
                    <span className="text-[10px] text-slate-400">{topic.areaName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800">{topic.solvedCount} problemas</span>
                  {topic.starCount > 0 && (
                    <div className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 justify-end">
                      <Star className="w-3 h-3 fill-amber-400" /> {topic.starCount} estrelas
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tópicos que Precisam de Atenção */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900">Sugestões de Foco & Atenção</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">Tópicos com menos problemas resolvidos para equilibrar seus conhecimentos:</p>
          <div className="space-y-3">
            {leastStudiedTopics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{topic.nome}</h4>
                  <span className="text-[10px] text-slate-400">{topic.areaName}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-rose-700">{topic.solvedCount} resolvidos</span>
                  <div className="text-[10px] text-slate-400">Meta: {topic.metaProblemas || 10}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
