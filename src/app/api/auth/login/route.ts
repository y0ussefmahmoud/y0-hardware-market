// ===== Login API Route =====
// POST /api/auth/login - Login user
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { rateLimit } from '@/lib/security';
import { rejectIfUnsafeOrigin, setCsrfCookie } from '@/lib/security-http';

export async function POST(request: NextRequest) {
  try {
    const unsafe = rejectIfUnsafeOrigin(request);
    if (unsafe) return unsafe;

    const body = await request.json();
    const { email, password } = body;

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(ip, 5, 15 * 60 * 1000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { status: 'error', message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if ((users as any[]).length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = (users as any[])[0];

    // Check password
    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const response = NextResponse.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      }
    });

    // Set httpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    setCsrfCookie(response);

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error logging in' },
      { status: 500 }
    );
  }
}
