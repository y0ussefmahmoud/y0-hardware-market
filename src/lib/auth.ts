// ===== Authentication Utilities =====
// JWT and password hashing utilities
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE || '7d' } as any);
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET!);
  } catch {
    return null;
  }
}

export function getUserFromCookie(request: Request): any {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) return null;

  const token = tokenMatch[1];
  return verifyToken(token);
}

export function getUserFromNextRequest(request: NextRequest): any {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

function getTokenFromRequest(request: Request | NextRequest): string | null {
  if ('cookies' in request && typeof request.cookies?.get === 'function') {
    return request.cookies.get('token')?.value ?? null;
  }

  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
}

async function getUserFromDb(userId: number): Promise<AuthUser | null> {
  const [users] = await pool.query(
    'SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = ?',
    [userId]
  );

  if ((users as AuthUser[]).length === 0) {
    return null;
  }

  return (users as AuthUser[])[0];
}

export async function requireAdmin(
  request: Request | NextRequest
): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded?.id) return null;

  const user = await getUserFromDb(decoded.id);
  if (!user || user.role !== 'admin') return null;

  return user;
}

export function unauthorizedAdminResponse(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
