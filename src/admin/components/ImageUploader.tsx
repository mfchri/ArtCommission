import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { compressAndUploadImage, validateImageFile } from '../../lib/supabase/storage';
import { getAssetUrl } from '../../utils/assets';
import { useToast } from './Toast';

interface ImageUploaderProps {
  label: string;
  helperText?: string;
  value: string;
  onChange: (url: string) => void;
  focalX?: number;
  focalY?: number;
  onFocalChange?: (focalX: number, focalY: number) => void;
  showFocalSelector?: boolean;
  aspectClass?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  helperText,
  value,
  onChange,
  focalX = 50,
  focalY = 50,
  onFocalChange,
  showFocalSelector = false,
  aspectClass = 'aspect-[16/10]',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: toastError, success: toastSuccess } = useToast();

  const handleFileProcess = async (file: File) => {
    const validationError = await validateImageFile(file);
    if (validationError) {
      toastError(validationError);
      return;
    }

    setIsUploading(true);
    try {
      const result = await compressAndUploadImage(file);
      onChange(result.url);
      toastSuccess('Gambar berhasil diunggah dan dikompresi.');
    } catch (err: any) {
      toastError(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFocalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showFocalSelector || !onFocalChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onFocalChange(Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase tracking-wider font-semibold text-ink">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-rose-600 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Hapus Gambar
          </button>
        )}
      </div>

      {helperText && <p className="text-xs text-ink-secondary leading-relaxed">{helperText}</p>}

      {value ? (
        <div className="relative rounded border border-border bg-charcoal overflow-hidden group">
          <div
            className={`relative ${aspectClass} w-full overflow-hidden cursor-crosshair`}
            onClick={handleFocalClick}
            title={showFocalSelector ? 'Klik pada gambar untuk mengatur titik fokus (focal point)' : undefined}
          >
            <img
              src={getAssetUrl(value)}
              alt="Preview"
              className="w-full h-full object-cover select-none"
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
            />

            {showFocalSelector && (
              <div
                className="absolute w-5 h-5 rounded-full border-2 border-white bg-black/50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 shadow"
                style={{ left: `${focalX}%`, top: `${focalY}%` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 m-auto mt-1" />
              </div>
            )}
          </div>

          <div className="p-3 bg-surface border-t border-border flex items-center justify-between text-xs text-ink-secondary">
            <span className="truncate max-w-[240px] font-mono text-[11px]">{value}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 rounded bg-bg border border-border text-ink hover:bg-surface text-xs font-medium"
            >
              Ganti Gambar
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-ink bg-surface'
              : 'border-border hover:border-accent hover:bg-surface/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <Loader2 className="w-6 h-6 animate-spin text-ink" />
              <span className="text-xs text-ink-secondary">Mengompresi &amp; mengunggah gambar...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-3 rounded-full bg-surface text-accent">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-ink">
                Tarik &amp; lepas gambar ke sini, atau <span className="underline">pilih berkas</span>
              </p>
              <p className="text-[11px] text-ink-secondary">
                Format: JPG, PNG, WEBP (Maksimal 10 MB, dikompresi otomatis)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
};
