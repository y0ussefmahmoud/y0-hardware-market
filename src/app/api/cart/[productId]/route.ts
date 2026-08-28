// ===== Cart Item API Route =====
// PUT /api/cart/[productId] - Update item quantity
// DELETE /api/cart/[productId] - Remove item from cart
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromNextRequest } from '@/lib/auth';
import { rejectIfUnsafeMutation } from '@/lib/security-http';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const user = getUserFromNextRequest(request);
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await params;
    const body = await request.json();
    const { quantity } = body;

    // Check if product exists and has enough stock
    const [products] = await pool.query(
      'SELECT id, stock_quantity FROM products WHERE id = ? AND is_active = true',
      [productId]
    );

    if ((products as any[]).length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Product not found' },
        { status: 404 }
      );
    }

    const product = (products as any[])[0];

    if (product.stock_quantity < quantity) {
      return NextResponse.json(
        { status: 'error', message: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Update or delete based on quantity
    if (quantity <= 0) {
      await pool.query(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [user.id, productId]
      );
    } else {
      await pool.query(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, user.id, productId]
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Cart updated'
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error updating cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const user = getUserFromNextRequest(request);
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await params;

    await pool.query(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [user.id, productId]
    );

    return NextResponse.json({
      status: 'success',
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error removing from cart' },
      { status: 500 }
    );
  }
}
