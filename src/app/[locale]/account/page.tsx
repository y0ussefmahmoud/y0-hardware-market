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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{tAccount('loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push(`/${locale}/auth/login`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">{tAccount('myAccount')}</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="border-b">
              <nav className="flex space-x-8 rtl:space-x-reverse">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-4 font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tAccount('profile')}
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-4 font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tAccount('myOrders')}
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-3xl text-purple-600"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {user?.first_name} {user?.last_name}
                      </h2>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">{tAuth('firstName')}</label>
                      <input
                        type="text"
                        defaultValue={user?.first_name}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">{tAuth('lastName')}</label>
                      <input
                        type="text"
                        defaultValue={user?.last_name}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">{tAuth('email')}</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">{tAccount('role')}</label>
                      <input
                        type="text"
                        defaultValue={user?.role === 'admin' ? tAccount('admin') : tAccount('user')}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4 rtl:space-x-reverse">
                    <button
                      onClick={logout}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {tAuth('logout')}
                    </button>
                    {user?.role === 'admin' && (
                      <Link
                        href={`/${locale}/admin`}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        {tAccount('dashboard')}
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="text-center py-12">
                  <i className="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 mb-4">{tAccount('noOrders')}</p>
                  <Link
                    href={`/${locale}/orders`}
                    className="inline-block text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    {tAccount('myOrders')}
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
