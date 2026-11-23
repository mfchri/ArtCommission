import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  User,
  Palette,
  Briefcase,
  Mail,
  Inbox,
  Image as ImageIcon,
  Database,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/site-settings', label: 'Pengaturan Situs', icon: Settings },
  { to: '/admin/intro', label: 'Intro (Hero)', icon: Sparkles },
  { to: '/admin/profile', label: 'Profil Artist', icon: User },
  { to: '/admin/works', label: 'Karya & Galeri', icon: Palette },
  { to: '/admin/commissions', label: 'Komisi', icon: Briefcase },
  { to: '/admin/contact', label: 'Kontak & Sosial', icon: Mail },
  { to: '/admin/messages', label: 'Kotak Masuk', icon: Inbox },
  { to: '/admin/media', label: 'Pustaka Media', icon: ImageIcon },
  { to: '/admin/backup', label: 'Cadangan & Ekspor', icon: Database },
];

export const AdminLayout: React.FC = () => {
  const { user, logout, isMockAuth } = useAuth();
  const navigate = useNavigate();
  const { success: toastSuccess } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toastSuccess('Anda telah keluar dari sesi admin.');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col md:flex-row antialiased font-sans selection:bg-ink selection:text-bg">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-surface border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl font-light text-ink">KAIEN</span>
          <span className="text-[10px] tracking-widest font-mono text-accent uppercase px-1.5 py-0.5 rounded bg-bg border border-border">
            ADMIN
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded hover:bg-bg transition-colors"
          aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Left Sidebar & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col justify-between transition-transform duration-300 ease-editorial ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand header */}
          <div className="p-6 border-b border-border/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-serif text-2xl font-light tracking-wide text-ink block">
                  KAIEN // CMS
                </span>
                <span className="text-[11px] text-ink-secondary tracking-widest uppercase">
                  Panel Kelola Website
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden text-accent hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Connection badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-bg border border-border text-ink-secondary">
              <span className={`w-1.5 h-1.5 rounded-full ${isMockAuth ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span>{isMockAuth ? 'Lokal (Standalone)' : 'Supabase Terhubung'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1" aria-label="Menu Admin">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'bg-ink text-bg font-semibold shadow-sm'
                      : 'text-ink-secondary hover:text-ink hover:bg-bg'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Quick links & user panel */}
          <div className="p-4 border-t border-border/80 space-y-2 bg-surface/50">
            <a
              href={import.meta.env.BASE_URL || '/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 rounded text-xs font-medium text-ink bg-bg border border-border hover:bg-surface transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
                Lihat Website (Live)
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Aktif
              </span>
            </a>

            <a
              href={`${import.meta.env.BASE_URL || '/'}?preview=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 rounded text-xs font-medium text-ink bg-bg border border-border hover:bg-surface transition-colors"
            >
              <span className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-accent" />
                Pratinjau Draf
              </span>
              <ExternalLink className="w-3 h-3 text-accent" />
            </a>

            <div className="pt-2 flex items-center justify-between text-xs text-ink-secondary px-1">
              <span className="truncate max-w-[130px] font-mono text-[11px]">
                {user?.email || 'artist@example.com'}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-accent hover:text-rose-600 transition-colors p-1"
                title="Keluar (Logout)"
                aria-label="Keluar sesi"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 md:p-10 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
