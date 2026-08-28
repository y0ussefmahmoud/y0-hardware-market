// ===== Home Page =====
// Main landing page for Y0 Hardware
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import ProductCard from '@/components/ProductCard';
import { ProductListSkeleton } from '@/components/Skeleton';
import { Product } from '@/types';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import pool from '@/lib/db';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const [products] = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND (p.badge = 'featured' OR p.badge = 'bestseller')
      ORDER BY p.created_at DESC
      LIMIT 8
    `) as any;

    return (products as any[]).map((product: any) => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : null,
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const [categories] = await pool.query(`
      SELECT id, name, name_ar, slug, image_url
      FROM categories
      WHERE parent_id IS NULL
      ORDER BY name
    `) as any;
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();
  const t = await getTranslations();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              {t('hero.subtitle')}
            </p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              {t('hero.cta')}
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('categories.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map((category: any) => (
                <Link 
                  key={category.id} 
                  href={`/${locale}/shop?category=${category.id}`}
                  className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="bg-purple-600 group-hover:bg-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                    <i className="fas fa-folder text-2xl text-white"></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {locale === 'ar' ? category.name_ar : category.name}
                  </h3>
                </Link>
              ))
            ) : (
              [
                { name: t('categories.pcParts'), icon: 'fa-microchip', color: 'bg-purple-600' },
                { name: t('categories.laptops'), icon: 'fa-laptop', color: 'bg-blue-600' },
                { name: t('categories.accessories'), icon: 'fa-headphones', color: 'bg-green-600' },
                { name: t('categories.gaming'), icon: 'fa-gamepad', color: 'bg-red-600' }
              ].map((category) => (
                <Link 
                  key={category.name} 
                  href={`/${locale}/shop`}
                  className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className={`${category.color} group-hover:opacity-90 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-opacity`}>
                    <i className={`fas ${category.icon} text-2xl text-white`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">{category.name}</h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">
              {t('featured.title')}
            </h2>
            <Link href={`/${locale}/shop`} className="text-purple-600 hover:text-purple-700 font-semibold">
              {t('featured.viewAll')} <i className="fas fa-arrow-left mr-2 rtl:mr-0 rtl:ml-2"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))
            ) : (
              <ProductListSkeleton count={8} />
            )}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('deals.title')}
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            {t('deals.subtitle')}
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold">23</div>
              <div className="text-sm">{t('deals.hours')}</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold">59</div>
              <div className="text-sm">{t('deals.minutes')}</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold">45</div>
              <div className="text-sm">{t('deals.seconds')}</div>
            </div>
          </div>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
            {t('deals.cta')}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shipping-fast text-2xl text-purple-600"></i>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t('features.fastShipping.title')}
              </h3>
              <p className="text-gray-600">
                {t('features.fastShipping.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl text-purple-600"></i>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t('features.securePayment.title')}
              </h3>
              <p className="text-gray-600">
                {t('features.securePayment.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-headset text-2xl text-purple-600"></i>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t('features.support.title')}
              </h3>
              <p className="text-gray-600">
                {t('features.support.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
