// ===== Get Current User API Route =====
// GET /api/auth/me - Get current authenticated user
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromNextRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromNextRequest(request);
    if (!user) {
      return NextResponse.json(
        { status: 'success', data: { user: null } },
        { status: 200 }
      );
    }

    // Fetch fresh user data from database
    const [users] = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = ?',
      [user.id]
    );

    if ((users as any[]).length === 0) {
      return NextResponse.json(
        { status: 'success', data: { user: null } },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        user: (users as any[])[0]
      }
    });
  } catch (error) {
    console.warn('Error fetching current user:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { status: 'success', data: { user: null } },
      { status: 200 }
    );
  }
}
