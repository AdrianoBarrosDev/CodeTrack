import React, { useState } from 'react';
import {
  User as UserIcon,
  Bell,
  Download,
  RotateCcw,
  Shield,
  Save,
  CheckCircle2,
  Clock,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Settings: React.FC = () => {
  const { user, updateUser, resetToMockData, problems, areas, topics, reviews, showToast, theme, setTheme } = useApp();

  const [nome, setNome] = useState(user.nome);
  const [email, setEmail] = useState(user.email);
  const [cargo, setCargo] = useState(user.cargo);
  const [metaGlobal, setMetaGlobal] = useState(user.metaGlobal);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      nome,
      email,
      cargo,
      metaGlobal: Number(metaGlobal) || 200,
    });
  };

  const handleExportData = () => {
    const exportObject = {
      user,
      areas,
      topics,
      problems,
      reviews,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `codetrack_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Backup JSON exportado com sucesso!');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Configurações
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Gerencie seu perfil de estudante, metas de resolução e preferências da plataforma.
        </p>
      </div>

      {/* Perfil */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <UserIcon className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-bold text-slate-900">Perfil do Estudante</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título / Cargo
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meta global de problemas
              </label>
              <input
                type="number"
                min={10}
                max={5000}
                value={metaGlobal}
                onChange={(e) => setMetaGlobal(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" /> Salvar alterações
            </button>
          </div>
        </form>
      </div>

      {/* Aparência & Tema */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sun className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">Aparência da Plataforma</h2>
        </div>

        <p className="text-xs text-slate-500">
          Escolha entre o tema claro para ambientes iluminados ou o tema escuro com fundo preto/cinza carvão para sessões noturnas de código.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Opção Modo Claro */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
              theme === 'light'
                ? 'border-brand-600 bg-brand-50/40 shadow-xs ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${theme === 'light' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900">Modo Claro</h3>
                {theme === 'light' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-brand-600 text-white rounded">
                    Ativo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Fundo suave claro, bordas slate clássicas e alto contraste diurno.
              </p>
            </div>
          </button>

          {/* Opção Modo Escuro */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
              theme === 'dark'
                ? 'border-brand-500 bg-brand-500/10 shadow-xs ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900">Modo Escuro</h3>
                {theme === 'dark' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-600 text-white rounded">
                    Ativo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Fundo preto/cinza carvão profundo com descanso visual e cores otimizadas.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Regra de Revisão */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Clock className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">Parâmetros de Estudo e Revisão</h2>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900">Janela Máxima de Revisão: 2 Meses (60 Dias)</h4>
            <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
              O sistema calcula e restringe o agendamento de Problemas Estrela para até 2 meses. Isso assegura que estruturas e algoritmos clássicos permaneçam na memória ativa do competidor antes de serem esquecidos.
            </p>
          </div>
        </div>
      </div>

      {/* Dados e Backup */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-slate-600" />
          <h2 className="text-base font-bold text-slate-900">Gerenciamento de Dados</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Exportar dados completos</h3>
              <p className="text-xs text-slate-400 mt-1">
                Baixe um arquivo JSON com todos os seus 128 problemas, tópicos e histórico de revisões.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="mt-4 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Exportar Backup JSON
            </button>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-rose-900">Restaurar demonstração original</h3>
              <p className="text-xs text-rose-700/80 mt-1">
                Restaura todos os 128 problemas, áreas e configurações padrão de demonstração.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Deseja realmente restaurar os dados de demonstração originais?')) {
                  resetToMockData();
                }
              }}
              className="mt-4 px-3.5 py-2 rounded-xl bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Restaurar Mock Inicial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
