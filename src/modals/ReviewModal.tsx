import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, CheckCircle, RotateCw, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ReviewResult } from '../types';
import { addDaysToDate, calculateMaxReviewDate, getTodayISO } from '../utils/helpers';

export const ReviewModal: React.FC = () => {
  const { reviewModalProblem, closeReviewModal, recordReview, showToast } = useApp();

  const [dataRevisao, setDataRevisao] = useState(getTodayISO);
  const [resultado, setResultado] = useState<ReviewResult>('Lembrei completamente');
  const [observacoes, setObservacoes] = useState('');
  const [proximaRevisao, setProximaRevisao] = useState('');

  const maxAllowedDate = calculateMaxReviewDate(dataRevisao);

  useEffect(() => {
    if (reviewModalProblem) {
      const today = getTodayISO();
      setDataRevisao(today);
      setResultado('Lembrei completamente');
      setObservacoes('');
      // Sugere por padrão 30 dias (1 mês) para a próxima revisão
      setProximaRevisao(addDaysToDate(today, 30));
    }
  }, [reviewModalProblem]);

  if (!reviewModalProblem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de limite de 2 meses
    if (proximaRevisao && proximaRevisao > maxAllowedDate) {
      showToast('A próxima revisão deve ocorrer em no máximo 2 meses!', 'error');
      return;
    }

    recordReview({
      problemId: reviewModalProblem.id,
      userId: reviewModalProblem.userId,
      dataRevisao,
      resultado,
      observacoes: observacoes.trim(),
      proximaRevisao: proximaRevisao || undefined,
    });

    closeReviewModal();
  };

  const setQuickInterval = (days: number) => {
    setProximaRevisao(addDaysToDate(dataRevisao, days));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <RotateCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Registrar Revisão
              </h2>
              <p className="text-xs text-slate-400">
                Acompanhe a retenção dos Problemas Estrela
              </p>
            </div>
          </div>
          <button
            onClick={closeReviewModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Card Resumo do Problema */}
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/80">
            <div className="flex items-start gap-2.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {reviewModalProblem.nome}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Plataforma: {reviewModalProblem.plataforma} · Dificuldade: {reviewModalProblem.dificuldade || 'N/A'}
                </p>
                {reviewModalProblem.conceitoPrincipal && (
                  <p className="text-xs text-amber-900 mt-2 bg-amber-100/60 p-2 rounded-lg font-medium">
                    💡 Conceito: {reviewModalProblem.conceitoPrincipal}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Data da revisão */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Data da revisão
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={dataRevisao}
                onChange={(e) => setDataRevisao(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Resultado da revisão */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Como foi sua resolução? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: 'Lembrei completamente', color: 'emerald', desc: 'Implementação rápida e sem consultas' },
                { label: 'Lembrei parcialmente', color: 'blue', desc: 'Pequenas dúvidas em detalhes' },
                { label: 'Precisei estudar novamente', color: 'amber', desc: 'Revi os conceitos antes de codar' },
                { label: 'Não consegui resolver', color: 'rose', desc: 'Dificuldade alta, precisa de atenção' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setResultado(opt.label as ReviewResult)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    resultado === opt.label
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900 ring-2 ring-brand-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {resultado === opt.label && <CheckCircle className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Observações da revisão */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notas da revisão
            </label>
            <textarea
              rows={2}
              placeholder="O que você sentiu facilidade ou dificuldade nesta revisão?"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Agendamento da Próxima Revisão (Regra: até 2 meses) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span>Próxima revisão</span>
              </div>
              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Máximo 2 meses
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setQuickInterval(7)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-colors"
              >
                + 1 semana
              </button>
              <button
                type="button"
                onClick={() => setQuickInterval(14)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-colors"
              >
                + 2 semanas
              </button>
              <button
                type="button"
                onClick={() => setQuickInterval(30)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-colors"
              >
                + 1 mês
              </button>
              <button
                type="button"
                onClick={() => setQuickInterval(60)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 font-semibold text-brand-700 transition-colors"
              >
                + 2 meses (limite)
              </button>
            </div>

            <input
              type="date"
              max={maxAllowedDate}
              value={proximaRevisao}
              onChange={(e) => setProximaRevisao(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Limite máximo de agendamento: {maxAllowedDate}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeReviewModal}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs shadow-brand-500/30 flex items-center gap-1.5 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Confirmar Revisão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
