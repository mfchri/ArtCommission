import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          className="relative max-w-md w-full rounded-md border border-border bg-bg p-6 shadow-xl"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="flex items-start gap-4">
            <div className={`p-2.5 rounded-full shrink-0 ${isDestructive ? 'bg-rose-100 text-rose-700' : 'bg-surface text-ink'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-light text-ink mb-1.5">{title}</h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-6">{description}</p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded text-xs uppercase tracking-wider font-medium text-ink hover:bg-surface border border-border transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`px-4 py-2 rounded text-xs uppercase tracking-wider font-medium text-white transition-colors ${
                    isDestructive ? 'bg-rose-700 hover:bg-rose-800' : 'bg-ink hover:bg-accent'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-ink-secondary hover:text-ink transition-colors"
              aria-label="Tutup dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
