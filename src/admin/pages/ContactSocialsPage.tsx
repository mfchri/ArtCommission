import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SortableContainer } from '../components/SortableList';
import { useToast } from '../components/Toast';
import {
  getWebsiteContent,
  saveAreaDraft,
  publishArea,
  revertAreaToPublished,
  saveSocialLinks,
} from '../../services/contentService';
import { ContactSettings, CommissionTypeOption } from '../../types/contact';
import { SocialLinkItem } from '../../types/site';

export const ContactSocialsPage: React.FC = () => {
  const [contact, setContact] = useState<ContactSettings | null>(null);
  const [socials, setSocials] = useState<SocialLinkItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);

  const { success: toastSuccess, error: toastError } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getWebsiteContent(true);
      setContact(data.contactSettings);
      setSocials(data.socialLinks);
    } catch {
      toastError('Gagal memuat pengaturan kontak.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveDraft = async () => {
    if (!contact) return;
    setIsSaving(true);
    try {
      await saveAreaDraft('contact', contact);
      await saveSocialLinks(socials);
      setContact({ ...contact, hasUnpublishedChanges: true });
      toastSuccess('Draf pengaturan kontak berhasil disimpan secara lokal.');
    } catch {
      toastError('Gagal menyimpan draf.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!contact) return;
    setIsPublishing(true);
    try {
      await publishArea('contact', contact);
      await saveSocialLinks(socials);
      setContact({ ...contact, hasUnpublishedChanges: false });
      toastSuccess('Pengaturan kontak & media sosial berhasil dipublikasikan!');
    } catch {
      toastError('Gagal mempublikasikan kontak.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRevert = async () => {
    setIsLoading(true);
    try {
      const reverted = await revertAreaToPublished('contact');
      if (reverted) {
        setContact(reverted as ContactSettings);
        toastSuccess('Pengaturan kontak berhasil dikembalikan ke versi publikasi terakhir.');
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

  // Social link helpers
  const handleAddSocial = () => {
    const newSocial: SocialLinkItem = {
      id: `social-${Date.now()}`,
      platform: 'Platform Baru',
      name: 'Platform',
      handle: '@username',
      url: 'https://',
      iconName: 'mail',
      isVisible: true,
      sortOrder: socials.length,
    };
    const updated = [...socials, newSocial];
    setSocials(updated);
    saveSocialLinks(updated);
  };

  const handleRemoveSocial = (id: string) => {
    const updated = socials.filter((s) => s.id !== id);
    setSocials(updated);
    saveSocialLinks(updated);
  };

  // Commission types option editor
  const handleAddCommissionType = () => {
    if (!contact) return;
    const newOption: CommissionTypeOption = {
      value: `custom-${Date.now()}`,
      label: 'Jenis Komisi Baru',
    };
    setContact({
      ...contact,
      commissionTypes: [...contact.commissionTypes, newOption],
      hasUnpublishedChanges: true,
    });
  };

  const handleRemoveCommissionType = (val: string) => {
    if (!contact) return;
    setContact({
      ...contact,
      commissionTypes: contact.commissionTypes.filter((t) => t.value !== val),
      hasUnpublishedChanges: true,
    });
  };

  if (isLoading || !contact) {
    return (
      <div className="py-12 text-center text-xs font-mono uppercase text-ink-secondary">
        Memuat Pengaturan Kontak...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Kontak &amp; Media Sosial"
        description="Atur teks pengantar formulir kontak, alamat email tujuan, tautan media sosial, serta daftar opsi komisi pada dropdown form."
        hasUnpublishedChanges={contact.hasUnpublishedChanges}
        isSavingDraft={isSaving}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onRevert={() => setShowRevertModal(true)}
      />

      {/* Info Kontak & Email */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          01 // Informasi Kontak Artist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Alamat Email Artist (Publik &amp; Penerima Form)
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) =>
                setContact({ ...contact, email: e.target.value, hasUnpublishedChanges: true })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
              placeholder="kaien.atelier@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Estimasi Waktu Balasan
            </label>
            <input
              type="text"
              value={contact.availabilityNote}
              onChange={(e) =>
                setContact({ ...contact, availabilityNote: e.target.value, hasUnpublishedChanges: true })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
              placeholder="Typically replies within 24–48 hours"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
            Teks Ajakan (Invitation)
          </label>
          <input
            type="text"
            value={contact.invitation}
            onChange={(e) =>
              setContact({ ...contact, invitation: e.target.value, hasUnpublishedChanges: true })
            }
            className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
            Catatan Petunjuk Klien (Subtext)
          </label>
          <textarea
            rows={3}
            value={contact.subtext}
            onChange={(e) =>
              setContact({ ...contact, subtext: e.target.value, hasUnpublishedChanges: true })
            }
            className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Social Links Manager */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="font-serif text-xl font-light text-ink">
            02 // Tautan Media Sosial &amp; Portofolio Online ({socials.length})
          </h3>
          <button
            type="button"
            onClick={handleAddSocial}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-ink hover:text-accent"
          >
            <Plus className="w-4 h-4" /> Tambah Akun Sosial
          </button>
        </div>

        <SortableContainer
          items={socials}
          onReorder={(newSocials) => {
            setSocials(newSocials);
            saveSocialLinks(newSocials);
          }}
          renderItem={(social) => (
            <div className="p-4 rounded border border-border bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1">
                <input
                  type="text"
                  value={social.name}
                  onChange={(e) => {
                    const updated = socials.map((s) =>
                      s.id === social.id ? { ...s, name: e.target.value, platform: e.target.value } : s
                    );
                    setSocials(updated);
                    saveSocialLinks(updated);
                  }}
                  className="px-3 py-1.5 rounded border border-border bg-surface text-xs font-semibold text-ink"
                  placeholder="Platform (misal: Instagram)"
                />
                <input
                  type="text"
                  value={social.handle}
                  onChange={(e) => {
                    const updated = socials.map((s) =>
                      s.id === social.id ? { ...s, handle: e.target.value } : s
                    );
                    setSocials(updated);
                    saveSocialLinks(updated);
                  }}
                  className="px-3 py-1.5 rounded border border-border bg-surface text-xs font-mono text-ink-secondary"
                  placeholder="@handle"
                />
                <input
                  type="url"
                  value={social.url}
                  onChange={(e) => {
                    const updated = socials.map((s) =>
                      s.id === social.id ? { ...s, url: e.target.value } : s
                    );
                    setSocials(updated);
                    saveSocialLinks(updated);
                  }}
                  className="px-3 py-1.5 rounded border border-border bg-surface text-xs text-ink"
                  placeholder="https://..."
                />
                <select
                  value={social.iconName}
                  onChange={(e) => {
                    const updated = socials.map((s) =>
                      s.id === social.id ? { ...s, iconName: e.target.value as any } : s
                    );
                    setSocials(updated);
                    saveSocialLinks(updated);
                  }}
                  className="px-3 py-1.5 rounded border border-border bg-surface text-xs text-ink"
                >
                  <option value="instagram">Icon: Instagram</option>
                  <option value="twitter">Icon: X / Twitter</option>
                  <option value="artstation">Icon: ArtStation</option>
                  <option value="pixiv">Icon: Pixiv</option>
                  <option value="mail">Icon: Email</option>
                </select>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-1.5 text-xs text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={social.isVisible}
                    onChange={(e) => {
                      const updated = socials.map((s) =>
                        s.id === social.id ? { ...s, isVisible: e.target.checked } : s
                      );
                      setSocials(updated);
                      saveSocialLinks(updated);
                    }}
                    className="w-4 h-4 rounded text-ink"
                  />
                  <span>Tampil</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(social.id)}
                  className="p-1.5 text-accent hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Commission Type Options on Form */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="font-serif text-xl font-light text-ink">
            03 // Pilihan Tipe Komisi pada Dropdown Formulir
          </h3>
          <button
            type="button"
            onClick={handleAddCommissionType}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-ink hover:text-accent"
          >
            <Plus className="w-4 h-4" /> Tambah Pilihan
          </button>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Opsi-opsi ini akan muncul di menu dropdown &ldquo;Commission Tier / Type&rdquo; pada form kontak website publik.
        </p>

        <div className="space-y-3">
          {contact.commissionTypes.map((opt, idx) => (
            <div key={idx} className="p-3 rounded border border-border bg-bg flex items-center gap-3">
              <input
                type="text"
                value={opt.label}
                onChange={(e) => {
                  const updated = [...contact.commissionTypes];
                  updated[idx] = { ...updated[idx], label: e.target.value };
                  setContact({ ...contact, commissionTypes: updated, hasUnpublishedChanges: true });
                }}
                className="flex-1 px-3 py-1.5 rounded border border-border bg-surface text-xs text-ink"
                placeholder="Label opsi (misal: Rough Ink Sketch ($65+))"
              />
              <input
                type="text"
                value={opt.value}
                onChange={(e) => {
                  const updated = [...contact.commissionTypes];
                  updated[idx] = { ...updated[idx], value: e.target.value };
                  setContact({ ...contact, commissionTypes: updated, hasUnpublishedChanges: true });
                }}
                className="w-1/3 px-3 py-1.5 rounded border border-border bg-surface text-xs font-mono text-ink-secondary"
                placeholder="Value kode (misal: sketch)"
              />
              <button
                type="button"
                onClick={() => handleRemoveCommissionType(opt.value)}
                className="p-1.5 text-accent hover:text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showRevertModal}
        title="Kembalikan Pengaturan Kontak?"
        description="Semua perubahan draf seksi Kontak akan dibatalkan dan dikembalikan ke versi publikasi terakhir."
        confirmLabel="Ya, Kembalikan"
        isDestructive={false}
        onConfirm={handleRevert}
        onCancel={() => setShowRevertModal(false)}
      />
    </div>
  );
};
