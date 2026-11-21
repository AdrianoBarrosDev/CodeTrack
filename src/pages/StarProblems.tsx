import React, { useState, useMemo } from 'react';
import {
  Star,
  Search,
  RotateCw,
  ExternalLink,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDatePtBR, getReviewStatus, sanitizeUrl } from '../utils/helpers';

export const StarProblems: React.FC = () => {
  const { problems, topics, areas, openReviewModal, toggleStar } = useApp();

  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('todas');
  const [selectedPlatform, setSelectedPlatform] = useState('todas');
  const [filterNeverReviewed, setFilterNeverReviewed] = useState(false);

  // Apenas problemas marcados com estrela
  const starProblems = useMemo(() => {
    return problems.filter((p) => p.isStar);
  }, [problems]);

  // Filtragem
  const filteredStarProblems = useMemo(() => {
    return starProblems.filter((p) => {
      if (
        search.trim() &&
        !p.nome.toLowerCase().includes(search.toLowerCase()) &&
        !p.conceitoPrincipal?.toLowerCase().includes(search.toLowerCase()) &&
        !p.motivoEstrela?.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      if (selectedPlatform !== 'todas' && p.plataforma !== selectedPlatform) return false;

      if (selectedArea !== 'todas') {
        const topic = topics.find((t) => t.id === p.topicId);
        if (!topic || topic.areaId !== selectedArea) return false;
      }

      if (filterNeverReviewed && p.dataUltimaRevisao) return false;

      return true;
    });
  }, [starProblems, search, selectedPlatform, selectedArea, filterNeverReviewed, topics]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Biblioteca de Problemas Estrela
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sua coleção pessoal de exercícios clássicos, educativos e fundamentais para revisão contínua.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{starProblems.length} problemas de referência</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Busca textual */}
          <div className="relative sm:col-span-2">
            <input
              type="text"
              placeholder="Buscar por nome, técnica ou conceito principal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Área */}
          <div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="todas">Todas as áreas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Plataforma */}
          <div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="todas">Todas as plataformas</option>
              <option value="CSES">CSES</option>
              <option value="Codeforces">Codeforces</option>
              <option value="AtCoder">AtCoder</option>
              <option value="Beecrowd">Beecrowd</option>
              <option value="LeetCode">LeetCode</option>
            </select>
          </div>
        </div>

        {/* Botão Nunca Revisados */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setFilterNeverReviewed(!filterNeverReviewed)}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-medium ${
              filterNeverReviewed
                ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Apenas nunca revisados
          </button>

          <span className="text-slate-400">
            Mostrando <strong>{filteredStarProblems.length}</strong> de {starProblems.length} clássicos
          </span>
        </div>
      </div>

      {/* Grid de Cards de Problemas Estrela */}
      {filteredStarProblems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Nenhum Problema Estrela corresponde aos filtros</h3>
          <p className="text-xs text-slate-400 mt-1">Tente ajustar a busca ou limpar os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStarProblems.map((problem) => {
            const topic = topics.find((t) => t.id === problem.topicId);
            const area = areas.find((a) => a.id === topic?.areaId);
            const statusInfo = getReviewStatus(problem);

            return (
              <div
                key={problem.id}
                className="bg-white rounded-2xl border-2 border-amber-200/90 hover:border-amber-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Star className="w-4 h-4 fill-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                          {problem.nome}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-semibold text-slate-600">{topic?.nome}</span>
                          <span>·</span>
                          <span>{problem.plataforma}</span>
                          {problem.dificuldade && (
                            <>
                              <span>·</span>
                              <span className="font-medium text-slate-500">{problem.dificuldade}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStar(problem.id)}
                      title="Remover estrela"
                      className="p-1 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>

                  {/* Badge de Status de Revisão */}
                  <div className="mt-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.colorClass}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Conceito Principal Ensinado */}
                  {problem.conceitoPrincipal && (
                    <div className="mt-3.5 p-3 rounded-xl bg-amber-50/60 border border-amber-100/90 text-xs text-slate-700">
                      <span className="font-bold text-amber-900 flex items-center gap-1 mb-1 text-[11px]">
                        <Sparkles className="w-3 h-3 text-amber-600" /> Conceito Principal:
                      </span>
                      <p className="leading-relaxed">{problem.conceitoPrincipal}</p>
                    </div>
                  )}

                  {/* Motivo da Estrela */}
                  {problem.motivoEstrela && (
                    <p className="text-xs text-slate-500 mt-2.5 italic">
                      &quot;{problem.motivoEstrela}&quot;
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400 flex flex-col">
                    <span>
                      {problem.dataUltimaRevisao ? `Revisado ${problem.qtdRevisoes}x` : 'Nunca revisado'}
                    </span>
                    {problem.proximaRevisao && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        Próx: {formatDatePtBR(problem.proximaRevisao)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={sanitizeUrl(problem.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Abrir no juiz online"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openReviewModal(problem)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all"
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
  );
};
