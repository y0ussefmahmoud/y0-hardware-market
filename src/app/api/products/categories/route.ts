// ===== Categories API Route =====
// GET /api/products/categories - Get all categories
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT c.*,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = true) as product_count
      FROM categories c
      WHERE c.parent_id IS NULL
      ORDER BY c.name
    `;

    const [categories] = await pool.query(query);

    return NextResponse.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching categories' },
      { status: 500 }
    );
  }
}
