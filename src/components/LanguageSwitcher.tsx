// ===== Language Switcher Component =====
// Seamless language toggle between Arabic (RTL) and English (LTR)
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition, Suspense } from 'react';

function LanguageSwitcherContent() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (nextLocale: string) => {
    if (nextLocale === locale || isPending) return;

    // Handle root pathname or segment-based pathname
    let newPathname = pathname;
    const segments = pathname.split('/');
    
    if (segments.length > 1 && (segments[1] === 'ar' || segments[1] === 'en')) {
      segments[1] = nextLocale;
      newPathname = segments.join('/');
    } else {
      newPathname = `/${nextLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    }

    // Preserve query search parameters
    const queryString = searchParams?.toString();
    const finalUrl = queryString ? `${newPathname}?${queryString}` : newPathname;

    startTransition(() => {
      // Set NEXT_LOCALE cookie for next-intl proxy persistence
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      router.replace(finalUrl);
      router.refresh();
    });
  };

  const nextLocale = locale === 'ar' ? 'en' : 'ar';

  return (
    <button
      onClick={() => handleLanguageChange(nextLocale)}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-gray-300 hover:border-purple-600 bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
      title={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      aria-label="Toggle Language"
    >
      <i className={`fas fa-globe text-sm text-purple-600 ${isPending ? 'animate-spin' : ''}`}></i>
      <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  );
}

export default function LanguageSwitcher() {
  return (
    <Suspense
      fallback={
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-gray-300 bg-white text-gray-400"
          disabled
          aria-label="Toggle Language"
        >
          <i className="fas fa-globe text-sm"></i>
          <span>...</span>
        </button>
      }
    >
      <LanguageSwitcherContent />
    </Suspense>
  );
}
