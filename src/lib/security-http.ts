import { NextResponse } from 'next/server';
import {
  generateCSRFToken,
  isAllowedOrigin,
  validateCsrfRequest,
} from './security';

export function setCsrfCookie(response: NextResponse): void {
  const token = generateCSRFToken();
  response.cookies.set('csrf-token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export function clearCsrfCookie(response: NextResponse): void {
  response.cookies.delete('csrf-token');
}

export function rejectIfUnsafeOrigin(request: Request): NextResponse | null {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ status: 'error', message: 'Forbidden' }, { status: 403 });
  }
  return null;
}

export function rejectIfUnsafeMutation(request: Request): NextResponse | null {
  const originError = rejectIfUnsafeOrigin(request);
  if (originError) return originError;

  if (!validateCsrfRequest(request)) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  return null;
}
