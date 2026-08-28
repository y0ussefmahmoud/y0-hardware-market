// ===== i18n Configuration =====
// Internationalization setup for Next.js
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { getTranslations } from 'next-intl/server';

export async function getI18n() {
  return await getTranslations();
}

export async function getScopedI18n(scope: string) {
  return await getTranslations(scope);
}

export function getStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export async function getCurrentLocale() {
  // This will be handled by next-intl middleware
  return 'ar';
}
