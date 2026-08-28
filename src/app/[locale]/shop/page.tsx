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
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{tShop('title')}</h1>
          <p className="text-gray-600">{tShop('subtitle')}</p>
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
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {products ? tShop('showingProducts', { count: products.length }) : tShop('loading')}
              </p>
              <select className="border rounded-lg px-4 py-2">
                <option>{tShop('sortNewest')}</option>
                <option>{tShop('sortPriceLowHigh')}</option>
                <option>{tShop('sortPriceHighLow')}</option>
                <option>{tShop('sortBestSelling')}</option>
              </select>
            </div>

            {!products ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">{tShop('loading')}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">{tShop('noProducts')}</p>
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
              <div className="flex justify-center mt-8 space-x-2 rtl:space-x-reverse">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  {tShop('prev')}
                </button>
                {[...Array(pagination.total_pages)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 border rounded-lg ${
                      i + 1 === pagination.current_page
                        ? 'bg-purple-600 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
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
