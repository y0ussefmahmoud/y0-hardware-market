// ===== Shop Page =====
// Product listing page with filters
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import ProductCard from '@/components/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import { Product } from '@/types';
import { getTranslations } from 'next-intl/server';

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }): Promise<{ data: Product[], pagination: any }> {
  try {
    const params = new URLSearchParams();
    
    if (searchParams.category) params.append('category', searchParams.category as string);
    if (searchParams.brand) params.append('brand', searchParams.brand as string);
    if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice as string);
    if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice as string);
    if (searchParams.search) params.append('search', searchParams.search as string);
    if (searchParams.page) params.append('page', searchParams.page as string);
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';
    const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    console.log('Products API response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [], pagination: {} };
  }
}

async function getCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';
    const res = await fetch(`${baseUrl}/api/products/categories`, {
      cache: 'no-store'
    });
    const data = await res.json();
    console.log('Categories API response:', data);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function ShopPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'en';
  const tShop = await getTranslations('shop');
  const resolvedSearchParams = await searchParams;
  const { data: products, pagination } = await getProducts(resolvedSearchParams);
  const categories = await getCategories();

  console.log('Shop page - products:', products);
  console.log('Shop page - pagination:', pagination);
  console.log('Shop page - categories:', categories);

  return (
    <div className="flex flex-col bg-surface text-on-surface min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-surface-container-lowest via-surface-container to-surface border-b border-outline-variant/30 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,242,254,0.08),rgba(11,19,38,0))] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono text-xs uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
            <span>SYSTEM CATALOG // INVENTORY</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-on-surface">
            {tShop('title')}
          </h1>
          <p className="text-on-surface-variant font-mono text-sm max-w-2xl">
            {tShop('subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <ShopFilters categories={categories} />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3">
              <p className="text-on-surface-variant font-mono text-xs uppercase tracking-wider">
                {products ? tShop('showingProducts', { count: products.length }) : tShop('loading')}
              </p>
              <select className="bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs font-mono text-on-surface focus:border-primary-container focus:outline-none">
                <option>{tShop('sortNewest')}</option>
                <option>{tShop('sortPriceLowHigh')}</option>
                <option>{tShop('sortPriceHighLow')}</option>
                <option>{tShop('sortBestSelling')}</option>
              </select>
            </div>

            {!products ? (
              <div className="text-center py-16 bg-surface-container-low border border-outline-variant/20 rounded-xl">
                <i className="fas fa-spinner fa-spin text-3xl text-primary-container mb-4"></i>
                <p className="text-on-surface-variant font-mono text-xs uppercase tracking-wider">{tShop('loading')}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-low border border-outline-variant/20 rounded-xl">
                <i className="fas fa-search text-3xl text-outline-variant/50 mb-4"></i>
                <p className="text-on-surface-variant font-mono text-xs uppercase tracking-wider">{tShop('noProducts')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex justify-center mt-10 space-x-2 rtl:space-x-reverse font-mono text-xs">
                <button className="px-4 py-2 border border-outline-variant/40 rounded-lg bg-surface-container-low text-on-surface hover:border-primary-container hover:text-primary-container transition-colors uppercase tracking-wider">
                  {tShop('prev')}
                </button>
                {[...Array(pagination.total_pages)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 border rounded-lg transition-all ${
                      i + 1 === pagination.current_page
                        ? 'bg-primary-container text-on-primary-container border-primary-container font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-surface-container-low border-outline-variant/40 text-on-surface hover:border-primary-container hover:text-primary-container'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="px-4 py-2 border border-outline-variant/40 rounded-lg bg-surface-container-low text-on-surface hover:border-primary-container hover:text-primary-container transition-colors uppercase tracking-wider">
                  {tShop('next')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
