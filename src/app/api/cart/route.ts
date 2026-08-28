// ===== Cart API Route =====
// GET /api/cart - Get user's cart
// POST /api/cart - Add item to cart
// PUT /api/cart - Update cart item
// DELETE /api/cart - Clear cart
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

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromNextRequest(request);
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const query = `
      SELECT 
        c.id as cart_id,
        c.quantity,
        p.id,
        p.name,
        p.name_ar,
        p.price,
        p.old_price,
        p.images,
        p.stock_quantity,
        (p.price * c.quantity) as total_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ? AND p.is_active = true
    `;

    const [cartItems] = await pool.query(query, [user.id]);

    const subtotal = (cartItems as any[]).reduce((sum, item) => sum + item.total_price, 0);

    return NextResponse.json({
      status: 'success',
      data: {
        items: cartItems,
        subtotal: subtotal,
        total_items: (cartItems as any[]).length
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { product_id, quantity = 1 } = body;

    // Check if product exists
    const [products] = await pool.query(
      'SELECT id, stock_quantity FROM products WHERE id = ? AND is_active = true',
      [product_id]
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

    // Check if item already in cart
    const [existingItem] = await pool.query(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [user.id, product_id]
    );

    if ((existingItem as any[]).length > 0) {
      const newQuantity = (existingItem as any[])[0].quantity + quantity;

      if (product.stock_quantity < newQuantity) {
        return NextResponse.json(
          { status: 'error', message: 'Insufficient stock' },
          { status: 400 }
        );
      }

      await pool.query(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [newQuantity, (existingItem as any[])[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user.id, product_id, quantity]
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Item added to cart'
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error adding to cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    await pool.query(
      'DELETE FROM cart WHERE user_id = ?',
      [user.id]
    );

    return NextResponse.json({
      status: 'success',
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error clearing cart' },
      { status: 500 }
    );
  }
}
