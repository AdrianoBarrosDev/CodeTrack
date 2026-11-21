import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const StudyHeatmap: React.FC = () => {
  const { activityData, problems } = useApp();

  // Mapear contagens consolidadas de problemas por data (YYYY-MM-DD)
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();

    // Carrega dados de activityData existente
    activityData.forEach((d) => {
      map.set(d.date, d.count);
    });

    // Sobrepõe e consolida com problemas reais cadastrados
    problems
      .filter((p) => p.status === 'Resolvido' && p.dataResolucao)
      .forEach((p) => {
        const current = map.get(p.dataResolucao) || 0;
        // Prioriza a contagem real dos problemas cadastrados
        map.set(p.dataResolucao, Math.max(current, (problems.filter(prob => prob.status === 'Resolvido' && prob.dataResolucao === p.dataResolucao).length)));
      });

    return map;
  }, [activityData, problems]);

  // Identificar anos disponíveis e o limite máximo (ano/mês corrente)
  const { maxYear, maxMonth, availableYears } = useMemo(() => {
    const now = new Date();
    let maxY = now.getFullYear();
    let maxM = now.getMonth() + 1;

    const yearsSet = new Set<number>();
    yearsSet.add(maxY);

    activityMap.forEach((_, dateStr) => {
      const [yStr, mStr] = dateStr.split('-');
      const y = parseInt(yStr, 10);
      const m = parseInt(mStr, 10);
      if (!isNaN(y)) {
        yearsSet.add(y);
        if (y > maxY || (y === maxY && m > maxM)) {
          maxY = y;
          maxM = m;
        }
      }
    });

    const yearsList = Array.from(yearsSet).filter(y => y <= maxY).sort((a, b) => b - a);
    return { maxYear: maxY, maxMonth: maxM, availableYears: yearsList };
  }, [activityMap]);

  // Ano e Mês mais recentes para valor padrão (limitado ao mês atual)
  const defaultYear = availableYears[0] || maxYear;
  const defaultMonth = useMemo(() => {
    const datesInYear = Array.from(activityMap.keys())
      .filter((d) => d.startsWith(`${defaultYear}-`))
      .sort();
    if (datesInYear.length > 0) {
      const latest = datesInYear[datesInYear.length - 1];
      const m = parseInt(latest.split('-')[1], 10);
      return Math.min(m, maxMonth);
    }
    return maxMonth;
  }, [activityMap, defaultYear, maxMonth]);

  // Estados de Visualização e Filtros (Padrão: Visão 'mes')
  const [viewMode, setViewMode] = useState<'mes' | 'ano'>('mes');
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth); // 1 a 12

  // Bloqueio de avanço para meses futuros além do mês corrente deste ano
  const isAtMaxMonth = selectedYear >= maxYear && selectedMonth >= maxMonth;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const monthShortNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  // Função para retornar a cor em escala de VERDE (quanto mais problemas, mais forte o verde)
  const getCellColor = (count: number) => {
    if (count === 0) {
      return 'bg-slate-100 hover:bg-slate-200 border border-slate-200/50 dark:bg-[#252525] dark:hover:bg-[#323232] dark:border-[#303030]';
    }
    if (count === 1) {
      return 'bg-[#bbf7d0] hover:bg-[#86efac] dark:bg-[#0e4429] dark:hover:bg-[#14532d] dark:border-[#196c41]';
    }
    if (count === 2) {
      return 'bg-[#86efac] hover:bg-[#4ade80] dark:bg-[#006d32] dark:hover:bg-[#15803d] dark:border-[#26a641]';
    }
    if (count === 3) {
      return 'bg-[#22c55e] hover:bg-[#16a34a] text-white dark:bg-[#26a641] dark:hover:bg-[#2ecc71] dark:border-[#39d353]';
    }
    // 4 ou mais problemas: verde intenso / esmeralda de pico
    return 'bg-[#15803d] hover:bg-[#14532d] text-white dark:bg-[#39d353] dark:hover:bg-[#4ade80] dark:border-[#4ade80] shadow-2xs';
  };

  // Navegar meses na visão 'mes'
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (isAtMaxMonth) return;
    if (selectedMonth === 12) {
      if (selectedYear + 1 <= maxYear) {
        setSelectedMonth(1);
        setSelectedYear((y) => y + 1);
      }
    } else {
      if (selectedYear < maxYear || selectedMonth + 1 <= maxMonth) {
        setSelectedMonth((m) => m + 1);
      }
    }
  };

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    if (newYear >= maxYear && selectedMonth > maxMonth) {
      setSelectedMonth(maxMonth);
    }
  };

  // --------------------------------------------------------------------------
  // CÁLCULO PARA A VISÃO MENSAL (Grade de Calendário com dias da semana)
  // --------------------------------------------------------------------------
  const monthCalendarData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfWeek = new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 0 = Dom, 1 = Seg...
    // Ajustar para semana começando na Segunda-feira (0 = Seg ... 6 = Dom)
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    let solvedInMonth = 0;
    let activeDaysInMonth = 0;
    let bestDayCount = 0;

    const days: { dayNum: number; dateStr: string; count: number }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(selectedMonth).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${selectedYear}-${monthStr}-${dayStr}`;
      const count = activityMap.get(dateStr) || 0;

      if (count > 0) {
        activeDaysInMonth++;
        solvedInMonth += count;
        if (count > bestDayCount) bestDayCount = count;
      }

      days.push({ dayNum: day, dateStr, count });
    }

    return {
      startOffset,
      days,
      solvedInMonth,
      activeDaysInMonth,
      bestDayCount,
    };
  }, [selectedYear, selectedMonth, activityMap]);

  // --------------------------------------------------------------------------
  // CÁLCULO PARA A VISÃO ANUAL (Grade de 52 semanas clássica estilo GitHub)
  // --------------------------------------------------------------------------
  const yearCalendarData = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    // Ajustar início para a Segunda-feira da primeira semana
    const startDay = startDate.getDay();
    const startDiff = startDay === 0 ? -6 : 1 - startDay;
    const current = new Date(startDate);
    current.setDate(current.getDate() + startDiff);

    const weeks: { date: string; count: number; inYear: boolean }[][] = [];
    let currentWeek: { date: string; count: number; inYear: boolean }[] = [];

    let solvedInYear = 0;
    let activeDaysInYear = 0;

    while (current <= endDate || currentWeek.length > 0) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      const inYear = y === selectedYear;
      const count = inYear ? activityMap.get(dateStr) || 0 : 0;

      if (inYear && count > 0) {
        activeDaysInYear++;
        solvedInYear += count;
      }

      currentWeek.push({ date: dateStr, count, inYear });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
        if (current > endDate) break;
      }

      current.setDate(current.getDate() + 1);
    }

    return { weeks, solvedInYear, activeDaysInYear };
  }, [selectedYear, activityMap]);

  // Total acumulado em toda a jornada
  const totalSolvedGlobal = useMemo(() => {
    let sum = 0;
    activityMap.forEach((c) => {
      sum += c;
    });
    const fromProblems = problems.filter((p) => p.status === 'Resolvido').length;
    return Math.max(sum, fromProblems);
  }, [activityMap, problems]);

  const weekDayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        {/* Top Header: Título, Toggle Mês/Ano e Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Seu mapa de estudos</h3>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
                <Flame className="w-3.5 h-3.5" />
                <span>
                  {viewMode === 'mes'
                    ? `${monthCalendarData.activeDaysInMonth} dias ativos no mês`
                    : `${yearCalendarData.activeDaysInYear} dias ativos no ano`}
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Consistência diária: quanto mais intenso o verde, mais desafios superados.
            </p>
          </div>

          {/* Controles: Visão (Mês/Ano) e Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Seletor de Ano */}
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none cursor-pointer"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            {/* Toggle Visão: Mês / Ano */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold text-slate-500">
              <button
                type="button"
                onClick={() => setViewMode('mes')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'mes'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'hover:text-slate-700'
                }`}
              >
                Mês
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ano')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'ano'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'hover:text-slate-700'
                }`}
              >
                Ano
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* RENDERIZAÇÃO DA VISÃO MÊS (Padrão) */}
        {/* ---------------------------------------------------------------- */}
        {viewMode === 'mes' && (
          <div className="space-y-4">
            {/* Barra de Navegação do Mês */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shrink-0"
                  title="Mês anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Bloco com largura fixa rigorosa: a seta da direita fica em ponto 100% fixo */}
                <div className="w-52 sm:w-60 text-center px-2 shrink-0 flex items-center justify-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {monthNames[selectedMonth - 1]} de {selectedYear}
                  </span>
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    ({monthCalendarData.solvedInMonth})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  disabled={isAtMaxMonth}
                  className={`p-1.5 rounded-lg border border-slate-200 transition-colors shrink-0 ${
                    isAtMaxMonth
                      ? 'opacity-25 cursor-not-allowed bg-slate-100/50 dark:bg-slate-800/20 text-slate-400'
                      : 'hover:bg-slate-50 text-slate-600 cursor-pointer'
                  }`}
                  title={isAtMaxMonth ? 'Limite do mês atual atingido' : 'Próximo mês'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Seletor rápido de Mês */}
              <div className="hidden sm:flex items-center gap-1 overflow-x-auto">
                {monthShortNames.map((mShort, idx) => {
                  const mNum = idx + 1;
                  const isCurrent = mNum === selectedMonth;
                  const isMonthDisabled = selectedYear >= maxYear && mNum > maxMonth;

                  return (
                    <button
                      key={mShort}
                      type="button"
                      disabled={isMonthDisabled}
                      onClick={() => !isMonthDisabled && setSelectedMonth(mNum)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        isMonthDisabled
                          ? 'opacity-25 cursor-not-allowed text-slate-400'
                          : isCurrent
                          ? 'bg-emerald-600 text-white shadow-2xs font-bold cursor-pointer'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer'
                      }`}
                      title={isMonthDisabled ? 'Mês futuro indisponível' : undefined}
                    >
                      {mShort}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grade Mensal de Calendário */}
            <div className="overflow-x-auto pb-1">
              <div className="min-w-[480px]">
                {/* Dias da Semana (Cabeçalho) */}
                <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {weekDayLabels.map((wd) => (
                    <div key={wd} className="py-1">
                      {wd}
                    </div>
                  ))}
                </div>

                {/* Grade de Dias */}
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Espaços em branco antes do dia 1 */}
                  {Array.from({ length: monthCalendarData.startOffset }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="h-10 sm:h-12 rounded-xl border border-transparent" />
                  ))}

                  {/* Dias do Mês */}
                  {monthCalendarData.days.map((day) => (
                    <div
                      key={day.dateStr}
                      title={`${day.dateStr}: ${day.count} problema${day.count !== 1 ? 's' : ''} resolvido${day.count !== 1 ? 's' : ''}`}
                      className={`h-10 sm:h-12 rounded-xl p-1.5 flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.03] select-none ${getCellColor(
                        day.count
                      )}`}
                    >
                      <span className="text-[11px] font-bold leading-none opacity-80">
                        {day.dayNum}
                      </span>
                      {day.count > 0 ? (
                        <span className="text-[10px] font-extrabold leading-none text-right">
                          {day.count}
                        </span>
                      ) : (
                        <span className="h-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* RENDERIZAÇÃO DA VISÃO ANUAL (Panorâmica estilo GitHub de 52 semanas) */}
        {/* ---------------------------------------------------------------- */}
        {viewMode === 'ano' && (
          <div className="space-y-4">
            {/* Header com meses do ano e resumo anual */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-slate-900">
                  Ano de {selectedYear}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({yearCalendarData.solvedInYear} problemas em {yearCalendarData.activeDaysInYear} dias ativos)
                </span>
              </div>

              {/* Botões rápidos para pular para o mês na visão 'mes' */}
              <div className="flex items-center gap-1 overflow-x-auto">
                <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Ver mês:</span>
                {monthShortNames.map((mShort, idx) => {
                  const mNum = idx + 1;
                  const isMonthDisabled = selectedYear >= maxYear && mNum > maxMonth;
                  return (
                    <button
                      key={mShort}
                      type="button"
                      disabled={isMonthDisabled}
                      onClick={() => {
                        if (!isMonthDisabled) {
                          setSelectedMonth(mNum);
                          setViewMode('mes');
                        }
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        isMonthDisabled
                          ? 'opacity-25 cursor-not-allowed text-slate-400'
                          : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer'
                      }`}
                      title={isMonthDisabled ? 'Mês futuro indisponível' : undefined}
                    >
                      {mShort}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grade Anual de 52 Semanas */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[760px]">
                {/* Rótulos de Meses no topo da régua */}
                <div className="flex justify-between text-[11px] font-medium text-slate-400 px-2 mb-2">
                  {monthShortNames.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>

                {/* Colunas de Semanas */}
                <div className="flex gap-1.5 justify-between">
                  {yearCalendarData.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5">
                      {week.map((day) => (
                        <div
                          key={day.date}
                          title={`${day.date}: ${day.count} problema${day.count !== 1 ? 's' : ''} resolvido${day.count !== 1 ? 's' : ''}`}
                          className={`w-3.5 h-3.5 rounded-xs transition-colors cursor-pointer ${
                            !day.inYear
                              ? 'opacity-0 pointer-events-none'
                              : getCellColor(day.count)
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer com Total Geral e Legenda de Cores Verde */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-4 border-t border-slate-100 mt-4">
        <span className="text-slate-500 font-medium">
          <strong className="text-slate-800">{totalSolvedGlobal} problemas</strong> resolvidos na sua jornada
        </span>

        {/* Legenda de Intensidade Verde: Menos -> Mais */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <span>Menos</span>
          {/* Nível 0: Vazio */}
          <span
            title="0 problemas"
            className="w-3.5 h-3.5 rounded-xs bg-slate-100 border border-slate-200/60 dark:bg-[#252525] dark:border-[#303030]"
          />
          {/* Nível 1: 1 problema */}
          <span
            title="1 problema"
            className="w-3.5 h-3.5 rounded-xs bg-[#bbf7d0] dark:bg-[#0e4429] dark:border-[#196c41]"
          />
          {/* Nível 2: 2 problemas */}
          <span
            title="2 problemas"
            className="w-3.5 h-3.5 rounded-xs bg-[#86efac] dark:bg-[#006d32] dark:border-[#26a641]"
          />
          {/* Nível 3: 3 problemas */}
          <span
            title="3 problemas"
            className="w-3.5 h-3.5 rounded-xs bg-[#22c55e] dark:bg-[#26a641] dark:border-[#39d353]"
          />
          {/* Nível 4+: 4 ou mais problemas */}
          <span
            title="4+ problemas"
            className="w-3.5 h-3.5 rounded-xs bg-[#15803d] dark:bg-[#39d353] dark:border-[#4ade80]"
          />
          <span>Mais</span>
        </div>
      </div>
    </div>
  );
};
