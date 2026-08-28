// ===== Admin Products API =====
// CRUD operations for products
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin, unauthorizedAdminResponse } from '@/lib/auth';
import { rejectIfUnsafeMutation } from '@/lib/security-http';
import { revalidateTag, revalidatePath } from 'next/cache';

// GET all products
export async function GET(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return unauthorizedAdminResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.name_ar LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [products] = await pool.query(query, params) as any;

    // Parse JSON fields
    const parsedProducts = products.map((product: any) => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {}
    }));

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams: any[] = [];

    if (search) {
      countQuery += ' AND (name LIKE ? OR name_ar LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      countQuery += ' AND category_id = ?';
      countParams.push(category);
    }

    const [count] = await pool.query(countQuery, countParams) as any;

    return NextResponse.json({
      data: parsedProducts,
      pagination: {
        page,
        limit,
        total: count[0].total,
        totalPages: Math.ceil(count[0].total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create product
export async function POST(request: Request) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const admin = await requireAdmin(request);
    if (!admin) {
      return unauthorizedAdminResponse();
    }

    const body = await request.json();

    const {
      name,
      name_ar,
      slug,
      description,
      description_ar,
      price,
      old_price,
      category_id,
      stock_quantity,
      brand,
      images,
      specifications,
      badge,
      is_active,
    } = body;

    const [result] = await pool.query(
      `INSERT INTO products (
        name, name_ar, slug, description, description_ar,
        price, old_price, category_id, stock_quantity, brand,
        images, specifications, badge, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        name_ar,
        slug,
        description,
        description_ar,
        price,
        old_price || null,
        category_id,
        stock_quantity,
        brand,
        images ? JSON.stringify(images) : null,
        specifications ? JSON.stringify(specifications) : null,
        badge || null,
        is_active !== false,
      ]
    ) as any;

    // Trigger on-demand cache revalidation
    try {
      revalidateTag('products-list', 'default');
      if (slug) {
        revalidateTag(`product-${slug}`, 'default');
      }
      revalidatePath('/[locale]', 'layout');
      revalidatePath('/[locale]/shop', 'page');
    } catch (revalErr) {
      console.error('Error during on-demand revalidation on product create:', revalErr);
    }

    return NextResponse.json(
      { message: 'Product created successfully', id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
