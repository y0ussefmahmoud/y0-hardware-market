// ===== Loading Spinner Component =====
// Displays loading state with spinner animation
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useLocale } from 'next-intl';

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-2 border-primary-container/20 border-t-primary-container rounded-full animate-spin`}></div>
    </div>
  );
}

export function FullPageLoading() {
  const locale = useLocale();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-on-surface-variant font-mono text-xs">
          {locale === 'en' ? 'INITIALIZING SILICON RUNTIME...' : 'جاري تشغيل النظام...'}
        </p>
      </div>
    </div>
  );
}
