import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const location = useLocation();
  const { openSearch, user, theme, toggleTheme } = useApp();

  const getPageTitle = (path: string): string => {
    if (path === '/') return 'Visão geral';
    if (path.startsWith('/assuntos/')) return 'Detalhes do tópico';
    if (path === '/assuntos') return 'Meus assuntos';
    if (path === '/problemas') return 'Problemas resolvidos';
    if (path === '/estrelas') return 'Problemas Estrela';
    if (path === '/revisoes') return 'Revisões';
    if (path === '/estatisticas') return 'Estatísticas';
    if (path === '/configuracoes') return 'Configurações';
    return 'Visão geral';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-sm font-medium text-slate-500">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Botão de busca compacto (Ícone de lupa quando o menu vira sanduíche < lg) */}
        <button
          onClick={openSearch}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-colors lg:hidden flex items-center justify-center"
          aria-label="Buscar problemas e assuntos"
        >
          <Search className="w-4 h-4 text-slate-500" />
        </button>

        {/* Barra de busca expandida com atalho (Desktop quando a sidebar está visível >= lg) */}
        <button
          onClick={openSearch}
          className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs text-slate-400 hover:text-slate-600 transition-all w-60 sm:w-72 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Buscar problemas, assuntos...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘ K
          </kbd>
        </button>

        {/* Demo Mode Badge */}
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
          Demonstração
        </span>

        {/* Toggle Dark / Light Mode */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
          title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
          ) : (
            <Moon className="w-4 h-4 text-slate-500 stroke-[2.2]" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative"
          aria-label="Notificações"
          onClick={() => alert('Você está em dia com seus treinos!')}
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-600 absolute top-2 right-2 border-2 border-white"></span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 font-semibold text-xs flex items-center justify-center border border-brand-200">
          {user.nome.substring(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
