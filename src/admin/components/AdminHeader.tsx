import React from 'react';
import { Save, Send, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description: string;
  hasUnpublishedChanges?: boolean;
  isSavingDraft?: boolean;
  isPublishing?: boolean;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  onRevert?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  description,
  hasUnpublishedChanges = false,
  isSavingDraft = false,
  isPublishing = false,
  onSaveDraft,
  onPublish,
  onRevert,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-ink tracking-tight">
            {title}
          </h1>
          {hasUnpublishedChanges ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] uppercase font-mono tracking-wider font-semibold border border-amber-200">
              <AlertCircle className="w-3 h-3" />
              Perubahan Belum Dipublikasikan
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] uppercase font-mono tracking-wider font-medium border border-emerald-200">
              <CheckCircle className="w-3 h-3" />
              Sudah Terpublikasi
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {onRevert && hasUnpublishedChanges && (
          <button
            type="button"
            onClick={onRevert}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs uppercase tracking-wider font-medium text-ink-secondary hover:text-ink hover:bg-surface border border-border transition-colors"
            title="Kembalikan ke versi publikasi terakhir"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembalikan</span>
          </button>
        )}

        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSavingDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs uppercase tracking-wider font-medium text-ink bg-surface hover:bg-surface-muted border border-border transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavingDraft ? 'Menyimpan...' : 'Simpan Draf'}</span>
          </button>
        )}

        {onPublish && (
          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded text-xs uppercase tracking-wider font-medium text-bg bg-ink hover:bg-accent transition-colors shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Mempublikasikan...' : 'Publikasikan'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
