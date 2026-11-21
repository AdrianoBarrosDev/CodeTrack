import React, { useState, useEffect } from 'react';
import { Search, X, Star, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { sanitizeUrl } from '../utils/helpers';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, problems, topics, areas, openReviewModal } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Escutar atalho Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  const filteredProblems = query.trim()
    ? problems.filter(
        (p) =>
          p.nome.toLowerCase().includes(query.toLowerCase()) ||
          p.plataforma.toLowerCase().includes(query.toLowerCase()) ||
          p.conceitoPrincipal?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const filteredTopics = query.trim()
    ? topics.filter((t) => t.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];

  const handleSelectTopic = (topicId: string) => {
    navigate(`/assuntos/${topicId}`);
    closeSearch();
  };

  const handleOpenProblemLink = (url: string) => {
    const safeUrl = sanitizeUrl(url);
    if (safeUrl !== '#') {
      window.open(safeUrl, '_blank', 'noopener,noreferrer');
    }
    closeSearch();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Pesquise por problemas, tópicos, conceitos ou plataformas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={closeSearch}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Digite para buscar em todos os 128 problemas e tópicos do CodeTrack.
            </div>
          ) : filteredProblems.length === 0 && filteredTopics.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          ) : (
            <>
              {/* Tópicos encontrados */}
              {filteredTopics.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Tópicos
                  </h4>
                  <div className="space-y-1">
                    {filteredTopics.map((t) => {
                      const area = areas.find((a) => a.id === t.areaId);
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleSelectTopic(t.id)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-brand-600" />
                            <div>
                              <span className="text-xs font-semibold text-slate-800">{t.nome}</span>
                              <span className="text-[10px] text-slate-400 ml-2">({area?.nome})</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Problemas encontrados */}
              {filteredProblems.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" /> Problemas
                  </h4>
                  <div className="space-y-1">
                    {filteredProblems.map((p) => {
                      const topic = topics.find((t) => t.id === p.topicId);
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            {p.isStar ? (
                              <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-slate-300 ml-1 mr-1" />
                            )}
                            <div>
                              <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                                <span>{p.nome}</span>
                                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                                  {p.plataforma}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {topic?.nome} {p.dificuldade ? `· ${p.dificuldade}` : ''}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {p.isStar && (
                              <button
                                onClick={() => {
                                  closeSearch();
                                  openReviewModal(p);
                                }}
                                className="px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                              >
                                Revisar
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenProblemLink(p.url)}
                              className="px-2.5 py-1 text-[11px] font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors flex items-center gap-1"
                            >
                              Ver enunciado
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
