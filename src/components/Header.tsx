import React, { useState, useRef, useEffect } from 'react';
import { Download, Zap, FileCode2, ChevronDown, Check, AlertTriangle, Building2 } from 'lucide-react';
import { DEMO_PRESETS, DemoPreset } from '../data/sampleData';

interface HeaderProps {
  onLoadDemo: (presetId?: string) => void;
  onDownloadTemplate: () => void;
  onOpenExportModal: () => void;
  onQuickDownloadHtml: () => void;
  baseCurrency?: string;
  activePresetId?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadDemo,
  onDownloadTemplate,
  onOpenExportModal,
  baseCurrency = 'USD',
  activePresetId,
}) => {
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const demoMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (demoMenuRef.current && !demoMenuRef.current.contains(e.target as Node)) {
        setIsDemoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPreset = (presetId: string) => {
    onLoadDemo(presetId);
    setIsDemoMenuOpen(false);
  };

  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 border-b border-white/10 pb-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xs sm:text-sm uppercase tracking-[0.3em] text-emerald-500 font-bold font-mono">
            The Treasury Snapshot
          </h1>
          <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
            // CONSOLIDATED_ENGINE_RUN_83
          </span>
        </div>
        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
          Autonomous Consolidated Global Liquidity & FX Risk Matrix
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Status Badges */}
        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded">
          <span className="text-[9px] uppercase text-gray-500 block font-mono">Base Currency</span>
          <span className="text-xs font-semibold text-white font-mono">{baseCurrency}</span>
        </div>

        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded">
          <span className="text-[9px] uppercase text-gray-500 block font-mono">Status</span>
          <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ONLINE (OFFLINE SAFE)
          </span>
        </div>

        {/* Demo Button with Preset Dropdown */}
        <div className="relative" ref={demoMenuRef}>
          <div className="inline-flex rounded border border-emerald-500/30 bg-emerald-500/10 shadow-sm">
            <button
              id="btn-load-demo"
              type="button"
              onClick={() => handleSelectPreset('nexus_studios')}
              title="Load standard Global Enterprise demo dataset"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-bold transition-all active:scale-95 rounded-l"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30" />
              <span>Load Demo</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
              className="px-1.5 py-1.5 text-emerald-400 hover:bg-emerald-500/20 border-l border-emerald-500/30 transition-all rounded-r flex items-center justify-center"
              title="Select Demo Scenario"
              aria-expanded={isDemoMenuOpen}
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDemoMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Dropdown Menu */}
          {isDemoMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-lg bg-[#16161a] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1.5 mb-1 border-b border-white/5">
                <span className="text-[10px] uppercase tracking-wider font-mono text-gray-400 font-bold block">
                  Select Demo Scenario
                </span>
              </div>
              <div className="space-y-1">
                {DEMO_PRESETS.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  const isAlert = preset.id === 'concentration_alert';

                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`w-full text-left p-2 rounded transition-all flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                          : 'hover:bg-white/5 text-gray-300 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isAlert ? (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        ) : (
                          <Building2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-mono font-bold truncate">
                            {preset.name}
                          </span>
                          {isActive && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono line-clamp-2 mt-0.5 leading-tight">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          id="btn-download-template"
          onClick={onDownloadTemplate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-gray-400" />
          <span>CSV Template</span>
        </button>

        <button
          id="btn-open-export-modal"
          onClick={onOpenExportModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 text-xs font-mono uppercase font-bold hover:bg-emerald-600/30 transition-all active:scale-95"
        >
          <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Standalone .HTML</span>
        </button>
      </div>
    </header>
  );
};
