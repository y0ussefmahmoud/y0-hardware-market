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
import pool from '@/lib/db';

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }): Promise<{ data: Product[], pagination: any }> {
  try {
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
    const brand = typeof searchParams.brand === 'string' ? searchParams.brand : undefined;
    const minPrice = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined;
    const maxPrice = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'created_at';
    const order = typeof searchParams.order === 'string' ? searchParams.order : 'DESC';
    const page = parseInt((typeof searchParams.page === 'string' ? searchParams.page : undefined) || '1');
    const limit = parseInt((typeof searchParams.limit === 'string' ? searchParams.limit : undefined) || '12');

    const offset = (page - 1) * limit;

    let whereClause = 'WHERE p.is_active = true';
    const params: any[] = [];

    if (category) {
      whereClause += ' AND p.category_id = ?';
      params.push(category);
    }

    if (brand) {
      whereClause += ' AND p.brand = ?';
      params.push(brand);
    }

    if (minPrice) {
      whereClause += ' AND p.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      whereClause += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.name_ar LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const allowedSortFields = ['price', 'rating', 'created_at', 'name'];
    const sortField = allowedSortFields.includes(sort || '') ? sort : 'created_at';
    const sortOrder = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `;
    const [countResult] = await pool.query(countQuery, params);
    const total = (countResult as any)[0].total;

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    
    const [products] = await pool.query(query, [...params, limit, offset]);

    const parsedProducts = (products as any[]).map((product: any) => ({
      ...product,
      images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [],
      specifications: product.specifications ? (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) : {}
    }));

    return {
      data: parsedProducts,
      pagination: {
        current_page: page,
        per_page: limit,
        total: total,
        total_pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching products directly from DB:', error);
    return { data: [], pagination: {} };
  }
}

async function getCategories() {
  try {
    const query = `
      SELECT c.*,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = true) as product_count
      FROM categories c
      WHERE c.parent_id IS NULL
      ORDER BY c.name
    `;

    const [categories] = await pool.query(query);
    return (categories as any[]) || [];
  } catch (error) {
    console.error('Error fetching categories directly from DB:', error);
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
              <span className="font-mono text-xs text-on-surface-variant">
                SHOWING {products.length} OF {pagination.total || products.length} HARDWARE ITEMS
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-low border border-outline-variant/30 rounded-xl">
                <p className="font-mono text-base text-on-surface mb-2">{tShop('noProducts')}</p>
                <p className="font-mono text-xs text-outline">{tShop('tryAdjustingFilters')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
