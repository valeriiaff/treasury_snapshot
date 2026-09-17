import React, { useRef, useState } from 'react';
import { FileSpreadsheet, CheckCircle2, AlertCircle, FileText, Zap, Trash2 } from 'lucide-react';

interface FileUploadCardProps {
  fileName: string | null;
  accountsCount: number;
  errors: string[];
  onFileSelect: (file: File) => void;
  onLoadDemo?: (presetId?: string) => void;
  onClearData?: () => void;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  fileName,
  accountsCount,
  errors,
  onFileSelect,
  onLoadDemo,
  onClearData,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="bg-[#16161a] border border-white/5 p-4 sm:p-5 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
        <h2 className="text-xs uppercase tracking-widest text-gray-300 font-mono font-bold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          1. Source Data (.CSV)
        </h2>
        {fileName && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {accountsCount} accounts loaded
          </span>
        )}
      </div>

      <div
        id="csv-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-5 flex-1 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[140px] ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-500/10'
            : fileName
            ? 'border-white/15 bg-black/40 hover:border-emerald-500/40'
            : 'border-white/10 bg-black/20 hover:border-white/20'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept=".csv"
          className="hidden"
          id="csv-file-input"
        />

        <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-2">
          {fileName ? (
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          ) : (
            <span className="text-emerald-500 font-bold text-base leading-none">+</span>
          )}
        </div>

        {fileName ? (
          <div>
            <p className="text-xs text-gray-200 font-mono flex items-center justify-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              {fileName}
            </p>
            <p className="text-[10px] text-gray-500 font-mono mt-1">
              Click or drop new file to replace
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-300 font-mono font-medium">
              Drop .csv or click to upload
            </p>
            <p className="text-[10px] text-gray-500 mt-1.5 font-mono italic">
              Expected: Bank, Account, Currency, Balance
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions inside Card */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        {onLoadDemo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLoadDemo('nexus_studios');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/30 text-gray-400 hover:text-emerald-300 text-[11px] font-mono transition-colors active:scale-95"
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Load Demo Data</span>
          </button>
        )}

        {fileName && onClearData && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClearData();
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 text-[11px] font-mono transition-colors"
            title="Clear current data"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mt-3 p-3 rounded bg-red-950/30 border border-red-800/40 text-red-300 text-xs flex items-start gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
