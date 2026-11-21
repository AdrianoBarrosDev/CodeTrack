import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, ExternalLink } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatDatePtBR } from '../../utils/helpers';

export const RecentActivityTable: React.FC = () => {
  const { problems, topics, toggleStar } = useApp();

  // Pegar os 5 problemas mais recentes
  const recentProblems = problems
    .filter((p) => p.status === 'Resolvido')
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Atividade recente</h3>
            <p className="text-xs text-slate-400 mt-0.5">Seus últimos desafios superados.</p>
          </div>
          <Link
            to="/problemas"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-2.5 font-medium">Problema</th>
                <th className="pb-2.5 font-medium">Assunto</th>
                <th className="pb-2.5 font-medium">Status</th>
                <th className="pb-2.5 font-medium">Data</th>
                <th className="pb-2.5 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentProblems.map((problem) => {
                const topic = topics.find((t) => t.id === problem.topicId);

                return (
                  <tr key={problem.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 pr-3">
                      <div className="flex flex-col">
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-slate-800 hover:text-brand-600 flex items-center gap-1 transition-colors"
                        >
                          {problem.nome}
                          <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                          <span>{problem.plataforma}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium bg-brand-50/70 text-brand-700 border border-brand-100/50">
                        {topic ? topic.nome : 'Geral'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ✓ {problem.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-400 font-medium">
                      {formatDatePtBR(problem.dataResolucao)}
                    </td>

                    <td className="py-3 pl-3 text-right">
                      <button
                        onClick={() => toggleStar(problem.id)}
                        title={problem.isStar ? 'Remover estrela' : 'Marcar como Problema Estrela'}
                        className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 transition-colors ${
                            problem.isStar
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-slate-300 hover:text-slate-400'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
