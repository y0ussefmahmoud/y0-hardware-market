// ===== Language Switcher Component =====
// Seamless language toggle between Arabic (RTL) and English (LTR)
// Native anchor tag with cookie persistence to guarantee 100% clickability across all browsers
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const nextIntlLocale = useLocale();
  const pathname = usePathname();

  // Safely determine current path from Next hook or browser window
  const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  const currentSearch = typeof window !== 'undefined' ? window.location.search : '';

  let targetPath = '';
  let targetLocale = 'ar';

  if (currentPath === '/ar' || currentPath === '/ar/') {
    targetPath = '/en';
    targetLocale = 'en';
  } else if (currentPath.startsWith('/ar/')) {
    targetPath = `/en/${currentPath.slice(4)}`;
    targetLocale = 'en';
  } else if (currentPath === '/en' || currentPath === '/en/') {
    targetPath = '/ar';
    targetLocale = 'ar';
  } else if (currentPath.startsWith('/en/')) {
    targetPath = `/ar/${currentPath.slice(4)}`;
    targetLocale = 'ar';
  } else {
    // If route doesn't have an explicit locale prefix, toggle based on current locale
    targetLocale = nextIntlLocale === 'ar' ? 'en' : 'ar';
    targetPath = `/${targetLocale}${currentPath.startsWith('/') ? currentPath : `/${currentPath}`}`;
  }

  const finalUrl = `${targetPath}${currentSearch}` || `/${targetLocale}`;

  const handleClick = () => {
    // Set 1-year cookie for Next.js i18n middleware persistence
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const isArabic = pathname ? pathname.startsWith('/ar') : nextIntlLocale === 'ar';

  return (
    <a
      href={finalUrl}
      onClick={handleClick}
      className="cursor-pointer relative z-20 pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high/80 hover:bg-surface-bright text-on-surface font-mono text-xs font-bold transition-all border border-outline-variant/40 hover:border-primary-container active:scale-95 select-none shadow-sm"
      title={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      aria-label="Toggle Language"
    >
      <i className="fas fa-globe text-xs text-primary-container"></i>
      <span className="font-bold text-on-surface">{isArabic ? 'English' : 'عربي'}</span>
    </a>
  );
}
