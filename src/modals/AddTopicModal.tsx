import React, { useState } from 'react';
import { X, BookPlus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAreaId?: string;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({ isOpen, onClose, defaultAreaId }) => {
  const { addTopic, areas } = useApp();
  const [nome, setNome] = useState('');
  const [areaId, setAreaId] = useState(defaultAreaId || (areas[0]?.id ?? ''));
  const [descricao, setDescricao] = useState('');
  const [metaProblemas, setMetaProblemas] = useState(10);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !areaId) return;

    addTopic({
      userId: 'usr_1',
      areaId,
      nome: nome.trim(),
      descricao: descricao.trim(),
      metaProblemas: Number(metaProblemas) || 10,
      nivelDominio: 'Iniciante',
    });

    setNome('');
    setDescricao('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <BookPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Novo Tópico de Estudo</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do tópico *</label>
            <input
              type="text"
              required
              placeholder="Ex: Treap, Mo's Algorithm, Heavy-Light Decomposition"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pertence à Área *</label>
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Meta de problemas para o tópico</label>
            <input
              type="number"
              min={1}
              max={100}
              value={metaProblemas}
              onChange={(e) => setMetaProblemas(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição / Objetivos de estudo</label>
            <textarea
              rows={2}
              placeholder="O que você planeja dominar neste tópico..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
            >
              Criar Tópico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
