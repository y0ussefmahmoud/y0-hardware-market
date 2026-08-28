// ===== Header Component =====
// Main navigation header for the e-commerce site
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const tAccount = useTranslations('account');
  const { user, isAuthenticated, logout, loading } = useAuth();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2 rtl:space-x-reverse" onClick={closeMobileMenu}>
            <i className="fas fa-microchip text-2xl text-purple-600"></i>
            <h1 className="text-xl font-bold text-purple-600">Y0 Hardware</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
            <Link href={`/${locale}`} className="text-gray-700 hover:text-purple-600 transition-colors">
              {t('home')}
            </Link>
            <Link href={`/${locale}/shop`} className="text-gray-700 hover:text-purple-600 transition-colors">
              {t('products')}
            </Link>
            <Link href={`/${locale}/about`} className="text-gray-700 hover:text-purple-600 transition-colors">
              {t('about')}
            </Link>
            <Link href={`/${locale}/contact`} className="text-gray-700 hover:text-purple-600 transition-colors">
              {t('contact')}
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Search - Desktop Only */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="bg-transparent outline-none text-sm w-32"
              />
              <button className="text-gray-600 hover:text-purple-600 ml-2 rtl:ml-0 rtl:mr-2">
                <i className="fas fa-search"></i>
              </button>
            </div>

            {/* Cart */}
            <Link href={`/${locale}/cart`} className="relative p-2" onClick={closeMobileMenu}>
              <i className="fas fa-shopping-cart text-xl text-gray-700 hover:text-purple-600"></i>
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Auth Buttons - Desktop */}
            {!loading && (
              <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Link
                      href={`/${locale}/account`}
                      className="text-sm text-gray-700 hover:text-purple-600"
                    >
                      {tAccount('myAccount')}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href={`/${locale}/admin`}
                        className="text-sm text-gray-700 hover:text-purple-600"
                      >
                        {tAccount('dashboard')}
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="text-sm text-gray-700 hover:text-purple-600 cursor-pointer"
                    >
                      {tAuth('logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Link
                      href={`/${locale}/auth/login`}
                      className="text-sm text-gray-700 hover:text-purple-600"
                    >
                      {tAuth('login')}
                    </Link>
                    <Link
                      href={`/${locale}/auth/register`}
                      className="text-sm bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700"
                    >
                      {tAuth('createAccount')}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 p-2"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white">
            <nav className="flex flex-col space-y-3">
              <Link 
                href={`/${locale}`} 
                className="text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                {t('home')}
              </Link>
              <Link 
                href={`/${locale}/shop`} 
                className="text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                {t('products')}
              </Link>
              <Link 
                href={`/${locale}/about`} 
                className="text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                {t('about')}
              </Link>
              <Link 
                href={`/${locale}/contact`} 
                className="text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                {t('contact')}
              </Link>
              
              {/* Mobile Auth */}
              {!loading && (
                <div className="border-t pt-3 mt-3">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/${locale}/account`}
                        className="text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-100"
                        onClick={closeMobileMenu}
                      >
                        {tAccount('myAccount')}
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          href={`/${locale}/admin`}
                          className="text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-100"
                          onClick={closeMobileMenu}
                        >
                          {tAccount('dashboard')}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                        className="text-left rtl:text-right text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        {tAuth('logout')}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/${locale}/auth/login`}
                        className="text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-100"
                        onClick={closeMobileMenu}
                      >
                        {tAuth('login')}
                      </Link>
                      <Link
                        href={`/${locale}/auth/register`}
                        className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-center"
                        onClick={closeMobileMenu}
                      >
                        {tAuth('createAccount')}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
