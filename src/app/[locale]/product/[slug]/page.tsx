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
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-purple-600">{tNav('home')}</Link>
            <i className="fas fa-chevron-left text-xs"></i>
            <Link href={`/${locale}/shop`} className="hover:text-purple-600">{tNav('products')}</Link>
            <i className="fas fa-chevron-left text-xs"></i>
            <span className="text-gray-900">{locale === 'ar' ? product.name_ar : product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={mainImage}
                alt={locale === 'ar' ? product.name_ar : product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
                    <img
                      src={image}
                      alt={`${locale === 'ar' ? product.name_ar : product.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-75"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{locale === 'ar' ? product.name_ar : product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${
                      i < Math.floor(product.rating) ? '' : 'text-gray-300'
                    }`}
                  ></i>
                ))}
              </div>
              <span className="text-gray-600">({product.review_count} {tProduct('ratings')})</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
              <span className="text-4xl font-bold text-purple-600">
                {product.price.toLocaleString()} {tFooter('currency')}
              </span>
              {product.old_price && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    {product.old_price.toLocaleString()} {tFooter('currency')}
                  </span>
                  {discount > 0 && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      {discount}% {tProduct('discount')}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">{tProduct('description')}</h3>
              <p className="text-gray-600">{locale === 'ar' ? product.description_ar : product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                product.stock_quantity > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock_quantity > 0 ? tProduct('inStock') : tProduct('outOfStock')}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
              <div className="flex items-center border rounded-lg">
                <button className="px-4 py-2 hover:bg-gray-100">-</button>
                <span className="px-4 py-2 border-x">1</span>
                <button className="px-4 py-2 hover:bg-gray-100">+</button>
              </div>
              <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                <i className="fas fa-cart-plus ml-2 rtl:ml-0 rtl:mr-2"></i>
                {tProduct('addToCart')}
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex space-x-4 rtl:space-x-reverse">
              <button className="flex-1 border border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-colors">
                <i className="fas fa-heart ml-2 rtl:ml-0 rtl:mr-2"></i>
                {tProduct('addToWishlist')}
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="fas fa-share-alt ml-2 rtl:ml-0 rtl:mr-2"></i>
                {tProduct('share')}
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <div className="border-b mb-6">
            <div className="flex space-x-8 rtl:space-x-reverse">
              <button className="pb-4 border-b-2 border-purple-600 text-purple-600 font-semibold">
                {tProduct('specifications')}
              </button>
              <button className="pb-4 text-gray-600 hover:text-purple-600">
                {tProduct('description')}
              </button>
              <button className="pb-4 text-gray-600 hover:text-purple-600">
                {tProduct('reviews')}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            {product.specifications ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-semibold">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">{tProduct('noSpecs')}</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{tProduct('related')}</h2>
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
