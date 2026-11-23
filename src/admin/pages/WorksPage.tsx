import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Eye, EyeOff, Star, Trash2, Edit2, BookOpen } from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SortableContainer } from '../components/SortableList';
import { useToast } from '../components/Toast';
import { getAssetUrl } from '../../utils/assets';
import {
  getWebsiteContent,
  saveArtwork,
  deleteArtwork,
  updateArtworksOrder,
  saveWorkCategories,
  deleteWorkCategory,
  publishArea,
  saveAreaDraft,
  getLocalBundle,
  saveLocalBundle,
} from '../../services/contentService';
import { Artwork, WorkCategoryItem, ComicProject } from '../../types/works';

export const WorksPage: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<WorkCategoryItem[]>([]);
  const [comicProject, setComicProject] = useState<ComicProject | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  // Modal states
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { success: toastSuccess, error: toastError } = useToast();
  const [searchParams] = useSearchParams();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getWebsiteContent(true);
      setArtworks(data.artworks);
      setCategories(data.categories);
      setComicProject(data.comicProject);

      if (searchParams.get('action') === 'new') {
        openNewModal();
      }
    } catch {
      toastError('Gagal memuat galeri karya.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    const defaultCat = categories[1]?.id || 'oc';
    const defaultCatLabel = categories[1]?.label || 'Original Characters';
    setEditingArtwork({
      id: `art-${Date.now()}`,
      title: '',
      year: '2026',
      category: defaultCat,
      categoryLabel: defaultCatLabel,
      image: '',
      aspectClass: 'aspect-[4/5]',
      description: '',
      medium: 'Digital Inking & Sumi Wash',
      dimensions: '3000 × 4000 px',
      featured: false,
      isVisible: true,
      sortOrder: artworks.length,
    });
    setIsModalOpen(true);
  };

  const handleSaveArtworkModal = async () => {
    if (!editingArtwork) return;
    if (!editingArtwork.title.trim()) {
      toastError('Judul karya wajib diisi.');
      return;
    }
    if (!editingArtwork.image) {
      toastError('Harap unggah berkas gambar karya.');
      return;
    }

    try {
      const artworkToSave: Artwork = {
        ...editingArtwork,
        title: editingArtwork.title.trim(),
        isVisible: editingArtwork.isVisible !== false,
        featured: Boolean(editingArtwork.featured),
        sortOrder: editingArtwork.sortOrder ?? artworks.length,
      };

      await saveArtwork(artworkToSave);
      toastSuccess(`Karya "${artworkToSave.title}" berhasil disimpan.`);
      setIsModalOpen(false);
      await loadData();
    } catch {
      toastError('Gagal menyimpan karya.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteArtwork(deletingId);
      toastSuccess('Karya berhasil dihapus dari galeri.');
      setDeletingId(null);
      await loadData();
    } catch {
      toastError('Gagal menghapus karya.');
    }
  };

  const handleReorderArtworks = async (newOrder: Artwork[]) => {
    setArtworks(newOrder);
    setHasChanges(true);
    try {
      await updateArtworksOrder(newOrder);
      toastSuccess('Urutan karya berhasil diperbarui.');
    } catch {
      toastError('Gagal memperbarui urutan karya.');
    }
  };

  const handleToggleVisible = async (art: Artwork) => {
    const isCurrentVisible = art.isVisible !== false && (art as any).is_visible !== false;
    const updated = { ...art, isVisible: !isCurrentVisible };
    await saveArtwork(updated);
    setArtworks((prev) => prev.map((a) => (a.id === art.id ? updated : a)));
    toastSuccess(`Karya "${art.title}" ${!isCurrentVisible ? 'ditampilkan' : 'disembunyikan'}.`);
  };

  const handleToggleFeatured = async (art: Artwork) => {
    const updated = { ...art, featured: !art.featured };
    await saveArtwork(updated);
    setArtworks((prev) => prev.map((a) => (a.id === art.id ? updated : a)));
    toastSuccess(`Status unggulan "${art.title}" berhasil diperbarui.`);
  };

  // Category management
  const handleAddCategory = async () => {
    if (!newCatLabel.trim()) return;
    const catId = newCatLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const updated = [...categories, { id: catId, label: newCatLabel.trim(), sortOrder: categories.length }];
    setCategories(updated);
    setNewCatLabel('');
    setHasChanges(true);
    await saveWorkCategories(updated);
    toastSuccess('Kategori baru berhasil ditambahkan.');
  };

  const handleDeleteCategory = async (id: string) => {
    if (id === 'all') {
      toastError('Kategori "Semua" tidak dapat dihapus.');
      return;
    }
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    setHasChanges(true);
    await deleteWorkCategory(id);
    toastSuccess('Kategori berhasil dihapus.');
  };

  // Comic Project Block Save
  const handleSaveComicProject = async () => {
    if (!comicProject) return;
    try {
      await saveAreaDraft('comic', comicProject);
      setComicProject({ ...comicProject, hasUnpublishedChanges: true });
      setHasChanges(true);
      toastSuccess('Draf proyek komik berhasil disimpan.');
    } catch {
      toastError('Gagal menyimpan proyek komik.');
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      if (comicProject) {
        await saveAreaDraft('comic', comicProject);
      }
      await updateArtworksOrder(artworks);
      await saveWorkCategories(categories);

      const local = getLocalBundle();
      local.artworks = artworks;
      local.categories = categories;
      if (comicProject) {
        local.comicProject = { ...comicProject, hasUnpublishedChanges: true };
      }
      saveLocalBundle(local);

      setComicProject((prev) => (prev ? { ...prev, hasUnpublishedChanges: true } : null));
      setHasChanges(true);
      toastSuccess('Draf galeri karya dan proyek komik berhasil disimpan secara lokal.');
    } catch {
      toastError('Gagal menyimpan draf.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublishAllWorks = async () => {
    setIsPublishing(true);
    try {
      if (comicProject) {
        await publishArea('comic', comicProject);
      }
      await updateArtworksOrder(artworks);
      await saveWorkCategories(categories);

      const local = getLocalBundle();
      local.artworks = artworks;
      local.categories = categories;
      if (comicProject) {
        local.comicProject = { ...comicProject, hasUnpublishedChanges: false };
      }
      saveLocalBundle(local);

      setComicProject((prev) => (prev ? { ...prev, hasUnpublishedChanges: false } : null));
      setHasChanges(false);
      toastSuccess('Seluruh galeri karya dan proyek komik berhasil dipublikasikan!');
    } catch {
      toastError('Gagal mempublikasikan karya.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Filter artworks
  const filteredArtworks = artworks.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedFilterCategory === 'all' || art.category === selectedFilterCategory;
    return matchesSearch && matchesCat;
  });

  if (isLoading || !comicProject) {
    return (
      <div className="py-12 text-center text-xs font-mono uppercase text-ink-secondary">
        Memuat Galeri Karya...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Galeri Karya &amp; Proyek Komik"
        description="Kelola seluruh portfolio ilustrasi, urutan tampilan (drag & drop), kategori filter, dan blok unggulan buku komik."
        hasUnpublishedChanges={hasChanges || Boolean(comicProject?.hasUnpublishedChanges)}
        isSavingDraft={isSavingDraft}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublishAllWorks}
      />

      {/* Featured Comic Project Block Editor */}
      <div className="rounded-md border border-border bg-charcoal text-bg p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-border/20">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-bg">
              Blok Unggulan Proyek Komik (Graphic Novel)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleSaveComicProject}
            className="px-4 py-2 rounded bg-bg text-ink text-xs uppercase tracking-wider font-medium hover:bg-surface transition-colors"
          >
            Simpan Info Komik
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <ImageUploader
              label="Sampul Buku Komik (Cover)"
              value={comicProject.coverImage}
              onChange={(url) => setComicProject({ ...comicProject, coverImage: url })}
              aspectClass="aspect-[3/4]"
            />
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-accent mb-1 font-semibold">
                  Judul Komik
                </label>
                <input
                  type="text"
                  value={comicProject.title}
                  onChange={(e) => setComicProject({ ...comicProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border/30 bg-charcoal-panel text-bg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-accent mb-1 font-semibold">
                  Status Publikasi
                </label>
                <select
                  value={comicProject.status}
                  onChange={(e) => setComicProject({ ...comicProject, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded border border-border/30 bg-charcoal-panel text-bg text-xs"
                >
                  <option value="Ongoing">Ongoing (Sedang Berjalan)</option>
                  <option value="Completed">Completed (Tamat)</option>
                  <option value="Hiatus">Hiatus (Jeda)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-accent mb-1 font-semibold">
                  Volume / Edisi
                </label>
                <input
                  type="text"
                  value={comicProject.volume || ''}
                  onChange={(e) => setComicProject({ ...comicProject, volume: e.target.value })}
                  placeholder="Volume I: Fractured Dawn"
                  className="w-full px-3 py-2 rounded border border-border/30 bg-charcoal-panel text-bg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-accent mb-1 font-semibold">
                  Subjudul / Tagline Komik
                </label>
                <input
                  type="text"
                  value={comicProject.subtitle || ''}
                  onChange={(e) => setComicProject({ ...comicProject, subtitle: e.target.value })}
                  placeholder="A serialized dark fantasy graphic novel"
                  className="w-full px-3 py-2 rounded border border-border/30 bg-charcoal-panel text-bg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-accent mb-1 font-semibold">
                Sinopsis Singkat
              </label>
              <textarea
                rows={3}
                value={comicProject.synopsis}
                onChange={(e) => setComicProject({ ...comicProject, synopsis: e.target.value })}
                className="w-full px-3 py-2 rounded border border-border/30 bg-charcoal-panel text-bg text-xs resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-accent mb-1 font-semibold">
                  Arc / Chapter Terkini
                </label>
                <input
                  type="text"
                  value={comicProject.currentChapter}
                  onChange={(e) => setComicProject({ ...comicProject, currentChapter: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border/30 bg-charcoal-panel text-bg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-accent mb-1 font-semibold">
                  Jadwal Rilis / Penerbitan
                </label>
                <input
                  type="text"
                  value={comicProject.releaseSchedule}
                  onChange={(e) => setComicProject({ ...comicProject, releaseSchedule: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border/30 bg-charcoal-panel text-bg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-accent mb-1 font-semibold">
                  Tautan Baca / Follow (URL / Anchor)
                </label>
                <input
                  type="text"
                  value={comicProject.readUrl || ''}
                  onChange={(e) => setComicProject({ ...comicProject, readUrl: e.target.value })}
                  placeholder="#contact atau https://..."
                  className="w-full px-3 py-2 rounded border border-border/30 bg-charcoal-panel text-bg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-accent mb-1 font-semibold">
                  Catatan Tambahan (Status Halaman)
                </label>
                <input
                  type="text"
                  value={comicProject.notes || ''}
                  onChange={(e) => setComicProject({ ...comicProject, notes: e.target.value })}
                  placeholder="240+ pages completed..."
                  className="w-full px-3 py-2 rounded border border-border/30 bg-charcoal-panel text-bg text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Works Gallery Toolbar */}
      <div className="rounded-md border border-border bg-surface/30 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-xl sm:text-2xl font-light text-ink">
              Daftar Karya Portofolio ({artworks.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="text-xs uppercase tracking-wider text-accent hover:text-ink font-medium underline"
            >
              Kelola Kategori
            </button>
          </div>

          <button
            type="button"
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-ink text-bg text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Karya Baru
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari karya berdasarkan judul atau deskripsi..."
              className="w-full pl-10 pr-4 py-2 rounded border border-border bg-bg text-xs text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-colors ${
                  selectedFilterCategory === cat.id
                    ? 'bg-ink text-bg'
                    : 'bg-bg text-ink-secondary hover:text-ink border border-border'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sortable Works List */}
        {filteredArtworks.length === 0 ? (
          <div className="py-12 text-center text-xs text-ink-secondary border border-dashed border-border rounded">
            Tidak ada karya yang sesuai dengan pencarian atau filter.
          </div>
        ) : (
          <SortableContainer
            items={filteredArtworks}
            onReorder={handleReorderArtworks}
            renderItem={(art) => (
              <div className="p-4 rounded border border-border bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded overflow-hidden bg-charcoal shrink-0 border border-border">
                    <img src={getAssetUrl(art.image)} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-serif text-lg font-light text-ink leading-tight">{art.title}</h4>
                      {art.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase font-mono">
                          <Star className="w-3 h-3 fill-current" /> Unggulan
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink-secondary">
                      <span className="uppercase font-medium">{art.categoryLabel}</span>
                      <span>&bull;</span>
                      <span className="font-mono">{art.year}</span>
                      <span>&bull;</span>
                      <span>{art.medium}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(art)}
                    className={`p-2 rounded border border-border hover:bg-surface transition-colors ${
                      art.featured ? 'text-amber-600 bg-amber-50' : 'text-accent'
                    }`}
                    title={art.featured ? 'Hapus dari karya unggulan' : 'Jadikan karya unggulan'}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleVisible(art)}
                    className={`p-2 rounded border border-border hover:bg-surface transition-colors ${
                      art.isVisible ? 'text-emerald-700' : 'text-accent line-through'
                    }`}
                    title={art.isVisible ? 'Sembunyikan dari publik' : 'Tampilkan ke publik'}
                  >
                    {art.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingArtwork({
                        ...art,
                        isVisible: art.isVisible !== false && (art as any).is_visible !== false,
                        featured: Boolean(art.featured),
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded border border-border hover:bg-surface text-ink transition-colors"
                    title="Edit detail karya"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingId(art.id)}
                    className="p-2 rounded border border-border hover:bg-rose-50 text-accent hover:text-rose-600 transition-colors"
                    title="Hapus karya"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          />
        )}
      </div>

      {/* Add / Edit Artwork Modal */}
      {isModalOpen && editingArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-2xl w-full rounded-md border border-border bg-bg p-6 sm:p-8 shadow-2xl my-8">
            <h3 className="font-serif text-2xl font-light text-ink mb-1 pb-3 border-b border-border">
              {editingArtwork.title ? `Edit: ${editingArtwork.title}` : 'Tambah Karya Baru'}
            </h3>

            <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-2">
              <ImageUploader
                label="Unggah Berkas Gambar Karya"
                value={editingArtwork.image}
                onChange={(url) => setEditingArtwork({ ...editingArtwork, image: url })}
                aspectClass="aspect-[4/3]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                    Judul Karya *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArtwork.title}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, title: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs focus:border-ink focus:outline-none"
                    placeholder="Judul ilustrasi"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                    Kategori Galeri *
                  </label>
                  <select
                    value={editingArtwork.category}
                    onChange={(e) => {
                      const selCat = categories.find((c) => c.id === e.target.value);
                      setEditingArtwork({
                        ...editingArtwork,
                        category: e.target.value,
                        categoryLabel: selCat?.label || e.target.value,
                      });
                    }}
                    className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs focus:border-ink focus:outline-none"
                  >
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.year}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, year: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
                    placeholder="2026"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.medium}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, medium: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
                    placeholder="Sumi Ink & Digital Wash"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                    Dimensi
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.dimensions || ''}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, dimensions: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs"
                    placeholder="3000 × 4000 px"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1">
                  Deskripsi Cerita / Konsep
                </label>
                <textarea
                  rows={3}
                  value={editingArtwork.description}
                  onChange={(e) => setEditingArtwork({ ...editingArtwork, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border bg-surface text-ink text-xs resize-y"
                  placeholder="Catatan konsep karakter orisinal atau proses pengerjaan..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArtwork.featured)}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-ink"
                  />
                  <span>Tandai sebagai Karya Unggulan (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={editingArtwork.isVisible !== false}
                    onChange={(e) => setEditingArtwork({ ...editingArtwork, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded text-ink"
                  />
                  <span>Tampilkan di Galeri Publik</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded text-xs uppercase font-medium text-ink hover:bg-surface border border-border"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveArtworkModal}
                className="px-5 py-2 rounded bg-ink text-bg text-xs uppercase font-medium hover:bg-accent shadow-sm"
              >
                Simpan Karya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
          <div className="relative max-w-md w-full rounded-md border border-border bg-bg p-6 shadow-xl">
            <h3 className="font-serif text-xl font-light text-ink mb-4 pb-2 border-b border-border">
              Kelola Kategori Galeri
            </h3>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3 rounded border border-border bg-surface flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-ink block">{cat.label}</span>
                    <span className="text-[10px] font-mono text-accent">ID: {cat.id}</span>
                  </div>
                  {cat.id !== 'all' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-accent hover:text-rose-600 p-1"
                      title="Hapus kategori"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                placeholder="Nama kategori baru..."
                className="flex-1 px-3 py-2 rounded border border-border bg-surface text-xs text-ink"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 rounded bg-ink text-bg text-xs uppercase font-medium hover:bg-accent"
              >
                Tambah
              </button>
            </div>

            <div className="text-right pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded text-xs uppercase font-medium text-ink hover:bg-surface border border-border"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Hapus Karya dari Galeri?"
        description="Karya ini akan dihapus secara permanen dari daftar galeri portofolio Anda."
        confirmLabel="Ya, Hapus Karya"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
