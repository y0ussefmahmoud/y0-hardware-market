// ===== Product Slugs API Route =====
// GET /api/products/slugs - Returns all active product slugs for generateStaticParams
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT slug FROM products WHERE is_active = true AND slug IS NOT NULL AND slug != ""'
    ) as any;

    const slugs = (rows as any[]).map((row) => row.slug);

    return NextResponse.json({
      status: 'success',
      data: slugs,
    });
  } catch (error) {
    console.error('Error fetching product slugs:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch product slugs', data: [] },
      { status: 500 }
    );
  }
}
