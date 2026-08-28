import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin, unauthorizedAdminResponse } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return unauthorizedAdminResponse();
    }

    const [products] = await pool.query('SELECT COUNT(*) as count FROM products WHERE is_active = true');
    const [orders] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const [revenue] = await pool.query('SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "paid"');
    const [pending] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');

    const stats = {
      totalProducts: (products as any)[0].count,
      totalOrders: (orders as any)[0].count,
      totalUsers: (users as any)[0].count,
      totalRevenue: (revenue as any)[0].total || 0,
      pendingOrders: (pending as any)[0].count,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
