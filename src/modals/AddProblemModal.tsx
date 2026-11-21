import React, { useState, useEffect } from 'react';
import { X, Star, Link2, Sparkles, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Problem, ProblemStatus } from '../types';
import { sanitizeUrl, getTodayISO } from '../utils/helpers';

export const AddProblemModal: React.FC = () => {
  const {
    isAddProblemOpen,
    closeAddProblem,
    selectedTopicForNewProblem,
    areas,
    topics,
    addProblem,
  } = useApp();

  const [nome, setNome] = useState('');
  const [url, setUrl] = useState('');
  const [plataforma, setPlataforma] = useState<Problem['plataforma']>('CSES');
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [dificuldade, setDificuldade] = useState('Médio');
  const [dataResolucao, setDataResolucao] = useState(getTodayISO);
  const [status, setStatus] = useState<ProblemStatus>('Resolvido');
  const [observacoes, setObservacoes] = useState('');
  
  // Problema Estrela
  const [isStar, setIsStar] = useState(false);
  const [conceitoPrincipal, setConceitoPrincipal] = useState('');
  const [motivoEstrela, setMotivoEstrela] = useState('');

  // Ao abrir o modal, preencher ou resetar campos
  useEffect(() => {
    if (isAddProblemOpen) {
      if (selectedTopicForNewProblem) {
        const topic = topics.find((t) => t.id === selectedTopicForNewProblem);
        if (topic) {
          setSelectedAreaId(topic.areaId);
          setSelectedTopicId(topic.id);
        }
      } else if (areas.length > 0) {
        setSelectedAreaId(areas[0].id);
        const firstTopic = topics.find((t) => t.areaId === areas[0].id);
        setSelectedTopicId(firstTopic ? firstTopic.id : '');
      }
      setNome('');
      setUrl('');
      setDataResolucao(getTodayISO());
      setObservacoes('');
      setIsStar(false);
      setConceitoPrincipal('');
      setMotivoEstrela('');
    }
  }, [isAddProblemOpen, selectedTopicForNewProblem, areas, topics]);

  // Se trocar de área, seleciona o primeiro tópico dessa área
  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    const firstTopic = topics.find((t) => t.areaId === areaId);
    setSelectedTopicId(firstTopic ? firstTopic.id : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !selectedTopicId) return;

    const safeUrl = sanitizeUrl(url);
    addProblem({
      nome: nome.trim(),
      url: safeUrl !== '#' ? safeUrl : 'https://cses.fi/problemset',
      plataforma,
      topicId: selectedTopicId,
      dificuldade,
      dataResolucao,
      status,
      observacoes: observacoes.trim(),
      isStar,
      conceitoPrincipal: isStar ? conceitoPrincipal.trim() : undefined,
      motivoEstrela: isStar ? motivoEstrela.trim() : undefined,
    });

    closeAddProblem();
  };

  if (!isAddProblemOpen) return null;

  const currentAreaTopics = topics.filter((t) => t.areaId === selectedAreaId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Adicionar Problema
              </h2>
              <p className="text-xs text-slate-400">
                Cadastre um exercício resolvido de forma rápida
              </p>
            </div>
          </div>
          <button
            onClick={closeAddProblem}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do problema <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Range Sum Queries II ou 1593B"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Link e Plataforma em 2 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plataforma
              </label>
              <select
                value={plataforma}
                onChange={(e) => setPlataforma(e.target.value as Problem['plataforma'])}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              >
                <option value="CSES">CSES</option>
                <option value="Codeforces">Codeforces</option>
                <option value="AtCoder">AtCoder</option>
                <option value="Beecrowd">Beecrowd</option>
                <option value="CodeChef">CodeChef</option>
                <option value="LeetCode">LeetCode</option>
                <option value="Outra">Outra</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link do problema
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
                />
                <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Área e Tópico em 2 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Área de conhecimento <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedAreaId}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tópico relacionado <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                required
              >
                {currentAreaTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
                {currentAreaTopics.length === 0 && (
                  <option value="">Nenhum tópico nesta área</option>
                )}
              </select>
            </div>
          </div>

          {/* Dificuldade, Data e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dificuldade
              </label>
              <input
                type="text"
                placeholder="Ex: Fácil, 1400"
                value={dificuldade}
                onChange={(e) => setDificuldade(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data resolução
              </label>
              <input
                type="date"
                value={dataResolucao}
                onChange={(e) => setDataResolucao(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProblemStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              >
                <option value="Resolvido">Resolvido</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Revisar">Revisar</option>
              </select>
            </div>
          </div>

          {/* Checkbox Problema Estrela */}
          <div className="pt-2">
            <div
              onClick={() => setIsStar(!isStar)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isStar
                  ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isStar ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    Marcar como Problema Estrela
                    {isStar && <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 rounded text-amber-800">Especial</span>}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Exercício clássico e educativo para revisitar e fixar o conceito
                  </div>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  isStar
                    ? 'bg-amber-500 border-amber-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isStar && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Campos extras do Problema Estrela */}
            {isStar && (
              <div className="mt-3 p-3.5 rounded-xl bg-amber-50/40 border border-amber-100 space-y-3 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Conceito principal ensinado
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: BFS em matriz para menor caminho com reconstrução"
                    value={conceitoPrincipal}
                    onChange={(e) => setConceitoPrincipal(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Por que esse problema é importante?
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Ensina a estrutura base de filas e vetor de visitados"
                    value={motivoEstrela}
                    onChange={(e) => setMotivoEstrela(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações / Dicas de resolução
            </label>
            <textarea
              rows={2}
              placeholder="Anotações rápidas sobre complexidade, edge cases ou truques..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeAddProblem}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs shadow-brand-500/30 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Salvar Problema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
