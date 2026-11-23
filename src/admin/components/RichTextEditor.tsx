import React, { useState } from 'react';
import { Bold, Italic, Heading2, List, Quote, Eye, Edit3 } from 'lucide-react';

interface RichTextEditorProps {
  label: string;
  helperText?: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  helperText,
  value,
  onChange,
  rows = 5,
  placeholder = 'Tulis teks dalam format Markdown...',
}) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertSnippet = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById(`editor-${label}`) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = `${prefix}${selected || 'teks'}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 50);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={`editor-${label}`} className="block text-xs uppercase tracking-wider font-semibold text-ink">
          {label}
        </label>
        <div className="flex items-center gap-1 border border-border rounded p-0.5 bg-surface text-xs">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              !isPreview ? 'bg-bg text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              isPreview ? 'bg-bg text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <Eye className="w-3 h-3" /> Pratinjau
          </button>
        </div>
      </div>

      {helperText && <p className="text-xs text-ink-secondary">{helperText}</p>}

      {!isPreview ? (
        <div className="rounded border border-border bg-bg overflow-hidden focus-within:border-ink">
          {/* Toolbar */}
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-surface/50 text-ink-secondary text-xs">
            <button
              type="button"
              onClick={() => insertSnippet('**', '**')}
              className="p-1 rounded hover:bg-surface hover:text-ink"
              title="Tebal (Bold)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('*', '*')}
              className="p-1 rounded hover:bg-surface hover:text-ink"
              title="Miring (Italic)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('### ')}
              className="p-1 rounded hover:bg-surface hover:text-ink"
              title="Sub-judul (H3)"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('- ')}
              className="p-1 rounded hover:bg-surface hover:text-ink"
              title="Daftar Poin (List)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('> ')}
              className="p-1 rounded hover:bg-surface hover:text-ink"
              title="Kutipan (Quote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            id={`editor-${label}`}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3.5 text-xs sm:text-sm bg-transparent text-ink focus:outline-none resize-y leading-relaxed font-sans"
          />
        </div>
      ) : (
        <div className="rounded border border-border bg-surface/30 p-4 min-h-[120px] text-xs sm:text-sm text-ink leading-relaxed prose prose-sm max-w-none">
          {value ? (
            <div className="whitespace-pre-wrap">{value}</div>
          ) : (
            <span className="text-ink-secondary italic">Belum ada konten untuk ditampilkan.</span>
          )}
        </div>
      )}
    </div>
  );
};
