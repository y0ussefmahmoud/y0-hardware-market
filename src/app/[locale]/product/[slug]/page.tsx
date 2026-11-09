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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL || 'http://localhost:3200';
    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      next: {
        tags: [`product-${slug}`, 'products-list'],
        revalidate: false, // Cached indefinitely until on-demand revalidation
      },
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error(`Database/API fetch error for product ${slug}, attempting direct DB fallback:`, error);
    // Graceful offline degradation: fallback to direct DB query if API fetch is unreachable
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
        images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : null,
        specifications: product.specifications ? (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) : null,
      };
    } catch (dbError) {
      console.error(`Total failure fetching product ${slug}:`, dbError);
      return null;
    }
  }
}

async function getRelatedProducts(productId: number): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL || 'http://localhost:3200';
    const res = await fetch(`${baseUrl}/api/products/${productId}/related`, {
      next: {
        tags: [`related-${productId}`, 'products-list'],
        revalidate: false,
      },
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
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
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{tProduct('notFound')}</h1>
        <Link href={`/${locale}/shop`} className="text-purple-600 hover:text-purple-700">
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
            <i className="fas fa-chevron-left rtl:rotate-180 text-[10px] text-outline-variant/50"></i>
            <Link href={`/${locale}/shop`} className="hover:text-primary-container transition-colors">{tNav('products')}</Link>
            <i className="fas fa-chevron-left rtl:rotate-180 text-[10px] text-outline-variant/50"></i>
            <span className="text-primary-container truncate max-w-xs">{locale === 'ar' ? product.name_ar : product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden mb-4 p-4 flex items-center justify-center relative group">
              <img
                src={mainImage}
                alt={locale === 'ar' ? product.name_ar : product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/40 via-transparent to-transparent pointer-events-none" />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <div key={index} className="aspect-square bg-surface-container-low border border-outline-variant/30 hover:border-primary-container rounded-xl overflow-hidden cursor-pointer p-2 transition-all">
                    <img
                      src={image}
                      alt={`${locale === 'ar' ? product.name_ar : product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono text-xs uppercase tracking-widest mb-4 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              <span>HARDWARE SPEC SHEET</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-on-surface tracking-tight leading-snug">
              {locale === 'ar' ? product.name_ar : product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
              <div className="flex text-amber-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${
                      i < Math.floor(product.rating) ? 'text-amber-400' : 'text-outline-variant/30'
                    }`}
                  ></i>
                ))}
              </div>
              <span className="text-on-surface-variant font-mono text-xs">({product.review_count} {tProduct('ratings')})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-4 rtl:space-x-reverse mb-6 bg-surface-container-low border border-outline-variant/30 rounded-xl p-4">
              <span className="text-3xl md:text-4xl font-extrabold font-mono text-primary-container">
                {product.price.toLocaleString()} <span className="text-sm font-sans font-normal text-on-surface-variant">{tFooter('currency')}</span>
              </span>
              {product.old_price && (
                <>
                  <span className="text-lg text-on-surface-variant/50 line-through font-mono">
                    {product.old_price.toLocaleString()} {tFooter('currency')}
                  </span>
                  {discount > 0 && (
                    <span className="bg-tertiary-container/90 text-on-tertiary-container border border-tertiary/40 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
                      -{discount}% {tProduct('discount')}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-primary-container font-semibold mb-2">
                // {tProduct('description')}
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{locale === 'ar' ? product.description_ar : product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                product.stock_quantity > 0
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                  : 'bg-red-950/60 text-red-400 border border-red-500/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock_quantity > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                <span>{product.stock_quantity > 0 ? tProduct('inStock') : tProduct('outOfStock')}</span>
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-6">
              <div className="flex items-center bg-surface-container border border-outline-variant/40 rounded-lg font-mono">
                <button className="px-3.5 py-2 hover:bg-surface-container-high text-on-surface transition-colors">-</button>
                <span className="px-4 py-2 border-x border-outline-variant/30 text-on-surface text-sm">1</span>
                <button className="px-3.5 py-2 hover:bg-surface-container-high text-on-surface transition-colors">+</button>
              </div>
              <button className="flex-1 bg-primary-container text-on-primary-container py-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <i className="fas fa-cart-plus text-xs"></i>
                <span>{tProduct('addToCart')}</span>
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex space-x-3 rtl:space-x-reverse font-mono text-xs">
              <button className="flex-1 border border-outline-variant/40 hover:border-primary-container text-on-surface hover:text-primary-container py-2.5 rounded-lg bg-surface-container-low transition-colors flex items-center justify-center gap-2 uppercase tracking-wider">
                <i className="fas fa-heart text-xs text-primary-container"></i>
                <span>{tProduct('addToWishlist')}</span>
              </button>
              <button className="flex-1 border border-outline-variant/40 hover:border-primary-container text-on-surface hover:text-primary-container py-2.5 rounded-lg bg-surface-container-low transition-colors flex items-center justify-center gap-2 uppercase tracking-wider">
                <i className="fas fa-share-alt text-xs text-primary-container"></i>
                <span>{tProduct('share')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <div className="border-b border-outline-variant/30 mb-6 font-mono text-xs">
            <div className="flex space-x-8 rtl:space-x-reverse">
              <button className="pb-3 border-b-2 border-primary-container text-primary-container font-bold uppercase tracking-wider">
                // {tProduct('specifications')}
              </button>
              <button className="pb-3 text-on-surface-variant hover:text-primary-container transition-colors uppercase tracking-wider">
                // {tProduct('description')}
              </button>
              <button className="pb-3 text-on-surface-variant hover:text-primary-container transition-colors uppercase tracking-wider">
                // {tProduct('reviews')}
              </button>
            </div>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6">
            {product.specifications ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2.5 border-b border-outline-variant/20">
                    <span className="text-on-surface-variant uppercase tracking-wider">{key}</span>
                    <span className="font-semibold text-primary-container">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant font-mono text-xs">{tProduct('noSpecs')}</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <span className="text-primary-container font-mono text-xs uppercase tracking-widest block mb-1">
                // COMPATIBLE HARDWARE
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">{tProduct('related')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
