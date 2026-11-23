import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { WebsiteDataProvider, useWebsiteData } from './context/WebsiteDataContext';
import { AuthProvider } from './admin/context/AuthContext';
import { ToastProvider } from './admin/components/Toast';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { Loader2, Eye, ArrowLeft } from 'lucide-react';

// Public Components (Eagerly loaded for fast public LCP)
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { ProfileSection } from './sections/ProfileSection';
import { WorksSection } from './sections/WorksSection';
import { CommissionsSection } from './sections/CommissionsSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './components/Footer';

// Code-split / Lazy-loaded Admin Panel
const AdminLayout = lazy(() => import('./admin/components/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const LoginPage = lazy(() => import('./admin/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const SiteSettingsPage = lazy(() => import('./admin/pages/SiteSettingsPage').then((m) => ({ default: m.SiteSettingsPage })));
const IntroPage = lazy(() => import('./admin/pages/IntroPage').then((m) => ({ default: m.IntroPage })));
const ProfilePage = lazy(() => import('./admin/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const WorksPage = lazy(() => import('./admin/pages/WorksPage').then((m) => ({ default: m.WorksPage })));
const CommissionsPage = lazy(() => import('./admin/pages/CommissionsPage').then((m) => ({ default: m.CommissionsPage })));
const ContactSocialsPage = lazy(() => import('./admin/pages/ContactSocialsPage').then((m) => ({ default: m.ContactSocialsPage })));
const MessagesPage = lazy(() => import('./admin/pages/MessagesPage').then((m) => ({ default: m.MessagesPage })));
const MediaPage = lazy(() => import('./admin/pages/MediaPage').then((m) => ({ default: m.MediaPage })));
const BackupPage = lazy(() => import('./admin/pages/BackupPage').then((m) => ({ default: m.BackupPage })));

const AdminLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-ink">
    <Loader2 className="w-7 h-7 animate-spin text-accent mb-3" />
    <span className="font-serif text-lg font-light text-ink tracking-wide">Memuat Modul Admin...</span>
  </div>
);

const PublicPortfolio: React.FC = () => {
  const { data, isPreview } = useWebsiteData();
  const { siteSettings } = data;
  const { sectionVisibility } = siteSettings;

  // Sinkronisasi dinamis judul halaman browser & meta tags saat Pengaturan Situs diperbarui
  useEffect(() => {
    if (siteSettings.siteTitle) {
      document.title = siteSettings.siteTitle;
    }
    if (siteSettings.metaDescription) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', siteSettings.metaDescription);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', siteSettings.metaDescription);
      const twDesc = document.querySelector('meta[property="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', siteSettings.metaDescription);
    }
    if (siteSettings.siteTitle) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', siteSettings.siteTitle);
      const twTitle = document.querySelector('meta[property="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', siteSettings.siteTitle);
    }
    if (siteSettings.ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', siteSettings.ogImage);
      const twImg = document.querySelector('meta[property="twitter:image"]');
      if (twImg) twImg.setAttribute('content', siteSettings.ogImage);
    }
    if (siteSettings.faviconSvg && siteSettings.faviconSvg.startsWith('<svg')) {
      const faviconLink = document.querySelector('link[rel="icon"]');
      if (faviconLink) {
        faviconLink.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(siteSettings.faviconSvg)}`);
      }
    }
  }, [siteSettings]);

  return (
    <div className="min-h-screen bg-bg text-ink relative selection:bg-ink selection:text-bg">
      {/* Subtle organic paper grain overlay */}
      <div className="paper-grain" aria-hidden="true" />

      {/* Preview Mode Notification Banner */}
      {isPreview && (
        <div className="sticky top-0 z-[60] bg-charcoal text-bg px-4 py-2 text-xs flex items-center justify-between shadow-md border-b border-border/20">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">
              Mode Pratinjau Draf Aktif — Menampilkan perubahan draf yang belum dipublikasikan ke publik.
            </span>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-bg text-ink font-medium hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Kembali ke Admin</span>
          </Link>
        </div>
      )}

      {/* Sticky Blurred Off-White Navigation Bar */}
      <Navbar />

      {/* Main Content Sections respecting Admin visibility settings */}
      <main>
        {sectionVisibility.intro && <HeroSection />}
        {sectionVisibility.profile && <ProfileSection />}
        {sectionVisibility.works && <WorksSection />}
        {sectionVisibility.commissions && <CommissionsSection />}
        {sectionVisibility.contact && <ContactSection />}
      </main>

      {/* Semantic Footer */}
      <Footer />
    </div>
  );
};

const rawBase = import.meta.env.BASE_URL || '/';
const routerBasename = rawBase === './' || rawBase === '.' || rawBase === '/' ? undefined : rawBase.replace(/\/$/, '');

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={routerBasename}>
      <WebsiteDataProvider>
        <AuthProvider>
          <ToastProvider>
            <Suspense fallback={<AdminLoadingFallback />}>
              <Routes>
                {/* Public Website Route */}
                <Route path="/" element={<PublicPortfolio />} />

                {/* Admin Login */}
                <Route path="/admin/login" element={<LoginPage />} />

                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="site-settings" element={<SiteSettingsPage />} />
                    <Route path="intro" element={<IntroPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="works" element={<WorksPage />} />
                    <Route path="commissions" element={<CommissionsPage />} />
                    <Route path="contact" element={<ContactSocialsPage />} />
                    <Route path="messages" element={<MessagesPage />} />
                    <Route path="media" element={<MediaPage />} />
                    <Route path="backup" element={<BackupPage />} />
                  </Route>
                </Route>

                {/* Fallback Catch-all Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </WebsiteDataProvider>
    </BrowserRouter>
  );
};

export default App;
