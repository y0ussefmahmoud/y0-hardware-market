// ===== Register API Route =====
// POST /api/auth/register - Register new user
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { rateLimit, isValidEmail } from '@/lib/security';
import { rejectIfUnsafeOrigin, setCsrfCookie } from '@/lib/security-http';

export async function POST(request: NextRequest) {
  try {
    const unsafe = rejectIfUnsafeOrigin(request);
    if (unsafe) return unsafe;

    const body = await request.json();
    const { email, password, first_name, last_name, phone, address, city, postal_code } = body;

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { status: 'error', message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Skip rate limiting in development to avoid Redis issues
    if (process.env.NODE_ENV === 'production') {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const rateLimitResult = await rateLimit(ip, 3, 60 * 60 * 1000);
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { status: 'error', message: 'Too many registration attempts. Please try again later.' },
          { status: 429 }
        );
      }
    }

    // Check if user already exists
    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existingUser as any[]).length > 0) {
      return NextResponse.json(
        { status: 'error', message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const query = `
      INSERT INTO users (
        email, password, first_name, last_name, phone
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      email,
      hashedPassword,
      first_name,
      last_name,
      phone || null
    ]);

    // Generate JWT token
    const token = generateToken({
      id: (result as any).insertId,
      email,
      role: 'user'
    });

    const response = NextResponse.json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: (result as any).insertId,
          email,
          first_name,
          last_name,
          role: 'user'
        }
      }
    }, { status: 201 });

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
    console.error('Error registering user:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { status: 'error', message: 'Error registering user' },
      { status: 500 }
    );
  }
}
