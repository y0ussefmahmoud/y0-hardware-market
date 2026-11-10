// ===== Product Detail Page =====
// Single product page with details and related products
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Product } from '@/types';
import { getTranslations } from 'next-intl/server';
import pool from '@/lib/db';

export const dynamicParams = true;

// Pre-render static paths for all active products across supported locales
export async function generateStaticParams() {
  try {
    const [rows] = await pool.query(
      'SELECT slug FROM products WHERE is_active = true AND slug IS NOT NULL AND slug != ""'
    ) as any;

    const slugs: string[] = (rows as any[]).map((r) => r.slug);
    const locales = ['ar', 'en'];

    const params: Array<{ slug: string; locale: string }> = [];
    for (const locale of locales) {
      for (const slug of slugs) {
        params.push({ slug, locale });
      }
    }

    return params;
  } catch (error) {
    console.error('Failed to fetch static params during build (falling back to on-demand generation):', error);
    return [];
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const [products] = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.is_active = true
    `, [slug]) as any;

    if (!products || products.length === 0) return null;
    const product = products[0];
    return {
      ...product,
      images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [],
      specifications: product.specifications ? (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) : {},
    };
  } catch (dbError) {
    console.error(`Total failure fetching product ${slug}:`, dbError);
    return null;
  }
}

async function getRelatedProducts(productId: number, categoryId?: number): Promise<Product[]> {
  try {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = (SELECT category_id FROM products WHERE id = ?)
        AND p.id != ?
        AND p.is_active = true
      ORDER BY RAND()
      LIMIT 4
    `;

    const [products] = await pool.query(query, [productId, productId]);
    return ((products as any[]) || []).map((product: any) => ({
      ...product,
      images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [],
      specifications: product.specifications ? (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) : {},
    }));
  } catch (error) {
    console.error('Error fetching related products directly from DB:', error);
    return [];
  }
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params;
  const tProduct = await getTranslations('product');
  const tNav = await getTranslations('nav');
  const tFooter = await getTranslations('footer');
  const product = await getProduct(slug);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-mono">
        <h1 className="text-2xl font-bold mb-4 text-on-surface">{tProduct('notFound')}</h1>
        <Link href={`/${locale}/shop`} className="text-primary-container hover:underline">
          {tProduct('backToShop')}
        </Link>
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.id);
  const discount = product.old_price
    ? Math.round(((parseFloat(String(product.old_price)) - parseFloat(String(product.price))) / parseFloat(String(product.old_price))) * 100)
    : 0;

  // Handle images - use first image as main image
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg';
  const productImages = product.images || [];

  return (
    <div className="flex flex-col bg-surface text-on-surface min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface-container-lowest/80 border-b border-outline-variant/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono text-on-surface-variant">
            <Link href={`/${locale}`} className="hover:text-primary-container transition-colors">{tNav('home')}</Link>
            <span>/</span>
            <Link href={`/${locale}/shop`} className="hover:text-primary-container transition-colors">{tNav('shop')}</Link>
            <span>/</span>
            <span className="text-on-surface font-semibold truncate max-w-xs">{locale === 'ar' && product.name_ar ? product.name_ar : product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 flex items-center justify-center p-6">
              <img
                src={mainImage}
                alt={locale === 'ar' && product.name_ar ? product.name_ar : product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/20 p-2">
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <span className="font-mono text-xs text-primary-container uppercase tracking-wider font-semibold">
                  {product.brand}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-on-surface">
                {locale === 'ar' && product.name_ar ? product.name_ar : product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="font-mono text-3xl font-extrabold text-primary-container">
                {product.price} {tFooter('currency', { defaultValue: 'EGP' })}
              </span>
              {product.old_price && (
                <span className="font-mono text-lg text-outline line-through">
                  {product.old_price} {tFooter('currency', { defaultValue: 'EGP' })}
                </span>
              )}
              {discount > 0 && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-error-container text-on-error-container font-bold">
                  -{discount}%
                </span>
              )}
            </div>

            <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
              {locale === 'ar' && product.description_ar ? product.description_ar : product.description}
            </p>

            <div className="pt-4 border-t border-outline-variant/30 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-outline">AVAILABILITY:</span>
                <span className={product.stock_quantity > 0 ? 'text-tertiary-fixed font-bold' : 'text-error font-bold'}>
                  {product.stock_quantity > 0 ? `IN STOCK (${product.stock_quantity} UNITS)` : 'OUT OF STOCK'}
                </span>
              </div>
              {product.category_name && (
                <div className="flex justify-between">
                  <span className="text-outline">CATEGORY:</span>
                  <span className="text-on-surface">{locale === 'ar' && product.category_name_ar ? product.category_name_ar : product.category_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-outline-variant/30">
            <h2 className="font-mono text-xl font-bold uppercase tracking-wider mb-6 text-on-surface flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary-container rounded-sm"></span>
              <span>RELATED HARDWARE</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
