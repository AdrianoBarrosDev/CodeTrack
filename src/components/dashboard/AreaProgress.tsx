import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, GitFork, CodeXml, Sigma, Binary, Shapes, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const AreaProgress: React.FC = () => {
  const { areas, topics, problems } = useApp();

  const getAreaIcon = (iconeName: string, color: string) => {
    const props = { className: 'w-4 h-4', style: { color } };
    switch (iconeName) {
      case 'Layers': return <Layers {...props} />;
      case 'GitFork': return <GitFork {...props} />;
      case 'CodeXml': return <CodeXml {...props} />;
      case 'Sigma': return <Sigma {...props} />;
      case 'Binary': return <Binary {...props} />;
      case 'Shapes': return <Shapes {...props} />;
      default: return <Layers {...props} />;
    }
  };

  // Metas de referência por área para calcular o percentual do mockup
  const areaTargetMeta: Record<string, number> = {
    area_ed: 50,
    area_grafos: 40,
    area_dp: 40,
    area_math: 30,
    area_strings: 25,
    area_geo: 20,
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-base font-bold text-slate-900">Progresso por área</h3>
            <p className="text-xs text-slate-400 mt-0.5">Seu conhecimento ganhando forma.</p>
          </div>
          <Link
            to="/assuntos"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
          >
            Ver assuntos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {areas.map((area) => {
            // Achar todos os tópicos dessa área
            const areaTopicIds = topics.filter((t) => t.areaId === area.id).map((t) => t.id);
            // Contar quantos problemas resolvidos estão nessa área
            const solvedCount = problems.filter(
              (p) => areaTopicIds.includes(p.topicId) && p.status === 'Resolvido'
            ).length;

            const target = areaTargetMeta[area.id] || 40;
            const percentage = Math.min(100, Math.round((solvedCount / target) * 100));

            return (
              <div key={area.id} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${area.cor}15` }}
                    >
                      {getAreaIcon(area.icone, area.cor)}
                    </div>
                    <span className="font-semibold text-slate-800">{area.nome}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px] font-medium">
                      {solvedCount} problemas
                    </span>
                    <span className="font-bold text-slate-700 w-8 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: area.cor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
