// ===== Account Page =====
// User account and profile page
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function AccountPage() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const tAccount = useTranslations('account');
  const tAuth = useTranslations('auth');
  const tCart = useTranslations('cart');
  const [activeTab, setActiveTab] = useState('profile');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-container/20 border-t-primary-container mx-auto"></div>
          <p className="mt-4 text-on-surface-variant font-mono text-xs">{tAccount('loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push(`/${locale}/auth/login`);
    return null;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono text-xs uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              <span>OPERATOR TERMINAL</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-mono">{tAccount('myAccount')}</h1>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-outline-variant/20 px-6">
              <nav className="flex space-x-8 rtl:space-x-reverse font-mono text-xs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === 'profile'
                      ? 'text-primary-container border-b-2 border-primary-container'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  // {tAccount('profile')}
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === 'orders'
                      ? 'text-primary-container border-b-2 border-primary-container'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  // {tAccount('myOrders')}
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center space-x-5 rtl:space-x-reverse mb-8">
                    <div className="w-16 h-16 bg-surface-container border border-outline-variant/40 rounded-2xl flex items-center justify-center text-primary-container text-2xl shadow-inner">
                      <i className="fas fa-user-shield"></i>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-mono text-on-surface">
                        {user?.first_name} {user?.last_name}
                      </h2>
                      <p className="text-on-surface-variant font-mono text-xs mt-0.5">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('firstName')}</label>
                      <input
                        type="text"
                        defaultValue={user?.first_name}
                        className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm opacity-80 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('lastName')}</label>
                      <input
                        type="text"
                        defaultValue={user?.last_name}
                        className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm opacity-80 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('email')}</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm opacity-80 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAccount('role')}</label>
                      <input
                        type="text"
                        defaultValue={user?.role === 'admin' ? tAccount('admin') : tAccount('user')}
                        className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-primary-container font-mono text-sm uppercase opacity-90 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-wrap gap-4">
                    <button
                      onClick={logout}
                      className="bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 px-6 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      {tAuth('logout')}
                    </button>
                    {user?.role === 'admin' && (
                      <Link
                        href={`/${locale}/admin`}
                        className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-gauge text-xs"></i>
                        <span>{tAccount('dashboard')}</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="text-center py-12">
                  <i className="fas fa-shopping-bag text-4xl text-outline-variant/40 mb-4"></i>
                  <p className="text-on-surface-variant font-mono text-xs mb-4">{tAccount('noOrders')}</p>
                  <Link
                    href={`/${locale}/orders`}
                    className="inline-block text-primary-container hover:underline font-mono text-xs uppercase tracking-wider font-semibold"
                  >
                    {tAccount('myOrders')} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
