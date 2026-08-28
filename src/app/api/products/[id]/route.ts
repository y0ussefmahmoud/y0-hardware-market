// ===== Single Product API Route =====
// GET /api/products/[id] - Get product by ID
// PUT /api/products/[id] - Update product (Admin)
// DELETE /api/products/[id] - Delete product (Admin)
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin, unauthorizedAdminResponse } from '@/lib/auth';
import { rejectIfUnsafeMutation } from '@/lib/security-http';

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
      WHERE p.id = ? AND p.is_active = true
    `;

    const [products] = await pool.query(query, [id]);

    if ((products as any[]).length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: (products as any[])[0]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const admin = await requireAdmin(request);
    if (!admin) {
      return unauthorizedAdminResponse();
    }

    const { id } = await params;
    const updates = await request.json();

    const updateFields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'name', 'name_ar', 'slug', 'description', 'description_ar',
      'price', 'old_price', 'category_id', 'stock_quantity', 'brand',
      'badge', 'is_active', 'images', 'specifications'
    ];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        if (key === 'images' || key === 'specifications') {
          updateFields.push(`${key} = ?`);
          values.push(JSON.stringify(updates[key]));
        } else {
          updateFields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);

    const query = `
      UPDATE products
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    await pool.query(query, values);

    return NextResponse.json({
      status: 'success',
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const admin = await requireAdmin(request);
    if (!admin) {
      return unauthorizedAdminResponse();
    }

    const { id } = await params;

    await pool.query('UPDATE products SET is_active = false WHERE id = ?', [id]);

    return NextResponse.json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error deleting product' },
      { status: 500 }
    );
  }
}
