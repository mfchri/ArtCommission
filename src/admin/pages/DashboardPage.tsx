import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Palette,
  Briefcase,
  Inbox,
  Clock,
  CheckCircle,
  Plus,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { getWebsiteContent, fetchMessages, publishArea } from '../../services/contentService';
import { WebsiteDataBundle } from '../../types/cms';
import { ContactMessage } from '../../types/contact';
import { useToast } from '../components/Toast';

export const DashboardPage: React.FC = () => {
  const [bundle, setBundle] = useState<WebsiteDataBundle | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success: toastSuccess, error: toastError } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [contentData, msgList] = await Promise.all([
        getWebsiteContent(true),
        fetchMessages(),
      ]);
      setBundle(contentData);
      setMessages(msgList);
    } catch (e: any) {
      toastError('Gagal memuat ringkasan dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleCommissions = async () => {
    if (!bundle) return;
    const newStatus = !bundle.commissionsConfig.isOpen;
    const updated = { ...bundle.commissionsConfig, isOpen: newStatus };
    setBundle({ ...bundle, commissionsConfig: updated });

    try {
      await publishArea('commissions', updated);
      toastSuccess(`Status komisi berhasil diubah menjadi: ${newStatus ? 'TERBUKA' : 'DITUTUP'}`);
    } catch {
      toastError('Gagal memperbarui status komisi.');
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (isLoading || !bundle) {
    return (
      <div className="py-12 text-center text-ink-secondary text-xs uppercase tracking-widest font-mono">
        Memuat Ringkasan Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-md bg-surface border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent font-mono block mb-1">
            Selamat Datang, {bundle.siteSettings.artistName}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-ink">
            Ringkasan Studio &amp; Website
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Kelola karya, pantau komisi yang sedang berjalan, dan tanggapi pesan masuk langsung dari browser Anda.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={import.meta.env.BASE_URL || '/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-bg border border-border text-xs uppercase tracking-wider font-medium text-ink hover:bg-surface transition-colors"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
          </a>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Status Komisi */}
        <div className="p-5 rounded border border-border bg-surface/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-secondary mb-2">
            <span className="uppercase tracking-wider font-semibold">Status Komisi</span>
            <Briefcase className="w-4 h-4 text-accent" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                bundle.commissionsConfig.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-accent'
              }`}
            />
            <span className="font-serif text-2xl font-light text-ink">
              {bundle.commissionsConfig.isOpen ? 'Terbuka (Open)' : 'Ditutup (Closed)'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
            <span className="text-ink-secondary font-mono">
              {bundle.commissionsConfig.slotsAvailable} / {bundle.commissionsConfig.slotsTotal} Slot
            </span>
            <button
              type="button"
              onClick={handleToggleCommissions}
              className="text-xs text-accent hover:text-ink font-medium underline"
            >
              Ubah Status
            </button>
          </div>
        </div>

        {/* 2. Jumlah Karya */}
        <div className="p-5 rounded border border-border bg-surface/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-secondary mb-2">
            <span className="uppercase tracking-wider font-semibold">Galeri Karya</span>
            <Palette className="w-4 h-4 text-accent" />
          </div>
          <div className="font-serif text-3xl font-light text-ink mb-1">
            {bundle.artworks.length}
            <span className="text-xs font-sans text-ink-secondary ml-1.5 font-normal">Karya</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
            <span className="text-ink-secondary">
              {bundle.artworks.filter((a) => a.isVisible).length} Ditampilkan
            </span>
            <Link to="/admin/works" className="text-xs text-accent hover:text-ink font-medium">
              Kelola &rarr;
            </Link>
          </div>
        </div>

        {/* 3. Pesan Masuk */}
        <div className="p-5 rounded border border-border bg-surface/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-secondary mb-2">
            <span className="uppercase tracking-wider font-semibold">Kotak Masuk</span>
            <Inbox className="w-4 h-4 text-accent" />
          </div>
          <div className="font-serif text-3xl font-light text-ink mb-1">
            {unreadCount}
            <span className="text-xs font-sans text-ink-secondary ml-1.5 font-normal">Belum Dibaca</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
            <span className="text-ink-secondary font-mono">{messages.length} Total Pesan</span>
            <Link to="/admin/messages" className="text-xs text-accent hover:text-ink font-medium">
              Buka Inbox &rarr;
            </Link>
          </div>
        </div>

        {/* 4. Publikasi Terakhir */}
        <div className="p-5 rounded border border-border bg-surface/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-secondary mb-2">
            <span className="uppercase tracking-wider font-semibold">Publikasi Terakhir</span>
            <Clock className="w-4 h-4 text-accent" />
          </div>
          <div className="font-serif text-lg font-light text-ink mb-1 truncate">
            {bundle.siteSettings.publishedAt
              ? new Date(bundle.siteSettings.publishedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Belum pernah'}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
            <span className="text-emerald-700 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Siap Online
            </span>
            <Link to="/admin/site-settings" className="text-xs text-accent hover:text-ink font-medium">
              Pengaturan &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="rounded-md border border-border bg-surface/30 p-6">
        <h3 className="font-serif text-xl font-light text-ink mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/works?action=new"
            className="p-4 rounded border border-border bg-bg hover:bg-surface transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-semibold text-ink uppercase tracking-wider mb-0.5">
                Tambah Karya Baru
              </div>
              <p className="text-[11px] text-ink-secondary">Unggah ilustrasi, atur kategori &amp; deskripsi</p>
            </div>
            <Plus className="w-4 h-4 text-accent group-hover:text-ink transition-colors" />
          </Link>

          <Link
            to="/admin/commissions"
            className="p-4 rounded border border-border bg-bg hover:bg-surface transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-semibold text-ink uppercase tracking-wider mb-0.5">
                Kelola Harga &amp; Slot
              </div>
              <p className="text-[11px] text-ink-secondary">Atur 3 tier harga, syarat, dan antrean</p>
            </div>
            <ChevronRight className="w-4 h-4 text-accent group-hover:text-ink transition-colors" />
          </Link>

          <Link
            to="/admin/messages"
            className="p-4 rounded border border-border bg-bg hover:bg-surface transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-semibold text-ink uppercase tracking-wider mb-0.5">
                Balas Pesan Klien
              </div>
              <p className="text-[11px] text-ink-secondary">Lihat rincian brief karakter &amp; link referensi</p>
            </div>
            <ChevronRight className="w-4 h-4 text-accent group-hover:text-ink transition-colors" />
          </Link>
        </div>
      </div>

      {/* Recent Messages Preview */}
      <div className="rounded-md border border-border bg-surface/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-light text-ink">Pesan Masuk Terbaru</h3>
          <Link to="/admin/messages" className="text-xs uppercase tracking-wider text-accent hover:text-ink font-medium">
            Lihat Semua Pesan ({messages.length})
          </Link>
        </div>

        {messages.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-secondary border border-dashed border-border rounded">
            Belum ada pesan masuk dari pengunjung.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded border border-border bg-bg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.isRead && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                    <span className="font-semibold text-ink">{msg.name}</span>
                    <span className="text-accent">&bull;</span>
                    <span className="font-mono text-ink-secondary">{msg.email}</span>
                  </div>
                  <p className="text-ink-secondary line-clamp-1">{msg.message}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-ink-secondary">
                    {new Date(msg.createdAt).toLocaleDateString('id-ID')}
                  </span>
                  <Link
                    to="/admin/messages"
                    className="px-3 py-1.5 rounded bg-surface border border-border text-ink hover:bg-surface-muted transition-colors font-medium"
                  >
                    Buka
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
