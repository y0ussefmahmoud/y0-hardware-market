// ===== Admin Product API =====
// Update and delete individual products
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

// PUT update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const admin = await requireAdmin(request);
    if (!admin) {
      return unauthorizedAdminResponse();
    }

    const body = await request.json();
    const { id } = await params;

    // Get previous slug for revalidation if slug changed
    let previousSlug: string | null = null;
    try {
      const [existing] = await pool.query('SELECT slug FROM products WHERE id = ?', [id]) as any;
      if (existing && existing.length > 0) {
        previousSlug = existing[0].slug;
      }
    } catch (e) {
      // Non-blocking
    }

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

    await pool.query(
      `UPDATE products SET
        name = ?, name_ar = ?, slug = ?, description = ?, description_ar = ?,
        price = ?, old_price = ?, category_id = ?, stock_quantity = ?, brand = ?,
        images = ?, specifications = ?, badge = ?, is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
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
        id,
      ]
    );

    // Trigger on-demand cache revalidation
    try {
      revalidateTag('products-list', 'default');
      if (slug) {
        revalidateTag(`product-${slug}`, 'default');
      }
      if (previousSlug && previousSlug !== slug) {
        revalidateTag(`product-${previousSlug}`, 'default');
      }
      revalidatePath('/[locale]', 'layout');
      revalidatePath('/[locale]/shop', 'page');
    } catch (revalErr) {
      console.error('Error during on-demand revalidation on product update:', revalErr);
    }

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  request: Request,
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

    // Get slug before deletion for revalidation
    let slugToDelete: string | null = null;
    try {
      const [existing] = await pool.query('SELECT slug FROM products WHERE id = ?', [id]) as any;
      if (existing && existing.length > 0) {
        slugToDelete = existing[0].slug;
      }
    } catch (e) {
      // Non-blocking
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    // Trigger on-demand cache revalidation
    try {
      revalidateTag('products-list', 'default');
      if (slugToDelete) {
        revalidateTag(`product-${slugToDelete}`, 'default');
      }
      revalidatePath('/[locale]', 'layout');
      revalidatePath('/[locale]/shop', 'page');
    } catch (revalErr) {
      console.error('Error during on-demand revalidation on product delete:', revalErr);
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
