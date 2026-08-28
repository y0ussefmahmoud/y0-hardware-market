// ===== Sitemap.xml =====
// Dynamic sitemap generation for SEO
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { MetadataRoute } from 'next';
import pool from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3200';
  const locales = ['ar', 'en'];

  // Static pages
  const staticPages = [
    '',
    '/shop',
    '/auth/login',
    '/auth/register',
  ];

  const staticUrls: MetadataRoute.Sitemap = [];

  // Generate static URLs for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      staticUrls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: page === '' ? 1 : 0.8,
      });
    }
  }

  // Dynamic product URLs
  try {
    const [products] = await pool.query(`
      SELECT slug, updated_at 
      FROM products 
      WHERE is_active = true
      LIMIT 1000
    `) as any;

    const productUrls: MetadataRoute.Sitemap = (products as any[]).map((product: any) => {
      const lastModified = new Date(product.updated_at);
      
      return locales.map(locale => ({
        url: `${baseUrl}/${locale}/product/${product.slug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }).flat();

    return [...staticUrls, ...productUrls];
  } catch (error) {
    // Log error only in development to avoid noise in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating sitemap (DB connection failed):', error);
    }
    // Return static URLs only when DB is unavailable
    return staticUrls;
  }
}
