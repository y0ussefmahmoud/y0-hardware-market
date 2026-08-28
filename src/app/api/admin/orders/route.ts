import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin, unauthorizedAdminResponse } from '@/lib/auth';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/security';
import { rejectIfUnsafeMutation } from '@/lib/security-http';

// GET all orders
export async function GET(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return unauthorizedAdminResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        o.*,
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
        return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 });
      }
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [orders] = await pool.query(query, params) as any;

    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const countParams: any[] = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [count] = await pool.query(countQuery, countParams) as any;

    return NextResponse.json({
      data: orders,
      pagination: {
        page,
        limit,
        total: count[0].total,
        totalPages: Math.ceil(count[0].total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update order status
export async function PUT(request: Request) {
  try {
    const unsafe = rejectIfUnsafeMutation(request);
    if (unsafe) return unsafe;

    const admin = await requireAdmin(request);
    if (!admin) {
      return unauthorizedAdminResponse();
    }

    const body = await request.json();
    const { id, status, payment_status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order id is required' }, { status: 400 });
    }

    if (status && !ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    if (payment_status && !PAYMENT_STATUSES.includes(payment_status)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    }

    if (!status && !payment_status) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    await pool.query(
      `UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status), updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status ?? null, payment_status ?? null, id]
    );

    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
