// ===== Structured Data (JSON-LD) =====
// Generate JSON-LD structured data for SEO
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { Product } from '@/types';

export function generateProductStructuredData(product: Product, locale: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3200';
  const productName = locale === 'ar' ? product.name_ar : product.name;
  const productDescription = locale === 'ar' ? product.description_ar : product.description;
  const currency = locale === 'ar' ? 'EGP' : 'EGP';

  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    image: product.image_url,
    sku: product.id.toString(),
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${locale}/product/${product.slug}`,
      priceCurrency: currency,
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      availability: product.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Y0 Hardware',
      },
    },
    aggregateRating: product.review_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count,
    } : undefined,
  };

  return JSON.stringify(structuredData);
}

export function generateOrganizationStructuredData(locale: string = 'ar') {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3200';
  const description = locale === 'ar'
    ? 'متجر Y0 Hardware المتخصص في بيع قطع الكمبيوتر واللابتوب والاكسسوارات بأفضل الأسعار'
    : 'Y0 Hardware store specializing in selling computer parts, laptops, and accessories at the best prices';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Y0 Hardware',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+20-1XX-XXXX-XXX',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
    },
    sameAs: [
      'https://www.facebook.com/y0hardware',
      'https://www.instagram.com/y0hardware',
      'https://www.twitter.com/y0hardware',
    ],
  };

  return JSON.stringify(structuredData);
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(structuredData);
}
