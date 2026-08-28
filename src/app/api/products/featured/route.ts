// ===== Featured Products API Route =====
// GET /api/products/featured - Get featured products
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '8');

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true 
        AND (p.badge = 'featured' OR p.badge = 'bestseller' OR p.badge = 'new')
      ORDER BY p.rating DESC
      LIMIT ?
    `;

    const [products] = await pool.query(query, [limit]);

    return NextResponse.json({
      status: 'success',
      data: products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching featured products' },
      { status: 500 }
    );
  }
}
