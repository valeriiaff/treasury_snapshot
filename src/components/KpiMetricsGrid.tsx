import React from 'react';
import { PieChart, ShieldAlert, Building2 } from 'lucide-react';
import { TreasuryMetrics } from '../types';
import { formatCurrencyAmount } from '../utils/treasuryCalculations';
import { getCurrencyInfo } from '../data/currencyMeta';

interface KpiMetricsGridProps {
  metrics: TreasuryMetrics;
}

export const KpiMetricsGrid: React.FC<KpiMetricsGridProps> = ({ metrics }) => {
  const baseInfo = getCurrencyInfo(metrics.baseCurrency);
  const dominantInfo = getCurrencyInfo(metrics.dominantCurrency);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
      {/* Primary Consolidated Global Liquidity Hero Box (Takes 6 cols) */}
      <div className="md:col-span-6 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-emerald-500/40 uppercase tracking-widest">
          ENGINE: v4.0.2 // CONSOLIDATED
        </div>

        <span className="text-xs uppercase tracking-[0.4em] text-emerald-500/70 mb-2 font-mono">
          Consolidated Global Liquidity
        </span>

        <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tighter font-mono-num drop-shadow-[0_2px_10px_rgba(16,185,129,0.15)]">
          {formatCurrencyAmount(metrics.totalConsolidatedLiquidity, metrics.baseCurrency, { precision: 2 })}
        </span>

        <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-3 font-mono uppercase">
          <span>Base: {baseInfo.name}</span>
          <span>•</span>
          <span className="text-emerald-400">{metrics.totalBanksCount} Institutions</span>
          <span>•</span>
          <span>{metrics.totalAccountsCount} Accounts</span>
        </div>
      </div>

      {/* Primary Exposure / Concentration Risk (Takes 3 cols) */}
      <div className="md:col-span-3 bg-[#16161a] border border-white/5 rounded-lg p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">
              Currency Risk
            </span>
            <PieChart className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <h4 className="text-xs text-gray-300 font-mono">
            Primary Currency Exposure
          </h4>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white flex items-center gap-1.5">
              <span>{dominantInfo.flag}</span>
              <span>{metrics.dominantCurrency}</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              {metrics.dominantCurrencyShare.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-gray-500 pt-3 border-t border-white/5 mt-3">
          Dominant portfolio concentration
        </div>
      </div>

      {/* Non-Base FX Exposure / Hedging Need (Takes 3 cols) */}
      <div className="md:col-span-3 bg-[#16161a] border border-white/5 rounded-lg p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">
              FX Market Exposure
            </span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h4 className="text-xs text-gray-300 font-mono">
            Non-{metrics.baseCurrency} Cash Weight
          </h4>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-amber-300">
              {metrics.nonBaseExposureShare.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-gray-400 pt-3 border-t border-white/5 mt-3 flex items-center justify-between">
          <span>Unhedged Value:</span>
          <span className="text-gray-200 font-bold">
            {formatCurrencyAmount(metrics.nonBaseExposureValue, metrics.baseCurrency, { compact: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

