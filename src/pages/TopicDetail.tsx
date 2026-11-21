import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Star,
  CheckCircle2,
  Calendar,
  ExternalLink,
  RotateCw,
  BarChart2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDatePtBR, getReviewStatus, sanitizeUrl } from '../utils/helpers';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const TopicDetail: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { topics, areas, problems, openAddProblem, toggleStar, deleteProblem, openReviewModal } = useApp();

  const [activeTab, setActiveTab] = useState<'todos' | 'estrelas' | 'estatisticas'>('todos');

  const topic = topics.find((t) => t.id === topicId);
  const area = areas.find((a) => a.id === topic?.areaId);

  if (!topic || !area) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800">Tópico não encontrado</h2>
        <Link to="/assuntos" className="text-brand-600 text-sm hover:underline mt-2 inline-block">
          Voltar para Meus Assuntos
        </Link>
      </div>
    );
  }

  const topicProblems = problems.filter((p) => p.topicId === topic.id);
  const solvedProblems = topicProblems.filter((p) => p.status === 'Resolvido');
  const starProblems = topicProblems.filter((p) => p.isStar);

  const lastStudied = [...topicProblems].sort((a, b) =>
    b.dataResolucao.localeCompare(a.dataResolucao)
  )[0];

  // Dados para gráficos da aba estatísticas
  const difficultyDistribution = [
    { name: 'Fácil', value: topicProblems.filter((p) => p.dificuldade === 'Fácil' || Number(p.dificuldade) < 1200).length, color: '#10B981' },
    { name: 'Médio', value: topicProblems.filter((p) => p.dificuldade === 'Médio' || (Number(p.dificuldade) >= 1200 && Number(p.dificuldade) <= 1600)).length, color: '#3B82F6' },
    { name: 'Difícil', value: topicProblems.filter((p) => p.dificuldade === 'Difícil' || Number(p.dificuldade) > 1600).length, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Navigation */}
      <div>
        <Link
          to="/assuntos"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Meus Assuntos
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: area.cor }}
              />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {area.nome}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {topic.nome}
            </h1>
            {topic.descricao && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                {topic.descricao}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openAddProblem(topic.id)}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-xs shadow-brand-500/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Adicionar problema
            </button>
          </div>
        </div>
      </div>

      {/* Mini Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400">Total resolvidos</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{solvedProblems.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400">Problemas Estrela</span>
          <div className="text-xl font-bold text-amber-600 mt-1 flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-500" />
            {starProblems.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400">Meta do tópico</span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {solvedProblems.length}/{topic.metaProblemas || 10}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400">Último estudo</span>
          <div className="text-xs font-bold text-slate-700 mt-2 truncate">
            {lastStudied ? formatDatePtBR(lastStudied.dataResolucao) : 'Nenhum'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('todos')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'todos'
                ? 'text-brand-600 border-b-2 border-brand-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todos os problemas ({topicProblems.length})
          </button>
          <button
            onClick={() => setActiveTab('estrelas')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'estrelas'
                ? 'text-amber-700 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            Problemas Estrela ({starProblems.length})
          </button>
          <button
            onClick={() => setActiveTab('estatisticas')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'estatisticas'
                ? 'text-brand-600 border-b-2 border-brand-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Estatísticas
          </button>
        </div>
      </div>

      {/* Tab 1: Todos os Problemas */}
      {activeTab === 'todos' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {topicProblems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xs text-slate-400">Nenhum problema cadastrado neste tópico ainda.</p>
              <button
                onClick={() => openAddProblem(topic.id)}
                className="mt-3 px-3.5 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-semibold"
              >
                Cadastrar primeiro exercício
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4 font-semibold">Problema</th>
                    <th className="py-3 px-4 font-semibold">Plataforma</th>
                    <th className="py-3 px-4 font-semibold">Dificuldade</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Data Resolução</th>
                    <th className="py-3 px-4 font-semibold text-center">Estrela</th>
                    <th className="py-3 px-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topicProblems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <a
                          href={sanitizeUrl(problem.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-800 hover:text-brand-600 flex items-center gap-1.5"
                        >
                          {problem.nome}
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                          {problem.plataforma}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {problem.dificuldade || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          ✓ {problem.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {formatDatePtBR(problem.dataResolucao)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStar(problem.id)}
                          className="p-1 rounded-md hover:bg-slate-100"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              problem.isStar ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir o problema "${problem.nome}"?`)) {
                              deleteProblem(problem.id);
                            }
                          }}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded-md hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Problemas Estrela (Destaque Amarelo/Dourado) */}
      {activeTab === 'estrelas' && (
        <div className="space-y-4">
          {starProblems.length === 0 ? (
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-8 text-center">
              <Star className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-amber-900">Nenhum Problema Estrela neste tópico</h3>
              <p className="text-xs text-amber-700/80 mt-1 max-w-sm mx-auto">
                Problemas estrela são exercícios clássicos que ensinam a essência do assunto. Marque a estrela nos problemas da lista para adicioná-los aqui!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {starProblems.map((problem) => {
                const statusInfo = getReviewStatus(problem);

                return (
                  <div
                    key={problem.id}
                    className="bg-white rounded-2xl border-2 border-amber-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                            <Star className="w-4 h-4 fill-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{problem.nome}</h3>
                            <span className="text-[11px] text-slate-400">
                              {problem.plataforma} · {problem.dificuldade}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.colorClass}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Conceito Principal */}
                      {problem.conceitoPrincipal && (
                        <div className="mt-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs">
                          <span className="font-bold text-amber-900 flex items-center gap-1 mb-0.5">
                            <Sparkles className="w-3 h-3 text-amber-500" /> Conceito Principal:
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {problem.conceitoPrincipal}
                          </p>
                        </div>
                      )}

                      {/* Motivo da Estrela */}
                      {problem.motivoEstrela && (
                        <p className="text-xs text-slate-500 mt-2 italic">
                          &quot;{problem.motivoEstrela}&quot;
                        </p>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-[11px] text-slate-400">
                        {problem.dataUltimaRevisao ? (
                          <span>Última revisão: {formatDatePtBR(problem.dataUltimaRevisao)} ({problem.qtdRevisoes}x)</span>
                        ) : (
                          <span>Nunca revisado</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={sanitizeUrl(problem.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-slate-600 hover:text-brand-600 font-medium transition-colors"
                        >
                          Enunciado
                        </a>
                        <button
                          onClick={() => openReviewModal(problem)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center gap-1 shadow-xs"
                        >
                          <RotateCw className="w-3 h-3" /> Revisar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Estatísticas do Tópico */}
      {activeTab === 'estatisticas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Distribuição por Dificuldade
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {difficultyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">
                Resumo de Retenção
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Acompanhamento dos exercícios fundamentais deste tópico.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Problemas resolvidos</span>
                  <strong className="text-slate-800">{solvedProblems.length}</strong>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-amber-50 text-amber-900">
                  <span>Problemas Estrela</span>
                  <strong>{starProblems.length}</strong>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Problemas revisados pelo menos 1x</span>
                  <strong className="text-slate-800">
                    {starProblems.filter((p) => (p.qtdRevisoes || 0) > 0).length}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
