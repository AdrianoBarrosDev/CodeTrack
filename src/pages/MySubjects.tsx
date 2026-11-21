import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  BookPlus,
  Star,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Trash2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDatePtBR } from '../utils/helpers';
import { AddAreaModal } from '../modals/AddAreaModal';
import { AddTopicModal } from '../modals/AddTopicModal';

export const MySubjects: React.FC = () => {
  const { areas, topics, problems, deleteTopic, deleteArea } = useApp();
  const navigate = useNavigate();

  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [selectedAreaForNewTopic, setSelectedAreaForNewTopic] = useState<string | undefined>();

  const handleOpenAddTopic = (areaId?: string) => {
    setSelectedAreaForNewTopic(areaId);
    setIsAddTopicOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Meus Assuntos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize sua biblioteca de conhecimento por áreas e tópicos de estudo.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddAreaOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 flex items-center gap-1.5 transition-all"
          >
            <FolderPlus className="w-4 h-4 text-slate-500" />
            Nova Área
          </button>
          <button
            onClick={() => handleOpenAddTopic()}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs shadow-brand-500/30 flex items-center gap-1.5 transition-all"
          >
            <BookPlus className="w-4 h-4" />
            Novo Tópico
          </button>
        </div>
      </div>

      {/* Areas & Topics Grouped */}
      <div className="space-y-6">
        {areas.map((area) => {
          const areaTopics = topics.filter((t) => t.areaId === area.id);
          const areaTopicIds = areaTopics.map((t) => t.id);
          const totalAreaSolved = problems.filter(
            (p) => areaTopicIds.includes(p.topicId) && p.status === 'Resolvido'
          ).length;
          const totalAreaStars = problems.filter(
            (p) => areaTopicIds.includes(p.topicId) && p.isStar
          ).length;

          return (
            <div
              key={area.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
            >
              {/* Area Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: area.cor }}
                  />
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      {area.nome}
                      <span className="text-xs font-normal text-slate-400">
                        ({areaTopics.length} tópico{areaTopics.length !== 1 ? 's' : ''})
                      </span>
                    </h2>
                    {area.descricao && (
                      <p className="text-xs text-slate-500 mt-0.5">{area.descricao}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <strong>{totalAreaSolved}</strong> resolvidos
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <strong>{totalAreaStars}</strong> estrelas
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenAddTopic(area.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                    title="Adicionar tópico nesta área"
                  >
                    <BookPlus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir a área "${area.nome}" e seus tópicos?`)) {
                        deleteArea(area.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Excluir área"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="p-5">
                {areaTopics.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    Nenhum tópico cadastrado nesta área ainda.{' '}
                    <button
                      onClick={() => handleOpenAddTopic(area.id)}
                      className="text-brand-600 hover:underline font-semibold"
                    >
                      Criar primeiro tópico
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {areaTopics.map((topic) => {
                      const topicProblems = problems.filter((p) => p.topicId === topic.id);
                      const solvedCount = topicProblems.filter((p) => p.status === 'Resolvido').length;
                      const starsCount = topicProblems.filter((p) => p.isStar).length;
                      const targetMeta = topic.metaProblemas || 10;
                      const progressPct = Math.min(100, Math.round((solvedCount / targetMeta) * 100));

                      // Última data de estudo
                      const lastProblem = [...topicProblems].sort((a, b) =>
                        b.dataResolucao.localeCompare(a.dataResolucao)
                      )[0];

                      return (
                        <div
                          key={topic.id}
                          onClick={() => navigate(`/assuntos/${topic.id}`)}
                          className="group p-4 rounded-xl border border-slate-200/70 hover:border-brand-500/40 hover:shadow-sm bg-white transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              <h3 className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
                                <span>{topic.nome}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 transition-transform group-hover:translate-x-0.5" />
                              </h3>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {topic.nivelDominio || 'Intermediário'}
                              </span>
                            </div>

                            {topic.descricao && (
                              <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                                {topic.descricao}
                              </p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <strong>{solvedCount}</strong> resolvidos
                              </span>
                              {starsCount > 0 && (
                                <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  {starsCount}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress and Last Study */}
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                              <span>Meta: {solvedCount}/{targetMeta}</span>
                              <span className="font-bold text-slate-700">{progressPct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${progressPct}%`,
                                  backgroundColor: area.cor,
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {lastProblem ? formatDatePtBR(lastProblem.dataResolucao) : 'Sem estudo'}
                              </span>
                              <span className="text-brand-600 font-semibold group-hover:underline flex items-center">
                                Detalhes <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AddAreaModal isOpen={isAddAreaOpen} onClose={() => setIsAddAreaOpen(false)} />
      <AddTopicModal
        isOpen={isAddTopicOpen}
        onClose={() => setIsAddTopicOpen(false)}
        defaultAreaId={selectedAreaForNewTopic}
      />
    </div>
  );
};
