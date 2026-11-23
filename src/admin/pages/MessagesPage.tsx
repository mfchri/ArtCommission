import React, { useState, useEffect } from 'react';
import { Mail, Search, Trash2, CheckCircle2, Clock, ExternalLink, Reply, Info } from 'lucide-react';
import { fetchMessages, markMessageRead, deleteMessage } from '../../services/contentService';
import { ContactMessage } from '../../types/contact';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { success: toastSuccess, error: toastError } = useToast();

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch {
      toastError('Gagal memuat kotak pesan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      await markMessageRead(msg.id, true);
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
    }
  };

  const handleToggleRead = async (e: React.MouseEvent, msg: ContactMessage) => {
    e.stopPropagation();
    const newStatus = !msg.isRead;
    await markMessageRead(msg.id, newStatus);
    setMessages(messages.map((m) => (m.id === msg.id ? { ...m, isRead: newStatus } : m)));
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...selectedMessage, isRead: newStatus });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteMessage(deletingId);
      setMessages(messages.filter((m) => m.id !== deletingId));
      if (selectedMessage?.id === deletingId) {
        setSelectedMessage(null);
      }
      toastSuccess('Pesan berhasil dihapus dari kotak masuk.');
    } catch {
      toastError('Gagal menghapus pesan.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleReplyMailto = (msg: ContactMessage) => {
    const subject = encodeURIComponent(`Re: Inquiry Komisi [${msg.commissionType}] - ${msg.name}`);
    const body = encodeURIComponent(
      `Halo ${msg.name},\n\nTerima kasih telah menghubungi saya mengenai pesanan komisi (${msg.commissionType}).\n\n[Tuliskan balasan Anda di sini]\n\n---\nPesan Asli Anda:\n"${msg.message}"`
    );
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || m.commissionType === filterType;
    return matchesSearch && matchesType;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-3xl font-light text-ink">Kotak Masuk (Messages Inbox)</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-mono font-semibold">
                {unreadCount} Belum Dibaca
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Semua pertanyaan dan formulir permohonan komisi dari pengunjung website tersimpan di sini.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          className="px-3.5 py-2 rounded border border-border bg-surface text-ink text-xs uppercase tracking-wider font-medium hover:bg-surface-muted"
        >
          Muat Ulang Pesan
        </button>
      </div>

      {/* Optional Email Notification Notice Callout */}
      <div className="p-4 rounded border border-border bg-surface/50 text-xs text-ink-secondary flex items-start gap-3">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-ink">
            Ingin Menerima Notifikasi Email Langsung Saat Ada Pesan Baru?
          </p>
          <p className="leading-relaxed">
            Secara default, pesan tersimpan aman di database ini. Jika ingin notifikasi instan masuk ke inbox email Anda, Anda cukup mengaktifkan <strong>Supabase Database Webhooks</strong> (menghubungkan tabel <code>contact_messages</code> ke layanan seperti Resend, Formspree, atau Zapier), atau mengonfigurasi variabel <code>VITE_FORMSPREE_ENDPOINT</code> di <code>.env</code>.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama klien, email, atau isi brief..."
            className="w-full pl-10 pr-4 py-2 rounded border border-border bg-bg text-xs text-ink focus:border-ink focus:outline-none"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded border border-border bg-bg text-xs text-ink focus:border-ink focus:outline-none"
        >
          <option value="all">Semua Jenis Komisi</option>
          <option value="sketch">Rough Ink Sketch</option>
          <option value="lineart">Clean Line Art &amp; Tone</option>
          <option value="render">Full Illustrative Render</option>
          <option value="comic">Comic / Sequential</option>
          <option value="commercial">Commercial Licensing</option>
          <option value="other">Lainnya / Umum</option>
        </select>
      </div>

      {/* Split Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List (5 cols) */}
        <div className="lg:col-span-5 rounded-md border border-border bg-surface/30 overflow-hidden divide-y divide-border/60 max-h-[650px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs font-mono text-ink-secondary">Memuat data pesan...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-secondary">
              Tidak ada pesan yang ditemukan.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-surface border-l-2 border-l-ink'
                      : !msg.isRead
                      ? 'bg-bg/90 font-medium hover:bg-surface/50'
                      : 'bg-bg hover:bg-surface/50 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                      <span className="text-xs font-semibold text-ink truncate max-w-[140px]">
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-ink-secondary shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-accent mb-1 truncate">
                    Tier: {msg.commissionType}
                  </div>

                  <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Message Detail (7 cols) */}
        <div className="lg:col-span-7 rounded-md border border-border bg-bg p-6 sm:p-8 min-h-[400px]">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-2xl font-light text-ink">{selectedMessage.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-surface border border-border text-ink-secondary">
                      {selectedMessage.commissionType}
                    </span>
                  </div>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs font-mono text-accent hover:text-ink underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedMessage.email}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleToggleRead(e, selectedMessage)}
                    className="p-2 rounded border border-border hover:bg-surface text-ink text-xs flex items-center gap-1"
                    title={selectedMessage.isRead ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingId(selectedMessage.id)}
                    className="p-2 rounded border border-border hover:bg-rose-50 text-accent hover:text-rose-600"
                    title="Hapus pesan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReplyMailto(selectedMessage)}
                    className="px-3 py-1.5 rounded bg-ink text-bg text-xs uppercase tracking-wider font-medium hover:bg-accent flex items-center gap-1.5 shadow-sm"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Balas</span>
                  </button>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs text-ink-secondary font-mono">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>
                  Diterima pada:{' '}
                  {new Date(selectedMessage.createdAt).toLocaleString('id-ID', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </span>
              </div>

              {/* Character Reference Link */}
              {selectedMessage.referenceUrl && (
                <div className="p-3 rounded border border-border bg-surface/50 text-xs flex items-center justify-between">
                  <span className="text-ink-secondary">Link Referensi Visual Karakter:</span>
                  <a
                    href={selectedMessage.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink font-mono font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Buka Tautan Klien</span>
                    <ExternalLink className="w-3.5 h-3.5 text-accent" />
                  </a>
                </div>
              )}

              {/* Message Body */}
              <div className="pt-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-accent mb-2">
                  Isi Pesan &amp; Brief Proyek:
                </label>
                <div className="p-4 rounded border border-border bg-surface/20 text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center text-xs text-ink-secondary">
              <Mail className="w-8 h-8 text-accent mb-2 opacity-40" />
              <p>Pilih pesan dari daftar di samping untuk membaca detail brief dan membalas klien.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Hapus Pesan Masuk?"
        description="Pesan ini akan dihapus secara permanen dari kotak masuk portofolio Anda."
        confirmLabel="Ya, Hapus"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
