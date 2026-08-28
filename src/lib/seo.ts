// ===== SEO Utilities =====
// Helper functions for SEO metadata
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  locale?: string;
  type?: 'website' | 'article';
}

export function generateMetadata({
  title,
  description,
  image = '/og-image.jpg',
  locale = 'ar',
  type = 'website',
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3200';
  const url = `${baseUrl}/${locale}`;

  const defaultTitle = locale === 'ar'
    ? 'Y0 Hardware - متجر قطع الكمبيوتر واللابتوب'
    : 'Y0 Hardware - Computer Parts and Laptops Store';
  const defaultDescription = locale === 'ar'
    ? 'متجر Y0 Hardware المتخصص في بيع قطع الكمبيوتر واللابتوب والاكسسوارات بأفضل الأسعار'
    : 'Y0 Hardware store specializing in selling computer parts, laptops, and accessories at the best prices';

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: url,
      languages: {
        ar: `${baseUrl}/ar`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: type as 'website' | 'article',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      url,
      title: finalTitle,
      description: finalDescription,
      images: [
        {
          url: `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      siteName: 'Y0 Hardware',
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [`${baseUrl}${image}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
    },
  };
}
