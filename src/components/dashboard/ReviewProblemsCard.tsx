import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getReviewStatus } from '../../utils/helpers';

export const ReviewProblemsCard: React.FC = () => {
  const { problems, topics, openReviewModal } = useApp();

  // Pegar os problemas estrela
  const starProblems = useMemo(() => {
    return problems.filter((p) => p.isStar);
  }, [problems]);

  // Ordena por status: pendentes primeiro, depois hoje, depois nunca revisados, depois em breve
  const { sortedReviewProblems, pendingCount } = useMemo(() => {
    const priorityWeight: Record<string, number> = {
      pendente: 1,
      hoje: 2,
      nunca: 3,
      em_breve: 4,
      em_dia: 5,
    };

    const list = [...starProblems].sort((a, b) => {
      const statusA = getReviewStatus(a);
      const statusB = getReviewStatus(b);
      const weightA = priorityWeight[statusA.type] || 99;
      const weightB = priorityWeight[statusB.type] || 99;
      if (weightA !== weightB) return weightA - weightB;
      return (a.proximaRevisao || '').localeCompare(b.proximaRevisao || '');
    });

    const pending = starProblems.filter((p) => {
      const st = getReviewStatus(p);
      return st.type === 'pendente' || st.type === 'hoje' || st.type === 'nunca';
    }).length;

    return { sortedReviewProblems: list.slice(0, 3), pendingCount: pending };
  }, [starProblems]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Problemas para revisar</h3>
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Reforce o que realmente importa.</p>
            </div>
          </div>
          <Link
            to="/revisoes"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* List */}
        <div className="space-y-3">
          {sortedReviewProblems.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              Nenhum problema estrela cadastrado para revisão.
            </div>
          ) : (
            sortedReviewProblems.map((problem) => {
              const topic = topics.find((t) => t.id === problem.topicId);
              const statusInfo = getReviewStatus(problem);

              return (
                <div
                  key={problem.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{problem.nome}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {topic?.nome} · {problem.plataforma}
                      </p>
                      <div className="mt-1.5">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusInfo.colorClass}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openReviewModal(problem)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-200 transition-all flex items-center gap-1 shrink-0"
                  >
                    Revisar <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
