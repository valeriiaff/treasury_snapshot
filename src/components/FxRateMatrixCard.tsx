import React from 'react';
import { RefreshCw, ArrowRightLeft, DollarSign } from 'lucide-react';
import { FxRatesMap } from '../types';
import { getCurrencyInfo } from '../data/currencyMeta';

interface FxRateMatrixCardProps {
  currencies: string[];
  fxRates: FxRatesMap;
  baseCurrency: string;
  onBaseCurrencyChange: (base: string) => void;
  onRateChange: (currency: string, rate: number) => void;
  onResetDefaults: () => void;
}

const COMMON_BASE_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'PLN', 'AUD', 'SGD'];

export const FxRateMatrixCard: React.FC<FxRateMatrixCardProps> = ({
  currencies,
  fxRates,
  baseCurrency,
  onBaseCurrencyChange,
  onRateChange,
  onResetDefaults,
}) => {
  return (
    <div className="bg-[#16161a] border border-white/5 p-4 sm:p-5 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
        <h2 className="text-xs uppercase tracking-widest text-gray-300 font-mono font-bold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          2. FX Rates Engine
        </h2>
        <button
          onClick={onResetDefaults}
          title="Reset to benchmark FX rates"
          className="inline-flex items-center gap-1 text-[10px] font-mono text-gray-400 hover:text-emerald-400 transition-colors bg-white/5 px-2 py-0.5 rounded border border-white/10"
        >
          <RefreshCw className="w-2.5 h-2.5" />
          <span>Reset Benchmarks</span>
        </button>
      </div>

      {/* Base Currency Selector */}
      <div className="flex items-center justify-between bg-black/40 border border-white/5 px-3 py-2 rounded mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-gray-400 font-mono">
            Base Target:
          </span>
        </div>
        <select
          id="select-base-currency"
          value={baseCurrency}
          onChange={(e) => onBaseCurrencyChange(e.target.value)}
          className="bg-black/60 border border-white/15 text-emerald-400 font-mono font-bold text-xs rounded px-2.5 py-1 focus:outline-none focus:border-emerald-400 cursor-pointer"
        >
          {COMMON_BASE_CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c} - {getCurrencyInfo(c).name}
            </option>
          ))}
          {currencies
            .filter((c) => !COMMON_BASE_CURRENCIES.includes(c))
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
      </div>

      {/* FX Rates List */}
      {currencies.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-lg p-6 text-center text-gray-500 text-xs font-mono flex flex-col items-center justify-center min-h-[120px]">
          <ArrowRightLeft className="w-5 h-5 mb-2 opacity-30 text-gray-400" />
          <span>Load or upload data to display FX conversion pairs</span>
        </div>
      ) : (
        <div className="space-y-2 max-h-[220px] flex-1 overflow-y-auto pr-1 font-mono">
          {currencies.map((curr) => {
            const isBase = curr === baseCurrency;
            const rate = fxRates[curr] ?? (isBase ? 1.0 : 1.0);
            const inverseRate = rate > 0 ? (1 / rate).toFixed(4) : '0';

            return (
              <div
                key={curr}
                className={`flex items-center justify-between p-2 rounded border transition-all ${
                  isBase
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-black/40 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-200 font-semibold">
                    {curr}/{baseCurrency}
                  </span>
                  {isBase && (
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      BASE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    disabled={isBase}
                    value={rate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onRateChange(curr, isNaN(val) ? 0 : val);
                    }}
                    className={`bg-transparent border-b text-xs w-20 text-right outline-none font-mono py-0.5 transition-all ${
                      isBase
                        ? 'border-emerald-500/30 text-emerald-400 cursor-not-allowed opacity-80'
                        : 'border-white/20 text-emerald-400 focus:border-emerald-400'
                    }`}
                  />
                  {!isBase && rate > 0 && (
                    <span className="text-[9px] text-gray-500 hidden sm:inline" title={`1 ${baseCurrency} = ${inverseRate} ${curr}`}>
                      (inv: {inverseRate})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recalculate / Update Action bar */}
      <button
        onClick={onResetDefaults}
        className="w-full py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 text-[10px] uppercase font-bold mt-3 hover:bg-emerald-600/30 transition-all rounded font-mono"
      >
        Recalculate Liquid Assets
      </button>
    </div>
  );
};

