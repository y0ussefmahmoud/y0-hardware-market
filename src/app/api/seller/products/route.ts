// ===== Seller Products API =====
// Returns only the products owned by the authenticated seller
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireSellerOrAdmin, unauthorizedAdminResponse } from '@/lib/auth';

// GET seller's own products
export async function GET(request: NextRequest) {
  try {
    const user = await requireSellerOrAdmin(request);
    if (!user || user.role !== 'seller') {
      return unauthorizedAdminResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.seller_id = ?
    `;
    const params: any[] = [user.id];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.name_ar LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [products] = await pool.query(query, params) as any;

    const parsedProducts = products.map((product: any) => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {}
    }));

    return NextResponse.json({
      status: 'success',
      data: parsedProducts,
    });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
