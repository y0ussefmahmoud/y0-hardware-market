// ===== Orders API Route =====
// GET /api/orders - Get user's orders
// POST /api/orders - Create new order
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

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE o.user_id = ?';
    const params: any[] = [user.id];

    if (status) {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }

    const query = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [orders] = await pool.query(query, [...params, limit, offset]);

    return NextResponse.json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching orders' },
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
    const {
      shipping_first_name,
      shipping_last_name,
      shipping_email,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      payment_method,
      order_notes,
      coupon_code
    } = body;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

    const [cartItems] = await connection.query(
      `SELECT c.quantity, p.id as product_id, p.name, p.name_ar, p.price, p.stock_quantity
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ? AND p.is_active = true`,
      [user.id]
    );

    if ((cartItems as any[]).length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { status: 'error', message: 'Cart is empty' },
        { status: 400 }
      );
    }

    for (const item of cartItems as any[]) {
      if (item.stock_quantity < item.quantity) {
        await connection.rollback();
        return NextResponse.json(
          { status: 'error', message: 'Insufficient stock for one or more items' },
          { status: 400 }
        );
      }
    }

    let subtotal = (cartItems as any[]).reduce((sum, item) => sum + item.price * item.quantity, 0);
    let shippingAmount = 0;
    let discountAmount = 0;
    let couponId: number | null = null;

    if (coupon_code) {
      const [coupons] = await connection.query(
        'SELECT * FROM coupons WHERE code = ? AND is_active = true AND valid_until > NOW()',
        [coupon_code]
      );

      if ((coupons as any[]).length > 0) {
        const coupon = (coupons as any[])[0];

        if (subtotal >= coupon.min_amount) {
          couponId = coupon.id;
          if (coupon.discount_type === 'percentage') {
            discountAmount = subtotal * (coupon.discount_value / 100);
          } else {
            discountAmount = coupon.discount_value;
          }

          if (coupon.max_discount && discountAmount > coupon.max_discount) {
            discountAmount = coupon.max_discount;
          }
        }
      }
    }

    if (subtotal < 1000) {
      shippingAmount = 50;
    }

    const totalAmount = subtotal - discountAmount + shippingAmount;
    const orderNumber = 'Y0-' + Date.now().toString().slice(-8);

    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        user_id, order_number, total_amount, shipping_amount, discount_amount,
        payment_method,
        shipping_first_name, shipping_last_name, shipping_email, shipping_phone,
        shipping_address, shipping_city, shipping_postal_code,
        order_notes, coupon_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        orderNumber,
        totalAmount,
        shippingAmount,
        discountAmount,
        payment_method,
        shipping_first_name,
        shipping_last_name,
        shipping_email,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        order_notes || null,
        coupon_code || null
      ]
    );

    const orderId = (orderResult as any).insertId;

    for (const item of cartItems as any[]) {
      const totalPrice = item.price * item.quantity;
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_name_ar, quantity, price, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.name, item.name_ar, item.quantity, item.price, totalPrice]
      );

      const [stockResult] = await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
        [item.quantity, item.product_id, item.quantity]
      );

      if ((stockResult as any).affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { status: 'error', message: 'Insufficient stock for one or more items' },
          { status: 400 }
        );
      }
    }

    if (couponId) {
      await connection.query(
        'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
        [couponId]
      );
    }

    await connection.query('DELETE FROM cart WHERE user_id = ?', [user.id]);
    await connection.commit();

    return NextResponse.json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order_id: orderId,
        order_number: orderNumber,
        total_amount: totalAmount
      }
    }, { status: 201 });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error creating order' },
      { status: 500 }
    );
  }
}
