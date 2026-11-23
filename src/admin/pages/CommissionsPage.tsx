import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Edit2, ShieldCheck, HelpCircle } from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SortableContainer } from '../components/SortableList';
import { useToast } from '../components/Toast';
import { getAssetUrl } from '../../utils/assets';
import {
  getWebsiteContent,
  saveAreaDraft,
  publishArea,
  revertAreaToPublished,
  saveCommissionTiers,
  deleteCommissionTier,
  saveCommissionAddons,
  saveCommissionSteps,
  saveCommissionTos,
  saveCommissionFaqs,
} from '../../services/contentService';
import {
  CommissionsConfig,
  CommissionTier,
  AddOnItem,
  ProcessStep,
  TosItem,
  FaqItem,
} from '../../types/commissions';

export const CommissionsPage: React.FC = () => {
  const [config, setConfig] = useState<CommissionsConfig | null>(null);
  const [tiers, setTiers] = useState<CommissionTier[]>([]);
  const [addons, setAddons] = useState<AddOnItem[]>([]);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [tosList, setTosList] = useState<TosItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Modals & sub-form states
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [deletingTierId, setDeletingTierId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);

  const { success: toastSuccess, error: toastError } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getWebsiteContent(true);
      setConfig(data.commissionsConfig);
      const loadedTiers = Array.isArray(data.commissionTiers) && data.commissionTiers.length > 0
        ? data.commissionTiers
        : (Array.isArray((data.commissionsConfig as any)?.tiers) ? (data.commissionsConfig as any).tiers : []);
      setTiers(loadedTiers);
      setAddons(data.commissionAddons || []);
      setSteps(data.commissionSteps || []);
      setTosList(data.commissionTos || []);
      setFaqs(data.commissionFaqs || []);
    } catch {
      toastError('Gagal memuat data komisi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveDraft = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      const updatedConfig = { ...config, hasUnpublishedChanges: true };
      await saveAreaDraft('commissions', updatedConfig);
      await saveCommissionTiers(tiers);
      await saveCommissionAddons(addons);
      await saveCommissionSteps(steps);
      await saveCommissionTos(tosList);
      await saveCommissionFaqs(faqs);
      setConfig(updatedConfig);
      toastSuccess('Draf pengaturan komisi berhasil disimpan secara lokal.');
    } catch {
      toastError('Gagal menyimpan draf.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!config) return;
    setIsPublishing(true);
    try {
      const updatedConfig = { ...config, hasUnpublishedChanges: false };
      await publishArea('commissions', updatedConfig);
      await saveCommissionTiers(tiers);
      await saveCommissionAddons(addons);
      await saveCommissionSteps(steps);
      await saveCommissionTos(tosList);
      await saveCommissionFaqs(faqs);
      setConfig(updatedConfig);
      toastSuccess('Seluruh pengaturan komisi berhasil dipublikasikan!');
    } catch {
      toastError('Gagal mempublikasikan komisi.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRevert = async () => {
    setIsLoading(true);
    try {
      const reverted = await revertAreaToPublished('commissions');
      if (reverted) {
        toastSuccess('Pengaturan komisi berhasil dikembalikan ke versi publikasi terakhir.');
        await loadData();
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

  // Tier modal actions
  const openNewTier = () => {
    const initialFeatures = ['File 300 DPI resolusi tinggi', '1x revisi sketsa'];
    setEditingTier({
      id: `tier-${Date.now()}`,
      name: 'Tier Baru',
      price: '$100 USD',
      badge: '',
      description: 'Deskripsi paket komisi ilustrasi.',
      image: '/assets/tier-sketch.svg',
      turnaround: '7 – 10 hari kerja',
      features: initialFeatures,
      isPopular: false,
      sortOrder: tiers.length,
    });
    setFeaturesText(initialFeatures.join('\n'));
    setIsTierModalOpen(true);
  };

  const openEditTier = (tier: CommissionTier) => {
    const feat = Array.isArray(tier.features) ? tier.features : [];
    setEditingTier({
      ...tier,
      features: feat,
    });
    setFeaturesText(feat.join('\n'));
    setIsTierModalOpen(true);
  };

  const handleSaveTierModal = async () => {
    if (!editingTier) return;
    if (!editingTier.name.trim()) {
      toastError('Nama paket tier wajib diisi.');
      return;
    }
    if (!editingTier.price.trim()) {
      toastError('Harga tampilan wajib diisi.');
      return;
    }

    const parsedFeatures = featuresText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '');

    const tierToSave: CommissionTier = {
      ...editingTier,
      name: editingTier.name.trim(),
      price: editingTier.price.trim(),
      features: parsedFeatures,
      sortOrder: editingTier.sortOrder ?? tiers.length,
    };

    const exists = tiers.some((t) => t.id === tierToSave.id);
    let updated: CommissionTier[];
    if (exists) {
      updated = tiers.map((t) => (t.id === tierToSave.id ? tierToSave : t));
    } else {
      updated = [...tiers, tierToSave];
    }

    updated = updated.map((t, idx) => ({ ...t, sortOrder: t.sortOrder ?? idx }));

    setTiers(updated);
    if (config) {
      setConfig({ ...config, hasUnpublishedChanges: true });
    }

    try {
      await saveCommissionTiers(updated);
      setIsTierModalOpen(false);
      toastSuccess(`Tier "${tierToSave.name}" berhasil disimpan.`);
      await loadData();
    } catch {
      toastError('Gagal menyimpan tier komisi.');
    }
  };

  const handleDeleteTierConfirm = async () => {
    if (!deletingTierId) return;
    const updated = tiers.filter((t) => t.id !== deletingTierId);
    setTiers(updated);
    if (config) {
      setConfig({ ...config, hasUnpublishedChanges: true });
    }
    try {
      await deleteCommissionTier(deletingTierId);
      setDeletingTierId(null);
      toastSuccess('Tier harga berhasil dihapus.');
      await loadData();
    } catch {
      toastError('Gagal menghapus tier komisi.');
    }
  };

  // Addon actions
  const handleAddAddon = () => {
    const newItem: AddOnItem = {
      id: `addon-${Date.now()}`,
      name: 'Add-on Baru',
      price: '+$50 USD',
      note: 'Keterangan tambahan',
      sortOrder: addons.length,
    };
    const updated = [...addons, newItem];
    setAddons(updated);
    saveCommissionAddons(updated);
  };

  const handleRemoveAddon = (id: string) => {
    const updated = addons.filter((a) => a.id !== id);
    setAddons(updated);
    saveCommissionAddons(updated);
  };

  // Steps actions
  const handleAddStep = () => {
    const newStep: ProcessStep = {
      id: `step-${Date.now()}`,
      step: `0${steps.length + 1}`,
      title: 'Langkah Baru',
      description: 'Deskripsi alur kerja...',
      sortOrder: steps.length,
    };
    const updated = [...steps, newStep];
    setSteps(updated);
    saveCommissionSteps(updated);
  };

  const handleRemoveStep = (id: string) => {
    const updated = steps.filter((s) => s.id !== id);
    setSteps(updated);
    saveCommissionSteps(updated);
  };

  // TOS actions
  const handleAddTos = () => {
    const newTos: TosItem = {
      id: `tos-${Date.now()}`,
      title: 'Judul Syarat Ketentuan Baru',
      content: ['Klausul poin pertama.', 'Klausul poin kedua.'],
      sortOrder: tosList.length,
    };
    const updated = [...tosList, newTos];
    setTosList(updated);
    saveCommissionTos(updated);
  };

  const handleRemoveTos = (id: string) => {
    const updated = tosList.filter((t) => t.id !== id);
    setTosList(updated);
    saveCommissionTos(updated);
  };

  // FAQ actions
  const handleAddFaq = () => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: 'Pertanyaan yang sering diajukan?',
      answer: 'Jawaban detail untuk klien.',
      sortOrder: faqs.length,
    };
    const updated = [...faqs, newFaq];
    setFaqs(updated);
    saveCommissionFaqs(updated);
  };

  const handleRemoveFaq = (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    saveCommissionFaqs(updated);
  };

  if (isLoading || !config) {
    return (
      <div className="py-12 text-center text-xs font-mono uppercase text-ink-secondary">
        Memuat Pengaturan Komisi...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Open Commissions &amp; Ketentuan"
        description="Kelola status buka/tutup komisi, slot kuota, 3 tier paket harga, add-on kustom, tahapan pengerjaan, dan accordion syarat layanan (TOS)."
        hasUnpublishedChanges={config.hasUnpublishedChanges}
        isSavingDraft={isSaving}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onRevert={() => setShowRevertModal(true)}
      />

      {/* Status & Availability Toggle */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-light text-ink pb-2 border-b border-border">
          01 // Status Pembukaan &amp; Kuota Slot
        </h3>

        <div className="p-4 rounded border border-border bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              id="commission-is-open"
              type="checkbox"
              checked={config.isOpen}
              onChange={(e) => setConfig({ ...config, isOpen: e.target.checked, hasUnpublishedChanges: true })}
              className="w-5 h-5 rounded text-ink cursor-pointer"
            />
            <div>
              <label htmlFor="commission-is-open" className="text-sm font-semibold uppercase tracking-wider text-ink cursor-pointer block">
                Status: {config.isOpen ? 'Komisi Sedang DIBUKA (Open)' : 'Komisi Sedang DITUTUP (Closed)'}
              </label>
              <span className="text-xs text-ink-secondary">
                {config.isOpen
                  ? 'Tombol permintaan komisi di website aktif dan menerima pesanan klien.'
                  : 'Tombol di website publik berubah menjadi disabled (Slots Filled).'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded text-xs uppercase font-mono font-semibold tracking-wider ${
                config.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-surface text-ink-secondary'
              }`}
            >
              {config.isOpen ? 'Menerima Klien' : 'Penuh'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Slot Tersedia (Available)
            </label>
            <input
              type="number"
              value={config.slotsAvailable}
              onChange={(e) =>
                setConfig({ ...config, slotsAvailable: Number(e.target.value), hasUnpublishedChanges: true })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Total Kuota Slot Batch
            </label>
            <input
              type="number"
              value={config.slotsTotal}
              onChange={(e) =>
                setConfig({ ...config, slotsTotal: Number(e.target.value), hasUnpublishedChanges: true })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
              Catatan Pembukaan Berikutnya
            </label>
            <input
              type="text"
              value={config.nextOpeningEstimate}
              onChange={(e) =>
                setConfig({ ...config, nextOpeningEstimate: e.target.value, hasUnpublishedChanges: true })
              }
              className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm"
              placeholder="Batch 02 opening in December 2026"
            />
          </div>
        </div>
      </div>

      {/* Pricing Tiers Section */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="font-serif text-xl font-light text-ink">
            02 // Paket Harga Komisi ({tiers.length} Tiers)
          </h3>
          <button
            type="button"
            onClick={openNewTier}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-ink hover:text-accent"
          >
            <Plus className="w-4 h-4" /> Tambah Paket Tier
          </button>
        </div>

        <SortableContainer
          items={tiers}
          onReorder={async (newTiers) => {
            const reordered = newTiers.map((t, idx) => ({ ...t, sortOrder: idx }));
            setTiers(reordered);
            if (config) {
              setConfig({ ...config, hasUnpublishedChanges: true });
            }
            await saveCommissionTiers(reordered);
            toastSuccess('Urutan paket harga berhasil diperbarui.');
          }}
          renderItem={(tier) => (
            <div className="p-4 rounded border border-border bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded overflow-hidden bg-charcoal shrink-0 border border-border">
                  <img src={getAssetUrl(tier.image)} alt={tier.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-serif text-lg font-light text-ink">{tier.name}</h4>
                    <span className="font-mono text-xs font-semibold text-accent">{tier.price}</span>
                    {tier.isPopular && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ink text-bg">
                        Populer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-secondary line-clamp-1">{tier.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditTier(tier)}
                  className="p-2 rounded border border-border hover:bg-surface text-ink transition-colors"
                  title="Edit tier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingTierId(tier.id)}
                  className="p-2 rounded border border-border hover:bg-rose-50 text-accent hover:text-rose-600 transition-colors"
                  title="Hapus tier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Add-ons List */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="font-serif text-xl font-light text-ink">
            03 // Opsi Tambahan (Add-ons)
          </h3>
          <button
            type="button"
            onClick={handleAddAddon}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-ink hover:text-accent"
          >
            <Plus className="w-4 h-4" /> Tambah Add-on
          </button>
        </div>

        <SortableContainer
          items={addons}
          onReorder={(newAddons) => {
            setAddons(newAddons);
            saveCommissionAddons(newAddons);
          }}
          renderItem={(addon) => (
            <div className="p-3.5 rounded border border-border bg-bg flex items-center justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                <input
                  type="text"
                  value={addon.name}
                  onChange={(e) => {
                    const updated = addons.map((a) =>
                      a.id === addon.id ? { ...a, name: e.target.value } : a
                    );
                    setAddons(updated);
                    saveCommissionAddons(updated);
                  }}
                  className="px-3 py-1.5 rounded border border-border bg-surface text-xs text-ink"
                  placeholder="Nama opsi (misal: Karakter Tambahan)"
                />
                <input
                  type="text"
                  value={addon.price}
                  onChange={(e) => {
                    const updated = addons.map((a) =>
                      a.id === addon.id ? { ...a, price: e.target.value } : a
                    );
                    setAddons(updated);
                    saveCommissionAddons(updated);
                  }}
                  className="px-3 py-1.5 rounded border border-border bg-surface text-xs font-mono text-ink"
                  placeholder="Harga (misal: +75% harga tier)"
                />
                <input
                  type="text"
                  value={addon.note || ''}
                  onChange={(e) => {
                    const updated = addons.map((a) =>
                      a.id === addon.id ? { ...a, note: e.target.value } : a
                    );
                    setAddons(updated);
                    saveCommissionAddons(updated);
                  }}
                  className="px-3 py-1.5 rounded border border-border bg-surface text-xs text-ink-secondary"
                  placeholder="Catatan kecil..."
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAddon(addon.id)}
                className="p-1.5 text-accent hover:text-rose-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      {/* 4-Step Process */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="font-serif text-xl font-light text-ink">
            04 // Alur Kerja 4 Langkah (How It Works)
          </h3>
          <button
            type="button"
            onClick={handleAddStep}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-ink hover:text-accent"
          >
            <Plus className="w-4 h-4" /> Tambah Tahap
          </button>
        </div>

        <SortableContainer
          items={steps}
          onReorder={(newSteps) => {
            setSteps(newSteps);
            saveCommissionSteps(newSteps);
          }}
          renderItem={(step) => (
            <div className="p-4 rounded border border-border bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="text"
                  value={step.step}
                  onChange={(e) => {
                    const updated = steps.map((s) =>
                      s.id === step.id ? { ...s, step: e.target.value } : s
                    );
                    setSteps(updated);
                    saveCommissionSteps(updated);
                  }}
                  className="w-12 px-2 py-1.5 rounded border border-border bg-surface text-center font-serif text-sm font-light text-accent"
                />
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => {
                    const updated = steps.map((s) =>
                      s.id === step.id ? { ...s, title: e.target.value } : s
                    );
                    setSteps(updated);
                    saveCommissionSteps(updated);
                  }}
                  className="w-1/3 px-3 py-1.5 rounded border border-border bg-surface text-xs font-semibold text-ink"
                  placeholder="Judul Tahap"
                />
                <input
                  type="text"
                  value={step.description}
                  onChange={(e) => {
                    const updated = steps.map((s) =>
                      s.id === step.id ? { ...s, description: e.target.value } : s
                    );
                    setSteps(updated);
                    saveCommissionSteps(updated);
                  }}
                  className="flex-1 px-3 py-1.5 rounded border border-border bg-surface text-xs text-ink-secondary"
                  placeholder="Deskripsi ringkas alur kerja..."
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveStep(step.id)}
                className="p-1.5 text-accent hover:text-rose-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      {/* Terms of Service Accordion */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <h3 className="font-serif text-xl font-light text-ink">
              05 // Syarat &amp; Ketentuan Layanan (TOS Accordion)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddTos}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-ink hover:text-accent"
          >
            <Plus className="w-4 h-4" /> Tambah Poin TOS
          </button>
        </div>

        <SortableContainer
          items={tosList}
          onReorder={(newTos) => {
            setTosList(newTos);
            saveCommissionTos(newTos);
          }}
          renderItem={(tos) => (
            <div className="p-4 rounded border border-border bg-bg space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={tos.title}
                  onChange={(e) => {
                    const updated = tosList.map((t) =>
                      t.id === tos.id ? { ...t, title: e.target.value } : t
                    );
                    setTosList(updated);
                    saveCommissionTos(updated);
                  }}
                  className="flex-1 px-3 py-1.5 rounded border border-border bg-surface text-xs font-serif text-sm font-medium text-ink"
                  placeholder="Judul Klausul (misal: Ketentuan Revisi)"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTos(tos.id)}
                  className="p-1 text-accent hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                rows={3}
                value={tos.content.join('\n\n')}
                onChange={(e) => {
                  const paras = e.target.value.split('\n\n').filter((p) => p.trim() !== '');
                  const updated = tosList.map((t) =>
                    t.id === tos.id ? { ...t, content: paras } : t
                  );
                  setTosList(updated);
                  saveCommissionTos(updated);
                }}
                className="w-full px-3 py-2 rounded border border-border bg-surface text-xs text-ink-secondary resize-y"
                placeholder="Isi klausul (gunakan 2 kali Enter untuk memisahkan paragraf)..."
              />
            </div>
          )}
        />
      </div>

      {/* Optional FAQs Editor */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-accent" />
            <h3 className="font-serif text-xl font-light text-ink">
              06 // Pertanyaan Umum (FAQ)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-ink hover:text-accent"
          >
            <Plus className="w-4 h-4" /> Tambah FAQ
          </button>
        </div>

        <SortableContainer
          items={faqs}
          onReorder={(newFaqs) => {
            setFaqs(newFaqs);
            saveCommissionFaqs(newFaqs);
          }}
          renderItem={(faq) => (
            <div className="p-4 rounded border border-border bg-bg space-y-2">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = faqs.map((f) =>
                      f.id === faq.id ? { ...f, question: e.target.value } : f
                    );
                    setFaqs(updated);
                    saveCommissionFaqs(updated);
                  }}
                  className="flex-1 px-3 py-1.5 rounded border border-border bg-surface text-xs font-medium text-ink"
                  placeholder="Pertanyaan klien..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(faq.id)}
                  className="p-1 text-accent hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => {
                  const updated = faqs.map((f) =>
                    f.id === faq.id ? { ...f, answer: e.target.value } : f
                  );
                  setFaqs(updated);
                  saveCommissionFaqs(updated);
                }}
                className="w-full px-3 py-1.5 rounded border border-border bg-surface text-xs text-ink-secondary resize-y"
                placeholder="Jawaban penjelasan..."
              />
            </div>
          )}
        />
      </div>

      {/* Edit Tier Modal */}
      {isTierModalOpen && editingTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-xl w-full rounded-md border border-border bg-bg p-6 sm:p-8 shadow-2xl my-8">
            <h3 className="font-serif text-2xl font-light text-ink mb-1 pb-3 border-b border-border">
              Edit Paket: {editingTier.name}
            </h3>

            <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-2">
              <ImageUploader
                label="Contoh Gambar Tier"
                value={editingTier.image}
                onChange={(url) => setEditingTier({ ...editingTier, image: url })}
                aspectClass="aspect-[4/3]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                    Nama Paket Tier *
                  </label>
                  <input
                    type="text"
                    value={editingTier.name}
                    onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
                    placeholder="Clean Line Art & Tone"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                    Harga Tampilan *
                  </label>
                  <input
                    type="text"
                    value={editingTier.price}
                    onChange={(e) => setEditingTier({ ...editingTier, price: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs font-mono"
                    placeholder="$130 USD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                    Estimasi Pengerjaan
                  </label>
                  <input
                    type="text"
                    value={editingTier.turnaround}
                    onChange={(e) => setEditingTier({ ...editingTier, turnaround: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
                    placeholder="10 – 14 hari kerja"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                    Badge Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    value={editingTier.badge || ''}
                    onChange={(e) => setEditingTier({ ...editingTier, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
                    placeholder="Most Popular"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                  Deskripsi Paket
                </label>
                <textarea
                  rows={2}
                  value={editingTier.description}
                  onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs resize-y"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                  Daftar Fitur Termasuk (Pisahkan dengan baris baru / Enter)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs resize-y"
                  placeholder="Full body character pose&#10;Manga screentones&#10;High-res 300 DPI"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={editingTier.isPopular}
                    onChange={(e) => setEditingTier({ ...editingTier, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-ink"
                  />
                  <span>Tandai sebagai Paket Paling Populer (Border Gelap)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border">
              <button
                type="button"
                onClick={() => setIsTierModalOpen(false)}
                className="px-4 py-2 rounded text-xs uppercase font-medium text-ink hover:bg-surface border border-border"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveTierModal}
                className="px-5 py-2 rounded bg-ink text-bg text-xs uppercase font-medium hover:bg-accent shadow-sm"
              >
                Simpan Tier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingTierId)}
        title="Hapus Paket Komisi?"
        description="Paket harga ini akan dihapus dari daftar opsi komisi website Anda."
        confirmLabel="Ya, Hapus Paket"
        onConfirm={handleDeleteTierConfirm}
        onCancel={() => setDeletingTierId(null)}
      />

      {/* Revert Confirmation */}
      <ConfirmDialog
        isOpen={showRevertModal}
        title="Kembalikan Pengaturan Komisi?"
        description="Semua perubahan draf seksi Komisi akan dibatalkan dan dikembalikan ke versi publikasi terakhir."
        confirmLabel="Ya, Kembalikan"
        isDestructive={false}
        onConfirm={handleRevert}
        onCancel={() => setShowRevertModal(false)}
      />
    </div>
  );
};
