import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Artwork } from '../types/works';
import { getAssetUrl } from '../utils/assets';
import { lightboxBackdropVariants, lightboxContentVariants } from '../utils/motion';

interface LightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const Lightbox: React.FC<LightboxProps> = ({
  artwork,
  onClose,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrev && hasPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext && hasNext) {
        onNext();
      }
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    if (artwork) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [artwork, handleKeyDown]);

  if (!artwork) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        variants={lightboxBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-charcoal/90 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label={`Artwork: ${artwork.title}`}
      >
        {/* Navigation Arrow Left */}
        {onPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            disabled={!hasPrev}
            className={`hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full border border-border/20 bg-charcoal/80 text-bg hover:text-white hover:border-border/50 transition-all ${
              !hasPrev ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
            }`}
            aria-label="Previous artwork"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {onNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            disabled={!hasNext}
            className={`hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full border border-border/20 bg-charcoal/80 text-bg hover:text-white hover:border-border/50 transition-all ${
              !hasNext ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
            }`}
            aria-label="Next artwork"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2.5 rounded-full bg-charcoal/80 border border-border/30 text-bg hover:text-white hover:bg-charcoal transition-all"
          aria-label="Close modal (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content Box */}
        <motion.div
          key={artwork.id}
          variants={lightboxContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl w-full max-h-[90vh] bg-charcoal border border-border/20 rounded-md overflow-hidden flex flex-col md:flex-row shadow-2xl"
        >
          {/* Artwork Display Container */}
          <div className="relative md:w-3/5 bg-charcoal-panel flex items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[300px]">
            <img
              src={getAssetUrl(artwork.image)}
              alt={artwork.title}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded select-none"
            />
          </div>

          {/* Info & Caption Details */}
          <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-charcoal text-bg">
            <div>
              {/* Category & Year */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-3">
                <span>{artwork.categoryLabel}</span>
                <span>&bull;</span>
                <span>{artwork.year}</span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-bg tracking-wide mb-4 leading-snug">
                {artwork.title}
              </h3>

              {/* Divider */}
              <div className="w-10 h-[1px] bg-border/40 mb-5" />

              {/* Description */}
              <p className="text-sm text-surface leading-relaxed mb-6 font-normal">
                {artwork.description}
              </p>

              {/* Metadata details */}
              <dl className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-border/15">
                <div>
                  <dt className="text-accent uppercase tracking-wider mb-1">Medium</dt>
                  <dd className="text-surface font-medium">{artwork.medium}</dd>
                </div>
                {artwork.dimensions && (
                  <div>
                    <dt className="text-accent uppercase tracking-wider mb-1">Resolution</dt>
                    <dd className="text-surface font-medium">{artwork.dimensions}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Mobile navigation controls */}
            <div className="flex sm:hidden items-center justify-between pt-6 mt-6 border-t border-border/15">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                className="flex items-center gap-1.5 text-xs text-accent hover:text-bg disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-1.5 text-xs text-accent hover:text-bg disabled:opacity-30"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
