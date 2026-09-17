import React, { useState } from 'react';
import { CurrencySummary } from '../types';
import { formatCurrencyAmount } from '../utils/treasuryCalculations';
import { ChevronDown, ChevronRight, Layers, Building2 } from 'lucide-react';

interface CurrencyBreakdownTableProps {
  currencySummaries: CurrencySummary[];
  baseCurrency: string;
}

export const CurrencyBreakdownTable: React.FC<CurrencyBreakdownTableProps> = ({
  currencySummaries,
  baseCurrency,
}) => {
  const [expandedCurrency, setExpandedCurrency] = useState<string | null>(null);

  const toggleExpand = (curr: string) => {
    setExpandedCurrency(expandedCurrency === curr ? null : curr);
  };

  return (
    <div className="bg-[#16161a] border border-white/5 rounded-lg p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
        <h2 className="text-xs uppercase tracking-widest text-gray-300 font-mono font-bold flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Cash Balances Grouped by Currency
        </h2>
        <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
          Base: <strong className="text-emerald-400">{baseCurrency}</strong>
        </span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono uppercase tracking-wider text-gray-400">
              <th className="py-2.5 px-3 rounded-l">Currency</th>
              <th className="py-2.5 px-3 text-right">Raw Cash Total</th>
              <th className="py-2.5 px-3 text-right">Applied FX Rate</th>
              <th className="py-2.5 px-3 text-right">Consolidated ({baseCurrency})</th>
              <th className="py-2.5 px-3 text-right rounded-r">% Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs font-mono text-gray-300">
            {currencySummaries.map((item) => {
              const isExpanded = expandedCurrency === item.currency;

              return (
                <React.Fragment key={item.currency}>
                  <tr
                    onClick={() => toggleExpand(item.currency)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 group-hover:text-emerald-400 transition-colors">
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </span>
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-xs">{item.flag}</span>
                        <div>
                          <span className="font-bold text-white text-xs mr-1">
                            {item.currency}
                          </span>
                          <span className="text-[10px] text-gray-500 hidden sm:inline">
                            ({item.accountCount} {item.accountCount === 1 ? 'acct' : 'accts'})
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-right text-gray-300">
                      {formatCurrencyAmount(item.totalRawBalance, item.currency)}
                    </td>

                    <td className="py-2.5 px-3 text-right text-emerald-400">
                      {item.currency === baseCurrency ? (
                        <span className="text-gray-500 text-[10px]">1.0000 (Base)</span>
                      ) : (
                        item.fxRate.toFixed(4)
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right font-semibold text-emerald-400">
                      {formatCurrencyAmount(item.normalizedBalance, baseCurrency)}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-gray-200">
                          {item.percentageShare.toFixed(1)}%
                        </span>
                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(2, item.percentageShare))}%`,
                              backgroundColor: item.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Accounts Drawer */}
                  {isExpanded && (
                    <tr className="bg-black/30">
                      <td colSpan={5} className="p-2.5">
                        <div className="rounded border border-white/5 bg-black/40 p-3 space-y-1.5">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5 pb-1.5 border-b border-white/5">
                            <Building2 className="w-3 h-3 text-emerald-400" />
                            <span>Accounts in {item.currency} ({item.accounts.length})</span>
                          </div>

                          <div className="space-y-1">
                            {item.accounts.map((acc) => (
                              <div
                                key={acc.id}
                                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-black/20 hover:bg-white/5 border border-white/5"
                              >
                                <div>
                                  <span className="font-semibold text-gray-200 mr-2">
                                    {acc.bankName}
                                  </span>
                                  <span className="text-gray-500 text-[10px]">
                                    — {acc.accountName}
                                  </span>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                  <span className="text-gray-400">
                                    {formatCurrencyAmount(acc.rawBalance, acc.currency)}
                                  </span>
                                  <span className="text-emerald-400 text-[11px]">
                                    ≈ {formatCurrencyAmount(acc.normalizedBalance || 0, baseCurrency)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

