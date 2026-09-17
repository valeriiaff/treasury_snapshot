import React, { useState, useMemo } from 'react';
import { TreasuryAccount, BankSummary } from '../types';
import { formatCurrencyAmount } from '../utils/treasuryCalculations';
import { Search, Building, Landmark, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { getCurrencyInfo } from '../data/currencyMeta';

interface AccountLedgerTableProps {
  accounts: TreasuryAccount[];
  bankSummaries: BankSummary[];
  baseCurrency: string;
  totalConsolidatedLiquidity?: number;
}

export const AccountLedgerTable: React.FC<AccountLedgerTableProps> = ({
  accounts,
  bankSummaries,
  baseCurrency,
  totalConsolidatedLiquidity,
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'banks'>('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'bank' | 'account' | 'raw' | 'normalized'>('normalized');
  const [sortAsc, setSortAsc] = useState(false);

  const effectiveTotalLiquidity = useMemo(() => {
    if (typeof totalConsolidatedLiquidity === 'number' && totalConsolidatedLiquidity > 0) {
      return totalConsolidatedLiquidity;
    }
    return accounts.reduce((sum, a) => sum + (a.normalizedBalance || 0), 0);
  }, [totalConsolidatedLiquidity, accounts]);

  const alertAccounts = useMemo(() => {
    if (effectiveTotalLiquidity <= 0) return [];
    return accounts.filter((a) => (a.normalizedBalance || 0) / effectiveTotalLiquidity > 0.5);
  }, [accounts, effectiveTotalLiquidity]);

  const filteredAccounts = useMemo(() => {
    let result = accounts.filter(
      (a) =>
        a.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.currency.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'bank') {
        comparison = a.bankName.localeCompare(b.bankName);
      } else if (sortField === 'account') {
        comparison = a.accountName.localeCompare(b.accountName);
      } else if (sortField === 'raw') {
        comparison = a.rawBalance - b.rawBalance;
      } else if (sortField === 'normalized') {
        comparison = (a.normalizedBalance || 0) - (b.normalizedBalance || 0);
      }
      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [accounts, searchQuery, sortField, sortAsc]);

  const handleSort = (field: 'bank' | 'account' | 'raw' | 'normalized') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-[#16161a] border border-white/5 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded bg-black/40 p-0.5 border border-white/10 font-mono">
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-3 py-1 text-xs uppercase font-semibold rounded transition-all ${
                activeTab === 'accounts'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All Accounts ({accounts.length})
            </button>
            <button
              onClick={() => setActiveTab('banks')}
              className={`px-3 py-1 text-xs uppercase font-semibold rounded transition-all ${
                activeTab === 'banks'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              By Banking Counterparty ({bankSummaries.length})
            </button>
          </div>

          {alertAccounts.length > 0 && activeTab === 'accounts' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                {alertAccounts.length} {alertAccounts.length === 1 ? 'account exceeds' : 'accounts exceed'} &gt;50% threshold
              </span>
            </div>
          )}
        </div>

        {activeTab === 'accounts' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter accounts, banks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded pl-8 pr-3 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>
        )}
      </div>

      {activeTab === 'accounts' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                <th
                  onClick={() => handleSort('bank')}
                  className="py-2 px-3 rounded-l cursor-pointer hover:text-emerald-400"
                >
                  <div className="flex items-center gap-1">
                    <span>Institution</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('account')}
                  className="py-2 px-3 cursor-pointer hover:text-emerald-400"
                >
                  <div className="flex items-center gap-1">
                    <span>Account Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2 px-3">Currency</th>
                <th
                  onClick={() => handleSort('raw')}
                  className="py-2 px-3 text-right cursor-pointer hover:text-emerald-400"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Raw Cash Balance</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('normalized')}
                  className="py-2 px-3 text-right rounded-r cursor-pointer hover:text-emerald-400"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Bal ({baseCurrency})</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono text-gray-300">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No accounts matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const info = getCurrencyInfo(acc.currency);
                  const normalized = acc.normalizedBalance || 0;
                  const concentrationPct = effectiveTotalLiquidity > 0 ? (normalized / effectiveTotalLiquidity) * 100 : 0;
                  const isOverThreshold = concentrationPct > 50;

                  return (
                    <tr
                      key={acc.id}
                      className={`transition-colors border-l-4 ${
                        isOverThreshold
                          ? 'bg-red-500/15 hover:bg-red-500/25 border-l-red-500 text-red-200'
                          : 'border-l-transparent hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className={`py-2.5 px-3 font-semibold flex items-center gap-2 ${isOverThreshold ? 'text-red-200' : 'text-gray-200'}`}>
                        <Landmark className={`w-3 h-3 ${isOverThreshold ? 'text-red-400' : 'text-gray-500'}`} />
                        <span>{acc.bankName}</span>
                      </td>
                      <td className={`py-2.5 px-3 ${isOverThreshold ? 'text-red-200' : 'text-gray-400'}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{acc.accountName}</span>
                          {isOverThreshold && (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold tracking-tight uppercase"
                              title={`Exceeds 50% threshold: ${concentrationPct.toFixed(1)}% of consolidated liquidity`}
                            >
                              <AlertTriangle className="w-2.5 h-2.5 shrink-0 text-red-400" />
                              <span>&gt;50% Concentration ({concentrationPct.toFixed(1)}%)</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${
                          isOverThreshold
                            ? 'bg-red-950/60 border border-red-500/30 text-red-200'
                            : 'bg-black/40 border border-white/5 text-gray-300'
                        }`}>
                          <span>{info.flag}</span>
                          <span>{acc.currency}</span>
                        </span>
                      </td>
                      <td className={`py-2.5 px-3 text-right ${isOverThreshold ? 'text-red-200 font-semibold' : 'text-gray-300'}`}>
                        {formatCurrencyAmount(acc.rawBalance, acc.currency)}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${isOverThreshold ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                        {formatCurrencyAmount(normalized, baseCurrency)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                <th className="py-2 px-3 rounded-l">Institution</th>
                <th className="py-2 px-3">Active Accounts</th>
                <th className="py-2 px-3">Currencies Held</th>
                <th className="py-2 px-3 text-right">Consolidated ({baseCurrency})</th>
                <th className="py-2 px-3 text-right rounded-r">% Exposure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono text-gray-300">
              {bankSummaries.map((bank) => (
                <tr key={bank.bankName} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{bank.bankName}</span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-400">
                    {bank.accountCount} {bank.accountCount === 1 ? 'account' : 'accounts'}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {bank.currencies.map((c) => (
                        <span
                          key={c}
                          className="px-1.5 py-0.2 rounded text-[10px] bg-black/40 text-gray-300 border border-white/5"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-400 text-xs">
                    {formatCurrencyAmount(bank.normalizedBalance, baseCurrency)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-gray-200">
                        {bank.percentageShare.toFixed(1)}%
                      </span>
                      <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${bank.percentageShare}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

