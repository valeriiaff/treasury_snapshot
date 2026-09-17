import React, { useState } from 'react';
import { CurrencySummary } from '../types';
import { formatCurrencyAmount } from '../utils/treasuryCalculations';
import { PieChart as PieIcon, ShieldAlert, Globe } from 'lucide-react';

interface DonutChartCardProps {
  currencySummaries: CurrencySummary[];
  baseCurrency: string;
  totalLiquidity: number;
}

export const DonutChartCard: React.FC<DonutChartCardProps> = ({
  currencySummaries,
  baseCurrency,
  totalLiquidity,
}) => {
  const [hoveredCurrency, setHoveredCurrency] = useState<string | null>(null);

  // SVG Donut calculation
  const size = 210;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;
  const slices = currencySummaries.map((item) => {
    const strokeDasharray = `${(item.percentageShare / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeAngle;
    cumulativeAngle += (item.percentageShare / 100) * circumference;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSummary = hoveredCurrency
    ? currencySummaries.find((s) => s.currency === hoveredCurrency)
    : null;

  const dominantCurrency = currencySummaries[0];
  const dominantPct = dominantCurrency ? dominantCurrency.percentageShare : 0;
  const nonDominantPct = Math.max(0, 100 - dominantPct);

  return (
    <div className="bg-[#16161a] border border-white/5 rounded-lg p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs uppercase tracking-widest text-gray-300 font-mono font-bold">
            Currency Risk Analysis
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {currencySummaries.length} Currencies
          </span>
          {dominantCurrency && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 hidden sm:inline">
              Dominant: {dominantCurrency.currency} ({dominantPct.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {/* Portfolio Allocation Visual Ribbon */}
      <div className="mt-3 p-2.5 rounded bg-black/40 border border-white/5">
        <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>Portfolio Exposure Spread</span>
          </span>
          <span className="text-gray-300">
            <strong className="text-emerald-400">{dominantCurrency?.currency}</strong> {dominantPct.toFixed(1)}% |{' '}
            <span className="text-gray-400">Other {currencySummaries.length - 1}: {nonDominantPct.toFixed(1)}%</span>
          </span>
        </div>

        {/* Multi-segment stacked progress bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
          {currencySummaries.map((item) => (
            <div
              key={item.currency}
              style={{
                width: `${item.percentageShare}%`,
                backgroundColor: item.color,
              }}
              title={`${item.currency}: ${item.percentageShare.toFixed(1)}%`}
              className="h-full transition-all duration-300 hover:opacity-80 cursor-pointer"
              onMouseEnter={() => setHoveredCurrency(item.currency)}
              onMouseLeave={() => setHoveredCurrency(null)}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area: Donut Chart + Expanded Currency List */}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center w-[210px] h-[210px] shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {slices.map((slice) => {
              const isHovered = hoveredCurrency === slice.currency;
              return (
                <circle
                  key={slice.currency}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 10px ${slice.color})` : 'none',
                    opacity: hoveredCurrency && !isHovered ? 0.3 : 1,
                  }}
                  onMouseEnter={() => setHoveredCurrency(slice.currency)}
                  onMouseLeave={() => setHoveredCurrency(null)}
                />
              );
            })}
          </svg>

          {/* Center Text Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-3 font-mono">
            {activeSummary ? (
              <>
                <span className="text-base leading-none mb-1">{activeSummary.flag}</span>
                <span className="font-bold text-xs text-white uppercase tracking-wider">
                  {activeSummary.currency}
                </span>
                <span className="text-lg font-bold text-emerald-400 mt-0.5">
                  {activeSummary.percentageShare.toFixed(1)}%
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {formatCurrencyAmount(activeSummary.normalizedBalance, baseCurrency, { compact: true })}
                </span>
              </>
            ) : (
              <>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {dominantCurrency?.currency ? `${dominantCurrency.currency} Dominant` : 'Portfolio'}
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5">
                  {dominantCurrency ? `${dominantCurrency.percentageShare.toFixed(1)}% Exposure` : '100%'}
                </span>
                <span className="text-xs font-bold text-emerald-400 mt-1">
                  {formatCurrencyAmount(totalLiquidity, baseCurrency, { compact: true })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Full Currency Legend List (Expanded without cramped scrollbar) */}
        <div className="w-full flex-1 space-y-1.5 overflow-y-auto max-h-[340px] pr-1 font-mono">
          {currencySummaries.map((item) => {
            const isHovered = hoveredCurrency === item.currency;
            const isDominant = item.currency === dominantCurrency?.currency;

            return (
              <div
                key={item.currency}
                onMouseEnter={() => setHoveredCurrency(item.currency)}
                onMouseLeave={() => setHoveredCurrency(null)}
                className={`flex items-center justify-between p-2 rounded transition-all cursor-pointer border ${
                  isHovered
                    ? 'bg-white/10 border-emerald-500/50 shadow-sm'
                    : 'bg-black/30 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs shrink-0">{item.flag}</span>
                  <span className="font-bold text-xs text-gray-200">
                    {item.currency}
                  </span>
                  {isDominant && (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20 hidden xl:inline">
                      LEAD
                    </span>
                  )}
                </div>

                <div className="text-right flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-300 font-medium">
                    {formatCurrencyAmount(item.normalizedBalance, baseCurrency, { compact: true })}
                  </span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded min-w-[42px] text-center"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                      border: `1px solid ${item.color}40`,
                    }}
                  >
                    {item.percentageShare.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Insight Strip */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3 h-3 text-emerald-400" />
          <span>Base Currency: <strong className="text-gray-300">{baseCurrency}</strong></span>
        </span>
        <span className="text-gray-400">
          Hover slice or currency for details
        </span>
      </div>
    </div>
  );
};
