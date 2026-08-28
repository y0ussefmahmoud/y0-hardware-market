// ===== Related Products API Route =====
// GET /api/products/[id]/related - Get related products
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const [products] = await pool.query(query, [id, id]);

    return NextResponse.json({
      status: 'success',
      data: (products as any[]).map((product: any) => ({
        ...product,
        images: product.images ? JSON.parse(product.images) : null,
        specifications: product.specifications ? JSON.parse(product.specifications) : null,
      }))
    });
  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching related products' },
      { status: 500 }
    );
  }
}
