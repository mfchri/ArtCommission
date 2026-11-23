import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { ImageUploader } from '../components/ImageUploader';
import { RichTextEditor } from '../components/RichTextEditor';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { getWebsiteContent, saveAreaDraft, publishArea, revertAreaToPublished } from '../../services/contentService';
import { ProfileSectionData, FactItem, StatItem } from '../../types/profile';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileSectionData | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newTool, setNewTool] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);

  const { success: toastSuccess, error: toastError } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getWebsiteContent(true);
      setProfile(data.profile);
    } catch {
      toastError('Gagal memuat profil artist.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveDraft = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await saveAreaDraft('profile', profile);
      setProfile({ ...profile, hasUnpublishedChanges: true });
      toastSuccess('Draf profil artist berhasil disimpan secara lokal.');
    } catch {
      toastError('Gagal menyimpan draf.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!profile) return;
    setIsPublishing(true);
    try {
      await publishArea('profile', profile);
      setProfile({ ...profile, hasUnpublishedChanges: false });
      toastSuccess('Profil artist berhasil dipublikasikan!');
    } catch {
      toastError('Gagal mempublikasikan profil.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRevert = async () => {
    setIsLoading(true);
    try {
      const reverted = await revertAreaToPublished('profile');
      if (reverted) {
        setProfile(reverted as ProfileSectionData);
        toastSuccess('Profil berhasil dikembalikan ke versi publikasi terakhir.');
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

  // Tags manipulation
  const handleAddTag = () => {
    if (!profile || !newTag.trim()) return;
    if (profile.styleThemes.includes(newTag.trim())) return;
    setProfile({
      ...profile,
      styleThemes: [...profile.styleThemes, newTag.trim()],
      hasUnpublishedChanges: true,
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      styleThemes: profile.styleThemes.filter((t) => t !== tag),
      hasUnpublishedChanges: true,
    });
  };

  // Tools manipulation
  const handleAddTool = () => {
    if (!profile || !newTool.trim()) return;
    if (profile.toolsUsed.includes(newTool.trim())) return;
    setProfile({
      ...profile,
      toolsUsed: [...profile.toolsUsed, newTool.trim()],
      hasUnpublishedChanges: true,
    });
    setNewTool('');
  };

  const handleRemoveTool = (tool: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      toolsUsed: profile.toolsUsed.filter((t) => t !== tool),
      hasUnpublishedChanges: true,
    });
  };

  // Facts manipulation
  const handleAddFact = () => {
    if (!profile) return;
    const newFact: FactItem = { label: 'Catatan Baru', value: 'Keterangan' };
    setProfile({
      ...profile,
      facts: [...profile.facts, newFact],
      hasUnpublishedChanges: true,
    });
  };

  const handleFactChange = (index: number, field: 'label' | 'value', val: string) => {
    if (!profile) return;
    const updated = [...profile.facts];
    updated[index] = { ...updated[index], [field]: val };
    setProfile({ ...profile, facts: updated, hasUnpublishedChanges: true });
  };

  const handleRemoveFact = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      facts: profile.facts.filter((_, i) => i !== index),
      hasUnpublishedChanges: true,
    });
  };

  // Stats manipulation
  const handleStatChange = (index: number, field: keyof StatItem, val: any) => {
    if (!profile) return;
    const updated = [...profile.stats];
    updated[index] = { ...updated[index], [field]: val };
    setProfile({ ...profile, stats: updated, hasUnpublishedChanges: true });
  };

  if (isLoading || !profile) {
    return (
      <div className="py-12 text-center text-xs font-mono uppercase text-ink-secondary">
        Memuat Profil Artist...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Profil Artist (About the Artist)"
        description="Kelola foto potret atelier, biografi naratif, tag tema & gaya, alat gambar, catatan ringkas, dan angka statistik."
        hasUnpublishedChanges={profile.hasUnpublishedChanges}
        isSavingDraft={isSaving}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onRevert={() => setShowRevertModal(true)}
      />

      {/* Identitas & Avatar */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          01 // Potret Artist &amp; Gelar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <ImageUploader
              label="Foto / Ilustrasi Avatar"
              value={profile.avatar.src}
              onChange={(url) =>
                setProfile({
                  ...profile,
                  avatar: { ...profile.avatar, src: url },
                  hasUnpublishedChanges: true,
                })
              }
              aspectClass="aspect-[4/5]"
            />
          </div>

          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
                Keterangan Foto Avatar
              </label>
              <input
                type="text"
                value={profile.avatar.caption}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    avatar: { ...profile.avatar, caption: e.target.value },
                    hasUnpublishedChanges: true,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
                placeholder="KAIEN // Inking at the atelier"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
                Nama Artist
              </label>
              <input
                type="text"
                value={profile.artistName}
                onChange={(e) =>
                  setProfile({ ...profile, artistName: e.target.value, hasUnpublishedChanges: true })
                }
                className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
                Gelar / Subtitle Profesi
              </label>
              <input
                type="text"
                value={profile.subtitle}
                onChange={(e) =>
                  setProfile({ ...profile, subtitle: e.target.value, hasUnpublishedChanges: true })
                }
                className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
                placeholder="Independent Character Designer & Comic Illustrator"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Biografi Paragraf */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          02 // Biografi &amp; Filosofi Gambar
        </h3>

        <RichTextEditor
          label="Isi Biografi (Format Paragraf & Markdown didukung)"
          helperText="Tuliskan pengalaman, latar belakang penciptaan karakter orisinal, serta proyek buku komik Anda."
          value={profile.bioParagraphs.join('\n\n')}
          onChange={(val) => {
            const paras = val.split('\n\n').filter((p) => p.trim() !== '');
            setProfile({ ...profile, bioParagraphs: paras, hasUnpublishedChanges: true });
          }}
          rows={6}
        />
      </div>

      {/* Style & Themes Tags + Tools */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-8">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          03 // Tag Gaya, Tema &amp; Alat Gambar
        </h3>

        {/* Style & Themes */}
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink">
            Tag Gaya &amp; Tema (Style &amp; Themes)
          </label>
          <div className="flex flex-wrap gap-2">
            {profile.styleThemes.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-bg border border-border text-ink"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-accent hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Tambah tema (misal: Eldritch OCs)..."
              className="flex-1 px-3 py-2 rounded border border-border bg-bg text-ink text-xs focus:border-ink focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3.5 py-2 rounded bg-ink text-bg text-xs uppercase font-medium hover:bg-accent transition-colors"
            >
              Tambah
            </button>
          </div>
        </div>

        {/* Mediums & Tools */}
        <div className="space-y-3 pt-4 border-t border-border/60">
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink">
            Medium &amp; Alat Gambar (Tools Used)
          </label>
          <div className="flex flex-wrap gap-2">
            {profile.toolsUsed.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-bg border border-border text-ink-secondary"
              >
                <span>{tool}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTool(tool)}
                  className="text-accent hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTool();
                }
              }}
              placeholder="Tambah alat (misal: Maru Pen)..."
              className="flex-1 px-3 py-2 rounded border border-border bg-bg text-ink text-xs focus:border-ink focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTool}
              className="px-3.5 py-2 rounded bg-ink text-bg text-xs uppercase font-medium hover:bg-accent transition-colors"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>

      {/* Fast Facts */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="font-serif text-xl font-light text-ink">
            04 // Catatan Cepat (Fast Facts)
          </h3>
          <button
            type="button"
            onClick={handleAddFact}
            className="text-xs uppercase font-medium text-ink hover:text-accent flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Catatan
          </button>
        </div>

        <div className="space-y-3">
          {profile.facts.map((fact, idx) => (
            <div key={idx} className="p-3 rounded border border-border bg-bg flex items-center gap-3">
              <input
                type="text"
                value={fact.label}
                onChange={(e) => handleFactChange(idx, 'label', e.target.value)}
                placeholder="Label (misal: Lokasi)"
                className="w-1/3 px-3 py-2 rounded border border-border bg-surface text-xs text-ink focus:border-ink focus:outline-none"
              />
              <input
                type="text"
                value={fact.value}
                onChange={(e) => handleFactChange(idx, 'value', e.target.value)}
                placeholder="Nilai (misal: Tokyo / Kyoto)"
                className="flex-1 px-3 py-2 rounded border border-border bg-surface text-xs text-ink focus:border-ink focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveFact(idx)}
                className="p-1.5 text-accent hover:text-rose-600 transition-colors"
                title="Hapus baris"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Stats Row */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          05 // Baris Statistik dengan Animasi Hitung (Stats Row)
        </h3>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Angka-angka ini akan bergerak naik (count-up animation) secara halus saat pengunjung scroll ke seksi Profil.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile.stats.map((stat, idx) => (
            <div key={idx} className="p-4 rounded border border-border bg-bg space-y-2">
              <label className="block text-[11px] uppercase tracking-wider text-ink-secondary font-medium">
                Stat #{idx + 1}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => handleStatChange(idx, 'value', Number(e.target.value))}
                  className="w-2/3 px-3 py-2 rounded border border-border bg-surface text-xs font-serif text-lg font-light text-ink"
                  placeholder="48"
                />
                <input
                  type="text"
                  value={stat.suffix || ''}
                  onChange={(e) => handleStatChange(idx, 'suffix', e.target.value)}
                  className="w-1/3 px-3 py-2 rounded border border-border bg-surface text-xs font-serif text-ink"
                  placeholder="+"
                  title="Suffix simbol (misal: +, yrs)"
                />
              </div>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-surface text-xs text-ink"
                placeholder="OCs Created"
              />
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showRevertModal}
        title="Kembalikan Profil Artist?"
        description="Semua perubahan draf seksi Profil akan dibatalkan dan dikembalikan ke versi publikasi terakhir."
        confirmLabel="Ya, Kembalikan"
        isDestructive={false}
        onConfirm={handleRevert}
        onCancel={() => setShowRevertModal(false)}
      />
    </div>
  );
};
