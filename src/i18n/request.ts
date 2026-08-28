// ===== i18n Request Configuration =====
// Next-intl request configuration
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale || !['ar', 'en'].includes(locale)) {
    locale = 'ar';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
