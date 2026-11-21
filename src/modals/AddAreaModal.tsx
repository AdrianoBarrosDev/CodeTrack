import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface AddAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAreaModal: React.FC<AddAreaModalProps> = ({ isOpen, onClose }) => {
  const { addArea, areas } = useApp();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState('#4F46E5');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    addArea({
      userId: 'usr_1',
      nome: nome.trim(),
      descricao: descricao.trim(),
      ordem: areas.length + 1,
      cor,
      icone: 'Folder',
    });

    setNome('');
    setDescricao('');
    onClose();
  };

  const presetColors = ['#4F46E5', '#059669', '#0284C7', '#D97706', '#E11D48', '#8B5CF6', '#0D9488'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Nova Área de Conhecimento</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da área *</label>
            <input
              type="text"
              required
              placeholder="Ex: Teoria dos Jogos ou Álgebra Linear"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
            <textarea
              rows={2}
              placeholder="Breve resumo dos conceitos desta área..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cor temática</label>
            <div className="flex items-center gap-2">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full transition-transform ${cor === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'}`}
                />
              ))}
            </div>
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
              Criar Área
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
