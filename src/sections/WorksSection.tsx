import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BookOpen, Eye } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { Lightbox } from '../components/Lightbox';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { getAssetUrl } from '../utils/assets';
import { Artwork } from '../types/works';
import { sectionVariants, itemFadeUp, EDITORIAL_EASE } from '../utils/motion';

export const WorksSection: React.FC = () => {
  const { data } = useWebsiteData();
  const { artworks, categories, comicProject } = data;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Filter artworks based on visibility and selected category
  const visibleArtworks = useMemo(() => {
    return artworks.filter((a) => a.isVisible !== false && (a as any).is_visible !== false);
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    if (selectedCategory === 'all') {
      return visibleArtworks;
    }
    return visibleArtworks.filter((art) => art.category === selectedCategory);
  }, [selectedCategory, visibleArtworks]);

  // Current index in filtered list for Lightbox navigation
  const currentIndex = useMemo(() => {
    if (!lightboxArtwork) return -1;
    return filteredArtworks.findIndex((item) => item.id === lightboxArtwork.id);
  }, [lightboxArtwork, filteredArtworks]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setLightboxArtwork(filteredArtworks[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredArtworks.length - 1) {
      setLightboxArtwork(filteredArtworks[currentIndex + 1]);
    }
  };

  return (
    <section id="works" className="py-20 md:py-28 border-t border-border">
      <div className="max-w-content mx-auto px-6 sm:px-8">
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
        >
          {/* Section Header */}
          <SectionHeader
            eyebrow="02 — WORKS"
            title="Selected Archives"
            description="A curated collection of original character designs, comic sequential art, and commissioned pieces executed in monochromatic ink and digital chiaroscuro."
          />

          {/* Featured Comic Book Project Block */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemFadeUp}
            className="mb-16 rounded-md bg-charcoal p-6 sm:p-8 md:p-10 border border-border/40 text-bg shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Comic Book Cover Image Frame */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative aspect-[3/4] max-w-[260px] w-full rounded overflow-hidden shadow-2xl border border-border/20 group">
                  <img
                    src={getAssetUrl(comicProject.coverImage)}
                    alt={comicProject.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
                </div>
              </div>

              {/* Comic Book Info Details */}
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  {/* Status Badge + Volume */}
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/20 text-bg border border-border/20 tracking-wider uppercase font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {comicProject.status}
                    </span>
                    <span className="text-accent uppercase tracking-widest text-[11px]">
                      {comicProject.volume}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-bg mb-2">
                    {comicProject.title}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-accent mb-4">
                    {comicProject.subtitle}
                  </p>

                  {/* Synopsis */}
                  <p className="text-sm sm:text-base text-surface leading-relaxed mb-6 font-normal">
                    {comicProject.synopsis}
                  </p>

                  {/* Metadata Chips: Genre, Schedule, Chapter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-6 pt-4 border-t border-border/15">
                    <div>
                      <span className="text-accent block uppercase tracking-wider mb-1">
                        Current Arc
                      </span>
                      <span className="text-bg font-medium">
                        {comicProject.currentChapter}
                      </span>
                    </div>
                    <div>
                      <span className="text-accent block uppercase tracking-wider mb-1">
                        Publishing
                      </span>
                      <span className="text-bg font-medium">
                        {comicProject.releaseSchedule}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Read / Follow Button */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={comicProject.readUrl}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-bg text-ink text-xs uppercase tracking-widest font-medium hover:bg-surface transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read / Follow Project</span>
                  </a>
                  <span className="text-xs text-accent italic">
                    {comicProject.notes}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-border">
            {categories.map((tab) => {
              const isActive = selectedCategory === tab.id;
              const count =
                tab.id === 'all'
                  ? visibleArtworks.length
                  : visibleArtworks.filter((item) => item.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded text-xs tracking-wider uppercase font-medium transition-all ${
                    isActive
                      ? 'bg-ink text-bg shadow-sm'
                      : 'bg-transparent text-ink-secondary hover:text-ink hover:bg-surface'
                  }`}
                >
                  {tab.label}
                  {tab.id !== 'all' && (
                    <span className="ml-1.5 opacity-60 text-[10px]">
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Masonry / Uneven Grid Gallery */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start"
          >
            <AnimatePresence>
              {filteredArtworks.map((artwork) => (
                <motion.div
                  layout
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
                  className="group relative cursor-pointer"
                  onClick={() => setLightboxArtwork(artwork)}
                >
                  {/* Card Container with framed border */}
                  <div className="relative rounded overflow-hidden bg-charcoal border border-border/40 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:border-accent/60">
                    <div className={`relative ${artwork.aspectClass} w-full overflow-hidden`}>
                      <img
                        src={getAssetUrl(artwork.image)}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                        loading="lazy"
                      />

                      {/* Soft dark caption overlay on hover */}
                      <div className="absolute inset-0 bg-charcoal/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-bg">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-accent mb-1.5">
                            <span>{artwork.categoryLabel}</span>
                            <span>{artwork.year}</span>
                          </div>
                          <h4 className="font-serif text-lg font-light text-bg tracking-wide mb-1 leading-snug">
                            {artwork.title}
                          </h4>
                          <p className="text-xs text-surface/80 line-clamp-2 mb-3">
                            {artwork.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-bg font-medium pt-2 border-t border-border/20">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Expand Preview</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clean bottom caption visible on mobile / touch */}
                  <div className="sm:hidden mt-2 px-1">
                    <h4 className="font-serif text-base text-ink">{artwork.title}</h4>
                    <span className="text-xs text-ink-secondary">{artwork.categoryLabel} &bull; {artwork.year}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        artwork={lightboxArtwork}
        onClose={() => setLightboxArtwork(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < filteredArtworks.length - 1}
      />
    </section>
  );
};
