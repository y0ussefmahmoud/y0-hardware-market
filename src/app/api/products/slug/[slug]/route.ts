// ===== Product by Slug API Route =====
// GET /api/products/slug/[slug] - Get product by slug
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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const rawSlug = slug || '';
    let decodedSlug = rawSlug;
    try {
      decodedSlug = decodeURIComponent(rawSlug);
    } catch {
      decodedSlug = rawSlug;
    }
    const cleanRaw = rawSlug.trim();
    const cleanDecoded = decodedSlug.trim();
    const isNumeric = /^\d+$/.test(cleanRaw);

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (
        p.slug = ? 
        OR p.slug = ? 
        OR LOWER(p.slug) = ? 
        OR LOWER(p.slug) = ?
        ${isNumeric ? 'OR p.id = ?' : ''}
      ) AND p.is_active = true
      LIMIT 1
    `;

    const paramsList = isNumeric 
      ? [cleanRaw, cleanDecoded, cleanRaw.toLowerCase(), cleanDecoded.toLowerCase(), parseInt(cleanRaw)] 
      : [cleanRaw, cleanDecoded, cleanRaw.toLowerCase(), cleanDecoded.toLowerCase()];

    const [products] = await pool.query(query, paramsList);

    if ((products as any[]).length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Product not found' },
        { status: 404 }
      );
    }

    const product = (products as any[])[0];
    
    // Parse JSON fields
    return NextResponse.json({
      status: 'success',
      data: {
        ...product,
        images: product.images ? JSON.parse(product.images) : null,
        specifications: product.specifications ? JSON.parse(product.specifications) : null,
      }
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching product' },
      { status: 500 }
    );
  }
}
