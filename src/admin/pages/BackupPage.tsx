import React, { useState } from 'react';
import { Download, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { exportAllContentAsJson, importAllContentFromJson } from '../../services/contentService';
import { useToast } from '../components/Toast';

export const BackupPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const { success: toastSuccess, error: toastError } = useToast();

  const handleExportDownload = async () => {
    setIsExporting(true);
    try {
      const jsonString = await exportAllContentAsJson();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kaien_art_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toastSuccess('Berkas cadangan data website berhasil diunduh.');
    } catch {
      toastError('Gagal mengekspor data website.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) {
      toastError('Harap tempelkan teks JSON cadangan terlebih dahulu.');
      return;
    }

    setIsImporting(true);
    try {
      await importAllContentFromJson(importJsonText);
      toastSuccess('Seluruh data berhasil dipulihkan (restore)! Memuat ulang halaman...');
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      toastError(err.message || 'Format JSON cadangan tidak sesuai.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImportJsonText(event.target?.result as string);
      toastSuccess(`Berkas ${file.name} berhasil dibaca.`);
    };
    reader.onerror = () => {
      toastError('Gagal membaca berkas JSON.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="font-serif text-3xl font-light text-ink mb-1">
          Cadangan &amp; Pemulihan Data (Backup &amp; Export)
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary">
          Simpan salinan cadangan lengkap seluruh konten portofolio Anda ke format JSON, atau pulihkan data kapan saja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Export Card */}
        <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-4">
          <div className="p-3 rounded-full bg-surface text-ink w-fit">
            <Download className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-light text-ink">
            Ekspor Data Portofolio (JSON)
          </h3>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Mengunduh seluruh konfigurasi situs, karya galeri, daftar komisi, profil, dan kotak pesan ke dalam satu berkas <code>.json</code>. Simpan berkas ini di komputer Anda sebagai arsip aman.
          </p>

          <button
            type="button"
            onClick={handleExportDownload}
            disabled={isExporting}
            className="w-full py-3 rounded bg-ink text-bg text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyiapkan Ekspor...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh Berkas Cadangan (.JSON)</span>
              </>
            )}
          </button>
        </div>

        {/* Import Card */}
        <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-4">
          <div className="p-3 rounded-full bg-surface text-ink w-fit">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-light text-ink">
            Pulihkan Data dari Berkas Cadangan
          </h3>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Unggah atau tempelkan data cadangan JSON untuk memulihkan seluruh konten situs.
          </p>

          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
                Pilih Berkas JSON atau Tempel Teks
              </label>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="w-full text-xs text-ink file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-medium file:bg-surface file:text-ink hover:file:bg-surface-muted cursor-pointer mb-2"
              />
              <textarea
                rows={4}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"version": "1.0", "bundle": { ... }}'
                className="w-full p-3 rounded border border-border bg-bg text-xs font-mono text-ink focus:border-ink focus:outline-none resize-y"
              />
            </div>

            <div className="p-3 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Perhatian:</strong> Mengimpor data cadangan akan menimpa seluruh konten saat ini dengan data dari berkas yang diunggah.
              </span>
            </div>

            <button
              type="submit"
              disabled={isImporting || !importJsonText.trim()}
              className="w-full py-3 rounded bg-ink text-bg text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memulihkan Data...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Pulihkan Konten Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
