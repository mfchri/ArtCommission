import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { getWebsiteContent, saveAreaDraft, publishArea, revertAreaToPublished } from '../../services/contentService';
import { IntroSectionData } from '../../types/intro';

export const IntroPage: React.FC = () => {
  const [intro, setIntro] = useState<IntroSectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);

  const { success: toastSuccess, error: toastError } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getWebsiteContent(true);
      setIntro(data.intro);
    } catch {
      toastError('Gagal memuat konten Hero.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveDraft = async () => {
    if (!intro) return;
    setIsSaving(true);
    try {
      await saveAreaDraft('intro', intro);
      setIntro({ ...intro, hasUnpublishedChanges: true });
      toastSuccess('Draf seksi Hero berhasil disimpan secara lokal.');
    } catch {
      toastError('Gagal menyimpan draf.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!intro) return;
    setIsPublishing(true);
    try {
      await publishArea('intro', intro);
      setIntro({ ...intro, hasUnpublishedChanges: false });
      toastSuccess('Konten seksi Hero berhasil dipublikasikan!');
    } catch {
      toastError('Gagal mempublikasikan konten Hero.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRevert = async () => {
    setIsLoading(true);
    try {
      const reverted = await revertAreaToPublished('intro');
      if (reverted) {
        setIntro(reverted as IntroSectionData);
        toastSuccess('Konten Hero berhasil dikembalikan ke versi publikasi terakhir.');
      } else {
        toastError('Tidak ada versi publikasi sebelumnya yang ditemukan.');
      }
    } catch {
      toastError('Gagal mengembalikan versi.');
    } finally {
      setIsLoading(false);
      setShowRevertModal(false);
    }
  };

  if (isLoading || !intro) {
    return (
      <div className="py-12 text-center text-xs font-mono uppercase text-ink-secondary">
        Memuat Konten Hero...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Intro (Hero Section)"
        description="Atur visual utama halaman pembuka portofolio, headline serif artist, kutipan pengantar, dan tombol aksi."
        hasUnpublishedChanges={intro.hasUnpublishedChanges}
        isSavingDraft={isSaving}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onRevert={() => setShowRevertModal(true)}
      />

      {/* Hero Visual Panel Frame */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          01 // Gambar Ilustrasi Utama (Framed Panel)
        </h3>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Gambar ini dibingkai dengan aksen panel komik sinematik <code>#1E1D1C</code> di sisi kanan Hero. Klik pada gambar untuk menentukan titik fokus (focal point) pemotongan layar.
        </p>

        <ImageUploader
          label="Berkas Gambar Hero (Maks. 10 MB, Otomatis Kompresi)"
          value={intro.heroArtwork.src}
          onChange={(url) =>
            setIntro({
              ...intro,
              heroArtwork: { ...intro.heroArtwork, src: url },
              hasUnpublishedChanges: true,
            })
          }
          showFocalSelector={true}
          focalX={intro.heroArtwork.focalX ?? 50}
          focalY={intro.heroArtwork.focalY ?? 50}
          onFocalChange={(x, y) =>
            setIntro({
              ...intro,
              heroArtwork: { ...intro.heroArtwork, focalX: x, focalY: y },
              hasUnpublishedChanges: true,
            })
          }
          aspectClass="aspect-[16/10] sm:aspect-[4/3]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Judul Karya Hero
            </label>
            <input
              type="text"
              value={intro.heroArtwork.title}
              onChange={(e) =>
                setIntro({
                  ...intro,
                  heroArtwork: { ...intro.heroArtwork, title: e.target.value },
                  hasUnpublishedChanges: true,
                })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
              placeholder="Vessel of Shards"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Medium / Teknik
            </label>
            <input
              type="text"
              value={intro.heroArtwork.medium}
              onChange={(e) =>
                setIntro({
                  ...intro,
                  heroArtwork: { ...intro.heroArtwork, medium: e.target.value },
                  hasUnpublishedChanges: true,
                })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
              placeholder="Digital Inking & Sumi Wash"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Tahun Pembuatan
            </label>
            <input
              type="text"
              value={intro.heroArtwork.year}
              onChange={(e) =>
                setIntro({
                  ...intro,
                  heroArtwork: { ...intro.heroArtwork, year: e.target.value },
                  hasUnpublishedChanges: true,
                })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
              placeholder="2026"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
            Teks Alt Gambar (Aksesibilitas)
          </label>
          <input
            type="text"
            value={intro.heroArtwork.alt}
            onChange={(e) =>
              setIntro({
                ...intro,
                heroArtwork: { ...intro.heroArtwork, alt: e.target.value },
                hasUnpublishedChanges: true,
              })
            }
            className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      {/* Editorial Text Block */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          02 // Teks &amp; Narasi Editorial
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
            Teks Eyebrow (Label Kecil Atas)
          </label>
          <input
            type="text"
            value={intro.eyebrow}
            onChange={(e) =>
              setIntro({ ...intro, eyebrow: e.target.value, hasUnpublishedChanges: true })
            }
            className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
            placeholder="Original Characters · Commissions · Comics"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
            Headline Utama (Font Serif Cormorant)
          </label>
          <input
            type="text"
            value={intro.headline}
            onChange={(e) =>
              setIntro({ ...intro, headline: e.target.value, hasUnpublishedChanges: true })
            }
            className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
            placeholder="Drawing the worlds that live in my head."
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
            Pengantar Singkat (1–2 Kalimat)
          </label>
          <textarea
            rows={3}
            value={intro.bioSummary}
            onChange={(e) =>
              setIntro({ ...intro, bioSummary: e.target.value, hasUnpublishedChanges: true })
            }
            className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          03 // Tombol Aksi Hero
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded border border-border bg-bg space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink block">
              Tombol Primer (Solid Ink)
            </span>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-ink-secondary mb-1">
                Label Tombol
              </label>
              <input
                type="text"
                value={intro.ctaPrimary.label}
                onChange={(e) =>
                  setIntro({
                    ...intro,
                    ctaPrimary: { ...intro.ctaPrimary, label: e.target.value },
                    hasUnpublishedChanges: true,
                  })
                }
                className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-ink-secondary mb-1">
                Target Link (Anchor atau URL)
              </label>
              <input
                type="text"
                value={intro.ctaPrimary.href}
                onChange={(e) =>
                  setIntro({
                    ...intro,
                    ctaPrimary: { ...intro.ctaPrimary, href: e.target.value },
                    hasUnpublishedChanges: true,
                  })
                }
                className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded border border-border bg-bg space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink block">
              Tombol Sekunder (Outline)
            </span>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-ink-secondary mb-1">
                Label Tombol
              </label>
              <input
                type="text"
                value={intro.ctaSecondary.label}
                onChange={(e) =>
                  setIntro({
                    ...intro,
                    ctaSecondary: { ...intro.ctaSecondary, label: e.target.value },
                    hasUnpublishedChanges: true,
                  })
                }
                className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-ink-secondary mb-1">
                Target Link (Anchor atau URL)
              </label>
              <input
                type="text"
                value={intro.ctaSecondary.href}
                onChange={(e) =>
                  setIntro({
                    ...intro,
                    ctaSecondary: { ...intro.ctaSecondary, href: e.target.value },
                    hasUnpublishedChanges: true,
                  })
                }
                className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showRevertModal}
        title="Kembalikan Konten Hero?"
        description="Semua perubahan draf seksi Hero akan dibatalkan dan dikembalikan ke versi publikasi terakhir."
        confirmLabel="Ya, Kembalikan"
        isDestructive={false}
        onConfirm={handleRevert}
        onCancel={() => setShowRevertModal(false)}
      />
    </div>
  );
};
