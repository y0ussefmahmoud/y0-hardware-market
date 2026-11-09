// ===== Register Page =====
// User registration page
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const tAuth = useTranslations('auth');
  const tSite = useTranslations('site');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === 'success') {
        router.push(`/${locale}`);
      } else {
        setError(data.message || tAuth('registerError'));
      }
    } catch (err) {
      setError(tAuth('serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-16 px-4">
      <div className="max-w-md w-full">
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono text-xs uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              <span>ACCOUNT CREATION</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-on-surface mb-2 font-mono">{tSite('name')}</h1>
            <p className="text-on-surface-variant font-mono text-xs">{tAuth('register')}</p>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-500/40 text-red-400 font-mono text-xs px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('firstName')}</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('lastName')}</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('email')}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('phone')}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('password')}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? tAuth('registering') : tAuth('createAccount')}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-outline-variant/20 pt-4">
            <p className="text-on-surface-variant font-mono text-xs">
              {tAuth('haveAccount')}{' '}
              <Link href={`/${locale}/auth/login`} className="text-primary-container hover:underline font-bold">
                {tAuth('signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
