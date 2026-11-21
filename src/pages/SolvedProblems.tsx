import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Star,
  ExternalLink,
  Trash2,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDatePtBR, sanitizeUrl } from '../utils/helpers';
import { ProblemStatus } from '../types';

export const SolvedProblems: React.FC = () => {
  const { problems, topics, areas, openAddProblem, toggleStar, deleteProblem } = useApp();

  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('todas');
  const [selectedTopic, setSelectedTopic] = useState('todos');
  const [selectedPlatform, setSelectedPlatform] = useState('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [onlyStars, setOnlyStars] = useState(false);

  // Filtragem dos tópicos baseado na área selecionada
  const availableTopics = useMemo(() => {
    if (selectedArea === 'todas') return topics;
    return topics.filter((t) => t.areaId === selectedArea);
  }, [topics, selectedArea]);

  // Lista filtrada
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      // Busca por texto
      if (
        search.trim() &&
        !problem.nome.toLowerCase().includes(search.toLowerCase()) &&
        !problem.plataforma.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // Estrelas
      if (onlyStars && !problem.isStar) return false;

      // Status
      if (selectedStatus !== 'todos' && problem.status !== selectedStatus) return false;

      // Plataforma
      if (selectedPlatform !== 'todas' && problem.plataforma !== selectedPlatform) return false;

      // Tópico
      if (selectedTopic !== 'todos' && problem.topicId !== selectedTopic) return false;

      // Área
      if (selectedArea !== 'todas') {
        const topic = topics.find((t) => t.id === problem.topicId);
        if (!topic || topic.areaId !== selectedArea) return false;
      }

      return true;
    });
  }, [problems, search, onlyStars, selectedStatus, selectedPlatform, selectedTopic, selectedArea, topics]);

  const clearFilters = () => {
    setSearch('');
    setSelectedArea('todas');
    setSelectedTopic('todos');
    setSelectedPlatform('todas');
    setSelectedStatus('todos');
    setOnlyStars(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Problemas Resolvidos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Histórico completo de todos os desafios e exercícios cadastrados na sua jornada.
          </p>
        </div>

        <button
          onClick={() => openAddProblem()}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-xs shadow-brand-500/30 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Adicionar problema
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Busca textual */}
          <div className="relative sm:col-span-2">
            <input
              type="text"
              placeholder="Buscar por nome do problema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Filtro Área */}
          <div>
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setSelectedTopic('todos');
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="todas">Todas as áreas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Tópico */}
          <div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="todos">Todos os tópicos</option>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Plataforma */}
          <div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="todas">Todas as plataformas</option>
              <option value="CSES">CSES</option>
              <option value="Codeforces">Codeforces</option>
              <option value="AtCoder">AtCoder</option>
              <option value="Beecrowd">Beecrowd</option>
              <option value="CodeChef">CodeChef</option>
              <option value="LeetCode">LeetCode</option>
            </select>
          </div>
        </div>

        {/* Linha secundária de filtros */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            {/* Toggle Estrelas */}
            <button
              onClick={() => setOnlyStars(!onlyStars)}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-medium ${
                onlyStars
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyStars ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
              Apenas Problemas Estrela
            </button>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-white"
            >
              <option value="todos">Todos os status</option>
              <option value="Resolvido">Resolvido</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Revisar">Revisar</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">
              Exibindo <strong>{filteredProblems.length}</strong> de {problems.length} problemas
            </span>
            {(search || selectedArea !== 'todas' || selectedTopic !== 'todos' || selectedPlatform !== 'todas' || selectedStatus !== 'todos' || onlyStars) && (
              <button
                onClick={clearFilters}
                className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 ml-2"
              >
                <RotateCcw className="w-3 h-3" /> Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 font-semibold text-sm">Nenhum problema encontrado com os filtros atuais.</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-brand-600 hover:underline text-xs font-semibold"
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4 font-semibold">Problema</th>
                  <th className="py-3 px-4 font-semibold">Área / Tópico</th>
                  <th className="py-3 px-4 font-semibold">Plataforma</th>
                  <th className="py-3 px-4 font-semibold">Dificuldade</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Data</th>
                  <th className="py-3 px-4 font-semibold text-center">Estrela</th>
                  <th className="py-3 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProblems.map((problem) => {
                  const topic = topics.find((t) => t.id === problem.topicId);
                  const area = areas.find((a) => a.id === topic?.areaId);

                  return (
                    <tr key={problem.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Nome do Problema */}
                      <td className="py-3 px-4">
                        <a
                          href={sanitizeUrl(problem.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-slate-800 hover:text-brand-600 flex items-center gap-1.5 transition-colors"
                        >
                          {problem.nome}
                          <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </td>

                      {/* Área e Tópico */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700">{topic?.nome || 'Geral'}</span>
                          <span className="text-[10px] text-slate-400">{area?.nome}</span>
                        </div>
                      </td>

                      {/* Plataforma */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                          {problem.plataforma}
                        </span>
                      </td>

                      {/* Dificuldade */}
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {problem.dificuldade || '-'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            problem.status === 'Resolvido'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : problem.status === 'Em andamento'
                              ? 'bg-sky-50 text-sky-700 border-sky-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}
                        >
                          {problem.status === 'Resolvido' && '✓'} {problem.status}
                        </span>
                      </td>

                      {/* Data */}
                      <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                        {formatDatePtBR(problem.dataResolucao)}
                      </td>

                      {/* Estrela */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStar(problem.id)}
                          className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Star
                            className={`w-4 h-4 transition-transform active:scale-125 ${
                              problem.isStar
                                ? 'text-amber-500 fill-amber-400'
                                : 'text-slate-300 hover:text-slate-400'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir "${problem.nome}"?`)) {
                              deleteProblem(problem.id);
                            }
                          }}
                          className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Excluir problema"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
