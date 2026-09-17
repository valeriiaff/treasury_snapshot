import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FileUploadCard } from './components/FileUploadCard';
import { FxRateMatrixCard } from './components/FxRateMatrixCard';
import { KpiMetricsGrid } from './components/KpiMetricsGrid';
import { DonutChartCard } from './components/DonutChartCard';
import { CurrencyBreakdownTable } from './components/CurrencyBreakdownTable';
import { AccountLedgerTable } from './components/AccountLedgerTable';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import {
  parseTreasuryCsv,
  getDefaultFxRates,
  calculateTreasuryConsolidation,
} from './utils/treasuryCalculations';
import { DEMO_PRESETS } from './data/sampleData';
import { generateStandaloneHtml } from './utils/generateStandaloneHtml';
import { TreasuryAccount, FxRatesMap } from './types';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [accounts, setAccounts] = useState<TreasuryAccount[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fxRates, setFxRates] = useState<FxRatesMap>({});
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [fileName, setFileName] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>('nexus_studios');
  const [errors, setErrors] = useState<string[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  // Initialize with sample demo data on first load
  useEffect(() => {
    loadDemoData('nexus_studios', true);
  }, []);

  const loadDemoData = (presetId = 'nexus_studios', isInitial = false) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId) || DEMO_PRESETS[0];
    const parseResult = parseTreasuryCsv(preset.csvContent);

    if (parseResult.errors.length > 0) {
      setErrors(parseResult.errors);
      return;
    }

    const targetBase = preset.baseCurrency || 'USD';
    setBaseCurrency(targetBase);
    setFileName(preset.fileName);
    setActivePresetId(preset.id);
    setAccounts(parseResult.accounts);
    setCurrencies(parseResult.currencies);

    const initialRates = getDefaultFxRates(parseResult.currencies, targetBase);
    setFxRates(initialRates);
    setErrors([]);

    if (!isInitial) {
      const isAlert = preset.id === 'concentration_alert';
      setNotification({
        message: `Loaded Demo Scenario: ${preset.name} (${parseResult.accounts.length} accounts across ${parseResult.currencies.length} currencies)`,
        type: isAlert ? 'alert' : 'success',
      });
      setTimeout(() => setNotification(null), 4500);
    }
  };

  const handleClearData = () => {
    setAccounts([]);
    setCurrencies([]);
    setFxRates({});
    setFileName(null);
    setActivePresetId(null);
    setErrors([]);
    setNotification({
      message: 'Data cleared. Drop a CSV statement or load a demo scenario.',
      type: 'success',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const parseResult = parseTreasuryCsv(text);
      if (parseResult.errors.length > 0 && parseResult.accounts.length === 0) {
        setErrors(parseResult.errors);
        return;
      }

      setFileName(file.name);
      setActivePresetId(null);
      setAccounts(parseResult.accounts);
      setCurrencies(parseResult.currencies);
      const rates = getDefaultFxRates(parseResult.currencies, baseCurrency);
      setFxRates(rates);
      setErrors(parseResult.errors);

      setNotification({
        message: `Imported ${file.name} successfully (${parseResult.accounts.length} accounts).`,
        type: 'success',
      });
      setTimeout(() => setNotification(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleBaseCurrencyChange = (newBase: string) => {
    setBaseCurrency(newBase);
    const newRates = getDefaultFxRates(currencies, newBase);
    setFxRates(newRates);
  };

  const handleRateChange = (currency: string, rate: number) => {
    setFxRates((prev) => ({
      ...prev,
      [currency]: rate,
    }));
  };

  const handleResetDefaults = () => {
    const defaultRates = getDefaultFxRates(currencies, baseCurrency);
    setFxRates(defaultRates);
  };

  const handleDownloadTemplate = () => {
    const templateContent = `Bank Name,Account Name,Currency,Balance\nJPMorgan Chase,Steam Valve Primary Payout,USD,10000000.00\nBNP Paribas,EU Publishing & Regional HQ,EUR,5000000.00\nPKO Bank Polski,Warsaw Engine & Rendering Lab,PLN,12000000.00\nPrivatBank,Kyiv Animation & Rigging Hub,UAH,25000000.00\nBarclays,London Sound Stage,GBP,1200000.00`;
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'treasury_snapshot_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickDownloadHtml = () => {
    const htmlCode = generateStandaloneHtml();
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'The_Treasury_Snapshot_Standalone.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Consolidation calculation engine
  const consolidation = useMemo(() => {
    return calculateTreasuryConsolidation(accounts, fxRates, baseCurrency);
  }, [accounts, fxRates, baseCurrency]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] bg-grid-pattern text-gray-300 selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col justify-between relative">
      {/* Dynamic Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-2xl font-mono text-xs border ${
              notification.type === 'alert'
                ? 'bg-red-950/90 border-red-500/50 text-red-200'
                : 'bg-[#16161a]/95 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {notification.type === 'alert' ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-semibold">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <Header
          onLoadDemo={loadDemoData}
          onDownloadTemplate={handleDownloadTemplate}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onQuickDownloadHtml={handleQuickDownloadHtml}
          baseCurrency={baseCurrency}
          activePresetId={activePresetId}
        />

        {/* Inputs Row: File Upload & FX Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-5">
            <FileUploadCard
              fileName={fileName}
              accountsCount={accounts.length}
              errors={errors}
              onFileSelect={handleFileSelect}
              onLoadDemo={loadDemoData}
              onClearData={handleClearData}
            />
          </div>
          <div className="lg:col-span-7">
            <FxRateMatrixCard
              currencies={currencies}
              fxRates={fxRates}
              baseCurrency={baseCurrency}
              onBaseCurrencyChange={handleBaseCurrencyChange}
              onRateChange={handleRateChange}
              onResetDefaults={handleResetDefaults}
            />
          </div>
        </div>

        {/* Output Dashboard */}
        {accounts.length > 0 ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Headline Metrics Grid */}
            <KpiMetricsGrid metrics={consolidation.metrics} />

            {/* Visual Donut & Currency Breakdown Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <DonutChartCard
                  currencySummaries={consolidation.currencySummaries}
                  baseCurrency={baseCurrency}
                  totalLiquidity={consolidation.metrics.totalConsolidatedLiquidity}
                />
              </div>
              <div className="lg:col-span-7">
                <CurrencyBreakdownTable
                  currencySummaries={consolidation.currencySummaries}
                  baseCurrency={baseCurrency}
                />
              </div>
            </div>

            {/* Detailed Account Ledger & Bank Institutional Exposure */}
            <AccountLedgerTable
              accounts={consolidation.normalizedAccounts}
              bankSummaries={consolidation.bankSummaries}
              baseCurrency={baseCurrency}
              totalConsolidatedLiquidity={consolidation.metrics.totalConsolidatedLiquidity}
            />
          </div>
        ) : (
          <div className="bg-[#16161a] border border-white/5 rounded-lg p-10 text-center font-mono">
            <p className="text-gray-400 text-sm mb-3">No treasury accounts currently loaded.</p>
            <button
              onClick={() => loadDemoData('nexus_studios')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition-all"
            >
              Load Demo Dataset
            </button>
          </div>
        )}
      </div>

      {/* Elegant Dark Footer */}
      <footer className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-white/10 text-[10px] text-gray-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex gap-4">
          <span>NODE: CORE_PRIMARY</span>
          <span>DATA_REFRESH: LOCAL_INSTANT</span>
        </div>
        <div className="text-gray-400">
          SECURED INTERFACE // 100% CLIENT-SIDE OFFLINE // NO EXTERNAL DATA TRANSMISSION
        </div>
      </footer>

      {/* Standalone Single-File HTML Export Modal */}
      <StandaloneExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
