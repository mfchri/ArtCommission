import React, { useState } from 'react';
import { Search, Copy, Check, ExternalLink } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { useToast } from '../components/Toast';
import { getAssetUrl } from '../../utils/assets';

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  dimensions?: string;
  category?: string;
}

// Built-in static assets + dynamically uploaded assets
const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  { id: 'm-1', name: 'reference.png (Hero Illustration)', url: '/assets/reference.png', dimensions: '1024 × 1024', category: 'Hero & Works' },
  { id: 'm-2', name: 'comic-cover.svg (Echoes of the Abyss)', url: '/assets/comic-cover.svg', dimensions: '600 × 850', category: 'Comic Cover' },
  { id: 'm-3', name: 'avatar.svg (Artist Atelier Portrait)', url: '/assets/avatar.svg', dimensions: '400 × 400', category: 'Profile' },
  { id: 'm-4', name: 'artwork-oc-1.svg (The Blind Oracle)', url: '/assets/artwork-oc-1.svg', dimensions: '700 × 900', category: 'Original Characters' },
  { id: 'm-5', name: 'artwork-oc-2.svg (Wanderer of Ash)', url: '/assets/artwork-oc-2.svg', dimensions: '700 × 700', category: 'Original Characters' },
  { id: 'm-6', name: 'artwork-sketch-1.svg (Claw Tendon Study)', url: '/assets/artwork-sketch-1.svg', dimensions: '700 × 700', category: 'Sketches' },
  { id: 'm-7', name: 'artwork-sketch-2.svg (Monolith Sentinel)', url: '/assets/artwork-sketch-2.svg', dimensions: '700 × 900', category: 'Sketches' },
  { id: 'm-8', name: 'artwork-comm-1.svg (Lord of Crows)', url: '/assets/artwork-comm-1.svg', dimensions: '700 × 850', category: 'Commissions' },
  { id: 'm-9', name: 'artwork-comm-2.svg (Astral Huntress)', url: '/assets/artwork-comm-2.svg', dimensions: '700 × 850', category: 'Commissions' },
  { id: 'm-10', name: 'tier-sketch.svg', url: '/assets/tier-sketch.svg', dimensions: '400 × 300', category: 'Commission Tiers' },
  { id: 'm-11', name: 'tier-lineart.svg', url: '/assets/tier-lineart.svg', dimensions: '400 × 300', category: 'Commission Tiers' },
  { id: 'm-12', name: 'tier-render.svg', url: '/assets/tier-render.svg', dimensions: '400 × 300', category: 'Commission Tiers' },
];

export const MediaPage: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>(DEFAULT_MEDIA_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newUploadedUrl, setNewUploadedUrl] = useState('');
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const { success: toastSuccess } = useToast();

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    toastSuccess(`Tautan "${asset.name}" disalin ke clipboard!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddNewUpload = (url: string) => {
    if (!url) return;
    const newAsset: MediaAsset = {
      id: `media-upload-${Date.now()}`,
      name: `Upload Baru (${new Date().toLocaleTimeString('id-ID')})`,
      url,
      dimensions: 'Custom',
      category: 'Unggahan Baru',
    };
    setAssets([newAsset, ...assets]);
    setNewUploadedUrl('');
    toastSuccess('Gambar berhasil ditambahkan ke pustaka media.');
  };

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-ink mb-1">
            Pustaka Media (Media Library)
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Koleksi seluruh aset ilustrasi, sampul komik, dan berkas gambar portofolio.
          </p>
        </div>
      </div>

      {/* Upload New Box */}
      <div className="rounded-md border border-border bg-surface/30 p-6">
        <h3 className="font-serif text-xl font-light text-ink mb-3">
          Unggah Aset Gambar Baru
        </h3>
        <ImageUploader
          label="Pilih atau Tarik Berkas Gambar"
          value={newUploadedUrl}
          onChange={handleAddNewUpload}
          aspectClass="aspect-[16/6]"
        />
      </div>

      {/* Search Toolbar */}
      <div className="relative">
        <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari gambar berdasarkan nama file atau kategori..."
          className="w-full pl-10 pr-4 py-2.5 rounded border border-border bg-bg text-xs text-ink focus:border-ink focus:outline-none"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="group rounded border border-border bg-surface overflow-hidden flex flex-col justify-between hover:border-accent transition-all shadow-sm"
          >
            <div
              className="relative aspect-square w-full bg-charcoal overflow-hidden cursor-pointer"
              onClick={() => setPreviewAsset(asset)}
            >
              <img
                src={getAssetUrl(asset.url)}
                alt={asset.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-bg text-xs">
                Klik untuk Pratinjau
              </div>
            </div>

            <div className="p-3 bg-bg flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-accent block mb-0.5">
                  {asset.category || 'Asset'}
                </span>
                <h4 className="text-xs font-medium text-ink truncate mb-1" title={asset.name}>
                  {asset.name}
                </h4>
                {asset.dimensions && (
                  <span className="text-[10px] text-ink-secondary font-mono block mb-2">
                    {asset.dimensions}
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-ink hover:text-accent"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-accent" />
                      <span>Salin URL</span>
                    </>
                  )}
                </button>

                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-ink p-1"
                  title="Buka gambar di tab baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/85 backdrop-blur-md"
          onClick={() => setPreviewAsset(null)}
        >
          <div
            className="max-w-3xl w-full bg-charcoal border border-border/30 rounded-md overflow-hidden p-4 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getAssetUrl(previewAsset.url)}
              alt={previewAsset.name}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded"
            />
            <div className="w-full flex items-center justify-between pt-3 text-xs text-bg border-t border-border/20 mt-3">
              <div>
                <span className="font-medium text-surface block">{previewAsset.name}</span>
                <span className="font-mono text-accent text-[11px]">{previewAsset.url}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="px-3 py-1.5 rounded bg-surface/20 text-bg hover:bg-surface/40"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
