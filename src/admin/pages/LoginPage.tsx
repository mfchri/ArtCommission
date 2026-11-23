import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Lock, Mail, ArrowRight, Loader2, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { login, resetPassword, isMockAuth } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toastError('Harap masukkan email dan kata sandi.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await login(email, password);
    setIsSubmitting(false);

    if (error) {
      toastError(`Gagal masuk: ${error}`);
    } else {
      toastSuccess('Berhasil masuk ke Admin Panel.');
      navigate('/admin');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toastError('Harap masukkan alamat email.');
      return;
    }

    setIsSubmitting(true);
    const { error, message } = await resetPassword(forgotEmail);
    setIsSubmitting(false);

    if (error) {
      toastError(error);
    } else {
      toastSuccess(message || 'Petunjuk reset kata sandi telah dikirim.');
      setShowForgot(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center items-center px-4 py-12 selection:bg-ink selection:text-bg">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block font-serif text-3xl sm:text-4xl font-light text-ink tracking-wide">
            KAIEN // ATELIER
          </Link>
          <p className="text-xs uppercase tracking-widest text-accent font-medium mt-1">
            Panel Pengelola Konten (Mini CMS)
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-md border border-border bg-surface p-6 sm:p-8 shadow-sm">
          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
                  Email Admin
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="artist@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgot(true);
                    }}
                    className="text-[11px] text-accent hover:text-ink transition-colors"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded bg-ink text-bg text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Panel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <h3 className="font-serif text-xl font-light text-ink mb-1">Reset Kata Sandi</h3>
              <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                Masukkan alamat email yang terdaftar pada akun Supabase untuk menerima instruksi pemulihan.
              </p>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="artist@example.com"
                  className="w-full px-3.5 py-2.5 rounded border border-border bg-bg text-ink text-xs sm:text-sm focus:border-ink focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="px-4 py-2.5 rounded border border-border bg-bg text-ink text-xs uppercase tracking-wider font-medium hover:bg-surface transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded bg-ink text-bg text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Tautan'}
                </button>
              </div>
            </form>
          )}

          {/* Mode Notice */}
          <div className="mt-6 pt-5 border-t border-border flex items-start gap-2.5 text-[11px] text-ink-secondary leading-normal">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              {isMockAuth ? (
                <p>
                  <strong>Mode Lokal Aktif:</strong> Kredensial Supabase di <code>.env</code> belum diisi. Anda dapat langsung memasukkan sembarang email dan kata sandi untuk masuk ke simulasi demo offline.
                </p>
              ) : (
                <p>
                  <strong>Supabase Auth Aktif:</strong> Pendaftaran publik dinonaktifkan demi keamanan. Gunakan akun admin yang telah didaftarkan di dashboard Supabase.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-accent hover:text-ink transition-colors font-medium">
            &larr; Kembali ke Halaman Utama Website
          </Link>
        </div>
      </div>
    </div>
  );
};
