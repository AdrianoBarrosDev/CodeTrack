import React, { useState } from 'react';
import {
  RotateCw,
  Star,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  History,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDatePtBR, getReviewStatus, sanitizeUrl, getTodayISO } from '../utils/helpers';
import { Problem } from '../types';

export const Reviews: React.FC = () => {
  const { problems, topics, reviews, openReviewModal } = useApp();
  const [activeSection, setActiveSection] = useState<'agora' | 'breve' | 'recentes' | 'historico'>('agora');

  const starProblems = problems.filter((p) => p.isStar);
  const todayStr = getTodayISO();

  // 1. Revisar agora (atrasados ou hoje)
  const reviewNow = starProblems.filter((p) => {
    if (!p.proximaRevisao && !p.dataUltimaRevisao) return true; // Nunca revisado conta como prioridade
    return p.proximaRevisao && p.proximaRevisao <= todayStr;
  });

  // 2. Revisar em breve (próximos dias dentro de 2 meses)
  const reviewSoon = starProblems.filter((p) => {
    return p.proximaRevisao && p.proximaRevisao > todayStr;
  }).sort((a, b) => (a.proximaRevisao || '').localeCompare(b.proximaRevisao || ''));

  // 3. Revisados recentemente
  const recentlyReviewed = starProblems.filter((p) => p.dataUltimaRevisao).sort((a, b) =>
    (b.dataUltimaRevisao || '').localeCompare(a.dataUltimaRevisao || '')
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-brand-600 flex items-center justify-center">
              <RotateCw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sistema de Revisão Espaçada
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Revisite Problemas Estrela com intervalo máximo de até 2 meses para consolidar o raciocínio algorítmico.
          </p>
        </div>

        {/* Metodologia 2 Meses Badge */}
        <div className="bg-amber-50 border border-amber-200/80 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Janela de retenção: até 2 meses</span>
        </div>
      </div>

      {/* Tabs / Filter Groups */}
      <div className="border-b border-slate-200">
        <div className="flex gap-4 sm:gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveSection('agora')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'agora'
                ? 'text-rose-600 border-b-2 border-rose-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Revisar agora ({reviewNow.length})
          </button>

          <button
            onClick={() => setActiveSection('breve')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'breve'
                ? 'text-brand-600 border-b-2 border-brand-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-brand-600" />
            Revisar em breve ({reviewSoon.length})
          </button>

          <button
            onClick={() => setActiveSection('recentes')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'recentes'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Revisados recentemente ({recentlyReviewed.length})
          </button>

          <button
            onClick={() => setActiveSection('historico')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'historico'
                ? 'text-slate-800 border-b-2 border-slate-800'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            Histórico ({reviews.length})
          </button>
        </div>
      </div>

      {/* 1. Revisar Agora */}
      {activeSection === 'agora' && (
        <div className="space-y-4">
          {reviewNow.length === 0 ? (
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-emerald-900">Parabéns! Todas as revisões prioritárias estão em dia.</h3>
              <p className="text-xs text-emerald-700/80 mt-1">
                Continue praticando novos tópicos ou confira os exercícios para revisar em breve.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewNow.map((problem) => {
                const topic = topics.find((t) => t.id === problem.topicId);
                const statusInfo = getReviewStatus(problem);

                return (
                  <div
                    key={problem.id}
                    className="bg-white rounded-2xl border-2 border-rose-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{problem.nome}</h3>
                            <span className="text-[11px] text-slate-400">
                              {topic?.nome} · {problem.plataforma}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.colorClass}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {problem.conceitoPrincipal && (
                        <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <strong>Conceito:</strong> {problem.conceitoPrincipal}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {problem.qtdRevisoes ? `${problem.qtdRevisoes} revisões anteriores` : 'Primeira revisão'}
                      </span>
                      <button
                        onClick={() => openReviewModal(problem)}
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <RotateCw className="w-3.5 h-3.5" /> Revisar Agora
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Revisar em Breve */}
      {activeSection === 'breve' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewSoon.map((problem) => {
              const topic = topics.find((t) => t.id === problem.topicId);
              return (
                <div
                  key={problem.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{problem.nome}</h4>
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {topic?.nome} · {problem.plataforma}
                    </p>
                    <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      Revisar até {formatDatePtBR(problem.proximaRevisao || '')}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={sanitizeUrl(problem.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1 font-medium"
                    >
                      Enunciado <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => openReviewModal(problem)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      Antecipar revisão →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Revisados Recentemente */}
      {activeSection === 'recentes' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4 font-semibold">Problema</th>
                  <th className="py-3 px-4 font-semibold">Tópico</th>
                  <th className="py-3 px-4 font-semibold">Data da Última Revisão</th>
                  <th className="py-3 px-4 font-semibold">Total de Revisões</th>
                  <th className="py-3 px-4 font-semibold">Próxima Revisão</th>
                  <th className="py-3 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentlyReviewed.map((p) => {
                  const topic = topics.find((t) => t.id === p.topicId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                        {p.nome}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{topic?.nome}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {p.dataUltimaRevisao ? formatDatePtBR(p.dataUltimaRevisao) : '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{p.qtdRevisoes}x</td>
                      <td className="py-3 px-4 text-slate-500">
                        {p.proximaRevisao ? formatDatePtBR(p.proximaRevisao) : 'Não agendado'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openReviewModal(p)}
                          className="px-2.5 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          Revisar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Histórico Completo */}
      {activeSection === 'historico' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Linha do Tempo de Revisões</h3>
            <p className="text-xs text-slate-400">Histórico de retenção e compreensão dos exercícios.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {reviews.map((rev) => {
              const problem = problems.find((p) => p.id === rev.problemId);
              return (
                <div key={rev.id} className="p-4 hover:bg-slate-50/50 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{problem?.nome}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-brand-700 border border-indigo-100">
                        {rev.resultado}
                      </span>
                    </div>
                    {rev.observacoes && (
                      <p className="text-xs text-slate-600 mt-1 italic">&quot;{rev.observacoes}&quot;</p>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    {formatDatePtBR(rev.dataRevisao)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
