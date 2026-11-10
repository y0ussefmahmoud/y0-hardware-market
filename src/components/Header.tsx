// ===== Header Component =====
// Double-Deck Navigation Header for Y0 Hardware Market
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const tAccount = useTranslations('account');
  const tFooter = useTranslations('footer');
  const { user, isAuthenticated, logout, loading } = useAuth();

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const res = await fetch('/api/cart', { credentials: 'include' });
        const data = await res.json();
        if (data.status === 'success' && data.data) {
          const items = data.data.items || [];
          const count = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
          setCartCount(count);
          setCartTotal(data.data.subtotal || 0);
          return;
        }
      } catch (e) {
        // Fallback to local hold check if offline
      }

      try {
        const hold = localStorage.getItem('y0_silicon_lock');
        if (hold) {
          const parsed = JSON.parse(hold);
          if (parsed.expiresAt > Date.now()) {
            setCartCount(1);
            setCartTotal(parsed.price || 114999);
            return;
          }
        }
      } catch (e) {}

      setCartCount(0);
      setCartTotal(0);
    };

    fetchCartDetails();
    const interval = setInterval(fetchCartDetails, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    router.push(`/${locale}/shop?${params.toString()}`);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.5)] border-b border-outline-variant/30">
      <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 flex flex-col justify-between py-1.5">
        {/* DECK 1: Main Control Bar */}
        <div className="h-16 flex items-center justify-between gap-4 lg:gap-6">
          {/* Official Logo & Brand Identity */}
          <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0 group" onClick={closeMobileMenu}>
            {/* Official Logo Image Asset */}
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 rounded-xl bg-[#00f2fe]/20 blur-sm group-hover:bg-[#00f2fe]/40 transition-all"></div>
              <img 
                src="/assets/y0-cyber-logo.svg" 
                alt="Y0 Hardware Market Logo" 
                className="relative h-10 w-auto object-contain" 
              />
            </div>
            
            {/* Side Typography Stack */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                  Y<span className="text-[#00f2fe]">0</span>
                </span>
                <span className="text-outline/40 font-light">|</span>
                <span className="font-mono text-[11px] font-bold tracking-widest text-[#00f2fe] uppercase">
                  HARDWARE
                </span>
              </div>
              <span className="font-mono text-[9px] tracking-[0.2em] text-outline uppercase -mt-0.5">
                MARKET // EGY
              </span>
            </div>
          </Link>

          {/* Central Hardware Search Terminal */}
          <div className="flex-1 max-w-2xl hidden md:flex">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center rounded-lg bg-surface-container-low border border-outline-variant/40 focus-within:ring-1 focus-within:ring-primary-container focus-within:border-primary-container">
              {/* Category Dropdown Selector */}
              <div className="relative border-r rtl:border-r-0 rtl:border-l border-outline-variant/30">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-surface-container-high py-2 pl-3 pr-7 rtl:pr-3 rtl:pl-7 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg font-mono text-xs text-on-surface-variant focus:outline-none cursor-pointer"
                >
                  <option value="">{locale === 'ar' ? 'كل العتاد' : 'All Hardware'}</option>
                  <option value="gpus">GPUs</option>
                  <option value="processors">CPUs</option>
                  <option value="motherboards">Motherboards</option>
                  <option value="ram">RAM</option>
                  <option value="storage">Storage</option>
                  <option value="psu">PSU</option>
                </select>
                <i className="fas fa-chevron-down pointer-events-none absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[10px]"></i>
              </div>

              {/* Text Search Input */}
              <div className="relative flex-1 flex items-center px-3">
                <i className="fas fa-search text-outline text-xs mr-2 rtl:mr-0 rtl:ml-2"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === 'ar' ? 'ابحث عن كروت الشاشة، المعالجات، Gen 5 SSD، DDR5...' : 'Search GPUs, Core i9, PCIe Gen 5, DDR5 modules...'}
                  className="w-full bg-transparent py-1.5 font-mono text-xs text-on-surface placeholder:text-outline/70 focus:outline-none"
                />
                <div className="hidden lg:flex items-center gap-1 rounded bg-surface-container-highest px-1.5 py-0.5 border border-outline-variant/30">
                  <kbd className="font-mono text-[10px] text-outline">CTRL</kbd>
                  <span className="font-mono text-[10px] text-outline">+</span>
                  <kbd className="font-mono text-[10px] text-outline">K</kbd>
                </div>
              </div>
            </form>
          </div>

          {/* Right Action HUD */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {/* User Account / Auth Terminal Node */}
            <div className="flex items-center font-mono text-xs">
              {loading ? (
                /* Static minimal fallback button while hydrating - NO RAW STRINGS */
                <Link
                  href={`/${locale}/auth/login`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-high/60 border border-outline-variant/30 text-on-surface hover:text-primary-container text-xs font-bold transition-all shadow-sm"
                  aria-label="Login"
                >
                  <svg className="w-4 h-4 text-primary-container shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="hidden sm:inline font-bold">{tAuth('login')}</span>
                </Link>
              ) : isAuthenticated && user ? (
                /* Authenticated User State */
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href={`/${locale}/account`}
                    className="group flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary-container px-2 sm:px-2.5 py-1.5 rounded transition-all text-on-surface z-20"
                    title={user?.first_name ? `${user.first_name} (${user?.role})` : 'Account'}
                    aria-label="User Account"
                  >
                    <div className="relative flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-container shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-tertiary-fixed rounded-full"></span>
                    </div>
                    <span className="hidden lg:inline text-xs font-bold truncate max-w-[80px]">
                      {user?.first_name || 'User'}
                    </span>
                    {user?.role === 'admin' && (
                      <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-1.5 py-0.2 rounded uppercase border border-cyan-500/30 font-mono">
                        Admin
                      </span>
                    )}
                    {user?.role === 'seller' && (
                      <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.2 rounded uppercase border border-amber-500/30 font-mono">
                        Seller
                      </span>
                    )}
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      href={`/${locale}/admin`}
                      className="hidden md:flex items-center gap-1 bg-tertiary-fixed/10 border border-tertiary-fixed/30 text-tertiary-fixed px-2 py-1 rounded text-[10px] font-bold uppercase hover:bg-tertiary-fixed hover:text-black transition-all"
                      title="Admin Dashboard"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                      </svg>
                      <span>ADMIN</span>
                    </Link>
                  )}
                  {user?.role === 'seller' && (
                    <Link
                      href={`/${locale}/seller`}
                      className="hidden md:flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-1 rounded text-[10px] font-bold uppercase hover:bg-amber-500 hover:text-black transition-all"
                      title="Seller Dashboard"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      <span>SELLER</span>
                    </Link>
                  )}
                </div>
              ) : (
                /* Guest State (Not Logged In) */
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href={`/${locale}/auth/login`}
                    className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary-container px-2.5 py-1.5 rounded transition-all text-on-surface hover:text-primary-container font-mono text-xs shadow-sm z-20"
                    aria-label="Login to account"
                  >
                    <svg className="w-4 h-4 text-primary-container shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="font-bold">{tAuth('login')}</span>
                  </Link>
                  <Link
                    href={`/${locale}/auth/register`}
                    className="hidden xl:inline-flex items-center gap-1 bg-primary-container hover:bg-surface-tint text-on-primary-fixed px-3 py-1.5 rounded font-bold shadow-[0_0_12px_rgba(0,242,254,0.25)] transition-all"
                  >
                    {tAuth('createAccount')}
                  </Link>
                </div>
              )}
            </div>

            {/* Cart HUD */}
            <Link
              href={`/${locale}/cart`}
              className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-bright px-3 py-1.5 rounded transition-colors border border-outline-variant/30"
              onClick={closeMobileMenu}
            >
              <div className="relative">
                <i className="fas fa-shopping-cart text-sm text-on-surface"></i>
                <span className={`absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                  cartCount > 0 ? 'bg-primary-container text-on-primary-fixed shadow-[0_0_8px_#00f2fe]' : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {cartCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col text-left rtl:text-right font-mono">
                <span className="text-[9px] text-outline uppercase tracking-wider">Cart Total</span>
                <span className="text-[11px] text-on-surface font-bold">
                  {cartTotal > 0 ? `${cartTotal.toLocaleString()} ${tFooter('currency')}` : `0 ${tFooter('currency')}`}
                </span>
              </div>
            </Link>

            {/* Language & Currency Pill */}
            <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/30 px-2.5 py-1 rounded">
              <span className="font-mono text-[11px] text-tertiary-fixed font-bold">EGP (ج.م)</span>
              <span className="text-outline/50 font-mono text-xs">|</span>
              <LanguageSwitcher />
            </div>

            {/* Rig Configurator Shortcut */}
            <Link
              href={`/${locale}#rig-configurator`}
              className="hidden lg:flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 px-3 py-1.5 rounded transition-all text-xs font-mono text-primary font-bold shadow-sm"
            >
              <i className="fas fa-sliders text-primary-container text-xs"></i>
              <span>RIG CONFIG</span>
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping ml-1"></span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-on-surface p-2 bg-surface-container-high rounded-lg border border-outline-variant/30"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
            </button>
          </div>
        </div>

        {/* DECK 2: High-Density Sub-Navigation & Logistics Strip */}
        <div className="h-11 flex items-center justify-between border-t border-outline-variant/20 pt-1 overflow-x-auto whitespace-nowrap scrollbar-none">
          <nav className="flex items-center gap-4 lg:gap-6 font-mono text-xs">
            <Link
              href={`/${locale}/shop`}
              className="shrink-0 flex items-center gap-1.5 bg-surface-container-high text-on-surface font-bold px-2.5 py-1 rounded border border-outline-variant/30 hover:border-primary-container/50 transition-colors"
            >
              <i className="fas fa-grid-2 text-primary-container text-xs"></i>
              <span>{locale === 'ar' ? 'استعراض كل المكونات' : 'Browse All Components'}</span>
            </Link>

            <Link
              href={`/${locale}/shop?category=gpus`}
              className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {locale === 'ar' ? 'كروت الشاشة (GPUs)' : 'GPUs & Graphics'}
            </Link>

            <Link
              href={`/${locale}/shop?category=processors`}
              className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {locale === 'ar' ? 'المعالجات (Intel / AMD)' : 'Processors (Intel / AMD)'}
            </Link>

            <Link
              href={`/${locale}/shop?category=motherboards`}
              className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {locale === 'ar' ? 'اللوحات الأم' : 'Motherboards'}
            </Link>

            <Link
              href={`/${locale}/shop?category=storage`}
              className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {locale === 'ar' ? 'الذاكرة والتخزين' : 'Memory & Storage'}
            </Link>

            <Link
              href={`/${locale}#rig-configurator`}
              className="shrink-0 flex items-center gap-1 text-on-primary-fixed bg-primary-container px-2.5 py-1 rounded font-bold hover:shadow-[0_0_12px_rgba(0,242,254,0.35)] transition-all"
            >
              <i className="fas fa-tune text-xs"></i>
              <span>{locale === 'ar' ? 'مجمّع الحواسيب (Rig Configurator)' : 'PC Builder (Rig Configurator)'}</span>
            </Link>

            <Link
              href={`/${locale}/drops`}
              className="shrink-0 flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface font-bold transition-colors"
            >
              <span>{locale === 'ar' ? 'عروض السيليكون اليومية' : 'Flash Deals & Daily Drops'}</span>
              <span className="rounded bg-error-container px-1.5 py-0.2 font-mono text-[9px] text-error font-bold tracking-wider animate-pulse">
                LIVE
              </span>
            </Link>

            <Link
              href={`/${locale}/about`}
              className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {locale === 'ar' ? 'الضمان ومركز القاهرة' : 'Warranty & Cairo Hub'}
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {t('contact')}
            </Link>
          </nav>

          {/* Logistics telemetry badge */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 ml-4 rtl:ml-0 rtl:mr-4 font-mono text-[11px] text-on-surface-variant">
            <i className="fas fa-truck-fast text-tertiary-fixed text-xs"></i>
            <span>Express Same-Day Cairo &amp; Giza Dispatch</span>
            <span className="text-outline">|</span>
            <a href="tel:+201129334173" className="text-primary-container hover:underline font-bold">
              01129334173
            </a>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-container-high bg-surface-container-lowest mt-2 rounded-b-xl shadow-2xl">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4 px-2">
              <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant/40">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === 'ar' ? 'بحث...' : 'Search hardware...'}
                  className="w-full bg-transparent font-mono text-xs text-on-surface focus:outline-none"
                />
                <button type="submit" aria-label="Search" className="text-primary-container">
                  <i className="fas fa-search text-xs"></i>
                </button>
              </div>
            </form>

            <nav className="flex flex-col space-y-1 font-mono text-xs px-2">
              <Link 
                href={`/${locale}`} 
                className="text-on-surface-variant hover:text-primary-container py-2 px-3 rounded hover:bg-surface-container-low"
                onClick={closeMobileMenu}
              >
                {t('home')}
              </Link>
              <Link 
                href={`/${locale}/shop`} 
                className="text-on-surface-variant hover:text-primary-container py-2 px-3 rounded hover:bg-surface-container-low"
                onClick={closeMobileMenu}
              >
                {locale === 'ar' ? 'استعراض كل المكونات' : 'Browse All Components'}
              </Link>
              <Link 
                href={`/${locale}#rig-configurator`} 
                className="text-primary-container font-bold py-2 px-3 rounded bg-surface-container-low flex items-center justify-between"
                onClick={closeMobileMenu}
              >
                <span>{locale === 'ar' ? 'مجمّع الحواسيب (PC Builder)' : 'PC Builder (Rig Configurator)'}</span>
                <i className="fas fa-tune text-xs"></i>
              </Link>
              <Link 
                href={`/${locale}/drops`} 
                className="text-primary-container font-bold bg-primary-container/10 py-2 px-3 rounded border border-primary-container/30 flex items-center justify-between"
                onClick={closeMobileMenu}
              >
                <span>{locale === 'ar' ? '⚡ عروض السيليكون الحصرية' : '⚡ Silicon Drops & Deals'}</span>
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              </Link>
              <Link 
                href={`/${locale}/about`} 
                className="text-on-surface-variant hover:text-primary-container py-2 px-3 rounded hover:bg-surface-container-low"
                onClick={closeMobileMenu}
              >
                {locale === 'ar' ? 'الضمان ومركز القاهرة' : 'Warranty & Cairo Hub'}
              </Link>
              <Link 
                href={`/${locale}/contact`} 
                className="text-on-surface-variant hover:text-primary-container py-2 px-3 rounded hover:bg-surface-container-low"
                onClick={closeMobileMenu}
              >
                {t('contact')}
              </Link>

              {/* Mobile Language Switcher & Currency */}
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3 mt-2 px-1">
                <span className="font-mono text-xs text-on-surface-variant">
                  EGP (ج.م)
                </span>
                <LanguageSwitcher />
              </div>

              {/* Mobile Auth */}
              <div className="border-t border-outline-variant/30 pt-3 mt-2">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/${locale}/account`}
                      className="text-on-surface-variant hover:text-primary-container py-2 px-3 rounded hover:bg-surface-container-low"
                      onClick={closeMobileMenu}
                    >
                      {tAccount('myAccount')}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href={`/${locale}/admin`}
                        className="text-tertiary-fixed font-bold py-2 px-3 rounded bg-surface-container-high"
                        onClick={closeMobileMenu}
                      >
                        {tAccount('dashboard')} (Admin)
                      </Link>
                    )}
                    {user?.role === 'seller' && (
                      <Link
                        href={`/${locale}/seller`}
                        className="text-amber-400 font-bold py-2 px-3 rounded bg-surface-container-high"
                        onClick={closeMobileMenu}
                      >
                        {tAccount('dashboard')} (Seller)
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="text-left rtl:text-right text-error py-2 px-3 rounded hover:bg-error-container/20 cursor-pointer"
                    >
                      {tAuth('logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/${locale}/auth/login`}
                      className="text-on-surface-variant hover:text-primary-container py-2 px-3 rounded hover:bg-surface-container-low text-center"
                      onClick={closeMobileMenu}
                    >
                      {tAuth('login')}
                    </Link>
                    <Link
                      href={`/${locale}/auth/register`}
                      className="bg-primary-container text-on-primary-fixed font-bold py-2 px-3 rounded text-center shadow-md"
                      onClick={closeMobileMenu}
                    >
                      {tAuth('createAccount')}
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
