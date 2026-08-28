// ===== Logout API Route =====
// POST /api/auth/logout - Logout user
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { NextResponse } from 'next/server';
import { clearCsrfCookie } from '@/lib/security-http';

export async function POST() {
  const response = NextResponse.json({
    status: 'success',
    message: 'Logged out successfully'
  });

  response.cookies.delete('token');
  clearCsrfCookie(response);

  return response;
}
