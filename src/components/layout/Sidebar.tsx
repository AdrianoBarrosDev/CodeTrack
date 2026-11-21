import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CheckCircle2,
  Star,
  RotateCw,
  BarChart2,
  Settings,
  Code2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const Sidebar: React.FC = () => {
  const { user, problems } = useApp();
  const starCount = problems.filter((p) => p.isStar).length;

  const navItems = [
    { name: 'Visão geral', path: '/', icon: LayoutDashboard },
    { name: 'Meus assuntos', path: '/assuntos', icon: BookOpen },
    { name: 'Problemas resolvidos', path: '/problemas', icon: CheckCircle2 },
    { 
      name: 'Problemas Estrela', 
      path: '/estrelas', 
      icon: Star, 
      badge: starCount > 0 ? starCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' 
    },
    { name: 'Revisões', path: '/revisoes', icon: RotateCw },
    { name: 'Estatísticas', path: '/estatisticas', icon: BarChart2 },
    { name: 'Configurações', path: '/configuracoes', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-20">
      <div className="flex flex-col">
        {/* Logo Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
            <Code2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center">
            Code<span className="text-brand-600">Track</span>
          </span>
        </div>

        {/* Navigation Category Label */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Seu espaço de estudos
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-brand-600 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold border ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Motivational Card & User Profile */}
      <div className="p-4 space-y-4">
        {/* Motivational Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-100/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consistência é a chave</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Não é sobre resolver tudo hoje. É sobre continuar amanhã.
          </p>
          <div className="flex items-center gap-1 mt-2.5">
            <span className="w-8 h-1.5 rounded-full bg-brand-600"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-200"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-200"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-200"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-200"></span>
          </div>
        </div>

        {/* User Profile */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs border border-brand-200">
              {user.nome
                ? user.nome
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : 'JD'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 leading-none">
                {user.nome}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 leading-none">
                {user.cargo}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>
      </div>
    </aside>
  );
};
