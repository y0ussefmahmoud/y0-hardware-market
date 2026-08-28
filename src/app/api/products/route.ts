// ===== Products API Route =====
// GET /api/products - Get all products with filters
// POST /api/products - Create new product (Admin)
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Product } from '@/types';
import { requireAdmin, unauthorizedAdminResponse } from '@/lib/auth';
import { rejectIfUnsafeMutation } from '@/lib/security-http';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'DESC';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

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

    return NextResponse.json({
      status: 'success',
      data: products,
      pagination: {
        current_page: page,
        per_page: limit,
        total: total,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
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
      brand,
      sku,
      stock_quantity,
      image_url,
      images,
      specifications,
      badge
    } = body;

    const query = `
      INSERT INTO products (
        name, name_ar, slug, description, description_ar,
        price, old_price, category_id, brand, sku,
        stock_quantity, image_url, images, specifications, badge
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      name, name_ar, slug, description, description_ar,
      price, old_price, category_id, brand, sku,
      stock_quantity, image_url,
      images ? JSON.stringify(images) : null,
      specifications ? JSON.stringify(specifications) : null,
      badge
    ]);

    return NextResponse.json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        id: (result as any).insertId,
        ...body
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error creating product' },
      { status: 500 }
    );
  }
}
