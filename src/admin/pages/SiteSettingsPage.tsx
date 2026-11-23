import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { ImageUploader } from '../components/ImageUploader';
import { useToast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { getWebsiteContent, saveAreaDraft, publishArea, revertAreaToPublished } from '../../services/contentService';
import { SiteSettings } from '../../types/site';

export const SiteSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);

  const { success: toastSuccess, error: toastError } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getWebsiteContent(true);
      setSettings(data.siteSettings);
    } catch {
      toastError('Gagal memuat pengaturan situs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveDraft = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await saveAreaDraft('site_settings', settings);
      setSettings({ ...settings, hasUnpublishedChanges: true });
      toastSuccess('Draf pengaturan situs berhasil disimpan secara lokal.');
    } catch {
      toastError('Gagal menyimpan draf.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!settings) return;
    setIsPublishing(true);
    try {
      await publishArea('site_settings', settings);
      setSettings({ ...settings, hasUnpublishedChanges: false });
      toastSuccess('Pengaturan situs berhasil dipublikasikan ke website publik!');
    } catch {
      toastError('Gagal mempublikasikan pengaturan.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRevert = async () => {
    setIsLoading(true);
    try {
      const reverted = await revertAreaToPublished('site_settings');
      if (reverted) {
        setSettings(reverted as SiteSettings);
        toastSuccess('Pengaturan situs berhasil dikembalikan ke versi publikasi terakhir.');
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

  if (isLoading || !settings) {
    return (
      <div className="py-12 text-center text-xs font-mono uppercase text-ink-secondary">
        Memuat Pengaturan Situs...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Pengaturan Situs &amp; Identitas"
        description="Kelola nama brand artist, metadata SEO, logo kanji, visibilitas seksi halaman, dan teks footer."
        hasUnpublishedChanges={settings.hasUnpublishedChanges}
        isSavingDraft={isSaving}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onRevert={() => setShowRevertModal(true)}
      />

      {/* Identitas Brand */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          01 // Identitas Artist &amp; Logo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Nama Artist (Logo Utama)
            </label>
            <input
              type="text"
              value={settings.artistName}
              onChange={(e) =>
                setSettings({ ...settings, artistName: e.target.value, hasUnpublishedChanges: true })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
              placeholder="KAIEN"
            />
            <span className="block text-[11px] text-ink-secondary mt-1">
              Ditampilkan pada navigasi kiri atas dan footer website.
            </span>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Logo Aksara / Kanji (Opsional)
            </label>
            <input
              type="text"
              value={settings.artistKanji || ''}
              onChange={(e) =>
                setSettings({ ...settings, artistKanji: e.target.value, hasUnpublishedChanges: true })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
              placeholder="晦冥"
            />
            <span className="block text-[11px] text-ink-secondary mt-1">
              Aksara pelengkap di samping nama brand artist (misal: kanji atau inisial).
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
            Slogan / Tagline Singkat
          </label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) =>
              setSettings({ ...settings, tagline: e.target.value, hasUnpublishedChanges: true })
            }
            className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
            placeholder="Original Characters · Dark Fantasy · Graphic Narratives"
          />
        </div>
      </div>

      {/* SEO & Meta Tags */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          02 // SEO &amp; Media Berbagi (Open Graph)
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
            Judul Halaman (Browser Title)
          </label>
          <input
            type="text"
            value={settings.siteTitle}
            onChange={(e) =>
              setSettings({ ...settings, siteTitle: e.target.value, hasUnpublishedChanges: true })
            }
            className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
            Deskripsi Meta (SEO &amp; Pratinjau Google)
          </label>
          <textarea
            rows={3}
            value={settings.metaDescription}
            onChange={(e) =>
              setSettings({ ...settings, metaDescription: e.target.value, hasUnpublishedChanges: true })
            }
            className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none resize-y"
          />
        </div>

        <ImageUploader
          label="Gambar Berbagi Open Graph (Facebook / Twitter / Discord Card)"
          helperText="Gambar yang muncul ketika tautan portofolio dibagikan di media sosial atau chat."
          value={settings.ogImage}
          onChange={(url) => setSettings({ ...settings, ogImage: url, hasUnpublishedChanges: true })}
        />
      </div>

      {/* Visibilitas Seksi & Label Navigasi */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          03 // Visibilitas Seksi &amp; Menu Navigasi
        </h3>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Atur label menu navbar dan tentukan seksi mana saja yang ingin ditampilkan ke publik (misalnya menyembunyikan seksi Komisi saat hiatus).
        </p>

        <div className="space-y-4">
          {(['intro', 'profile', 'works', 'commissions', 'contact'] as const).map((secKey) => (
            <div
              key={secKey}
              className="p-4 rounded border border-border bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <input
                  id={`vis-${secKey}`}
                  type="checkbox"
                  checked={settings.sectionVisibility[secKey]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sectionVisibility: {
                        ...settings.sectionVisibility,
                        [secKey]: e.target.checked,
                      },
                      hasUnpublishedChanges: true,
                    })
                  }
                  className="w-4 h-4 rounded text-ink border-border focus:ring-accent cursor-pointer"
                />
                <label htmlFor={`vis-${secKey}`} className="text-xs font-semibold uppercase tracking-wider cursor-pointer text-ink">
                  Seksi {secKey.toUpperCase()} ({settings.sectionVisibility[secKey] ? 'Aktif' : 'Disembunyikan'})
                </label>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-ink-secondary uppercase">Label Menu:</span>
                <input
                  type="text"
                  value={settings.navLabels[secKey]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      navLabels: {
                        ...settings.navLabels,
                        [secKey]: e.target.value,
                      },
                      hasUnpublishedChanges: true,
                    })
                  }
                  className="px-3 py-1.5 rounded border border-border bg-surface text-ink text-xs focus:border-ink focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Text */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          04 // Teks Footer &amp; Hak Cipta
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Pernyataan Hak Cipta &amp; Kepemilikan Karakter
            </label>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) =>
                setSettings({ ...settings, footerText: e.target.value, hasUnpublishedChanges: true })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Tahun Hak Cipta
            </label>
            <input
              type="number"
              value={settings.copyrightYear}
              onChange={(e) =>
                setSettings({ ...settings, copyrightYear: Number(e.target.value), hasUnpublishedChanges: true })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Revert confirmation dialog */}
      <ConfirmDialog
        isOpen={showRevertModal}
        title="Kembalikan Pengaturan Situs?"
        description="Semua perubahan draf yang belum dipublikasikan akan dibatalkan dan dikembalikan ke versi publikasi terakhir."
        confirmLabel="Ya, Kembalikan"
        isDestructive={false}
        onConfirm={handleRevert}
        onCancel={() => setShowRevertModal(false)}
      />
    </div>
  );
};
