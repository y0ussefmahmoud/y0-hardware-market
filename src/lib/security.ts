// ===== Security Utilities =====
// Rate limiting and CSRF protection
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import { getRedisClient, isRedisAvailable } from './redis';

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// Simple in-memory rate limiter (fallback when Redis is not available)
export const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000 // 1 minute
): Promise<{ success: boolean; remaining: number }> {
  // Try Redis first (production)
  const redisAvailable = await isRedisAvailable();
  
  if (redisAvailable) {
    return rateLimitRedis(identifier, limit, windowMs);
  }

  // Fallback to in-memory (development)
  return rateLimitInMemory(identifier, limit, windowMs);
}

// Redis-based rate limiting (production)
async function rateLimitRedis(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number }> {
  const redis = getRedisClient();
  const key = `ratelimit:${identifier}`;
  const windowSeconds = Math.ceil(windowMs / 1000);

  try {
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, windowSeconds);
    const results = await pipeline.exec();

    if (!results) {
      throw new Error('Redis pipeline failed');
    }

    const currentCount = results[0][1] as number;
    const remaining = Math.max(0, limit - currentCount);

    return {
      success: currentCount <= limit,
      remaining,
    };
  } catch (error) {
    console.error('Redis rate limiting error, falling back to in-memory:', error);
    return rateLimitInMemory(identifier, limit, windowMs);
  }
}

// In-memory rate limiting (fallback)
function rateLimitInMemory(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}

// Clean up old records periodically (for in-memory fallback)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

// Generate CSRF token
export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

// Validate CSRF token (simple implementation)
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

function getAllowedOrigins(): string[] {
  const origins = [process.env.NEXTAUTH_URL, process.env.NEXT_PUBLIC_API_URL].filter(
    Boolean
  ) as string[];

  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3200', 'http://127.0.0.1:3200');
  }

  return origins;
}

export function isAllowedOrigin(request: Request): boolean {
  const allowed = getAllowedOrigins();
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  if (origin) {
    return allowed.some((base) => origin === base || origin.startsWith(`${base}/`));
  }

  if (referer) {
    return allowed.some((base) => referer.startsWith(base));
  }

  return process.env.NODE_ENV !== 'production';
}

export function validateCsrfRequest(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)csrf-token=([^;]+)/);
  if (!cookieMatch) return false;

  const sessionToken = decodeURIComponent(cookieMatch[1]);
  const headerToken = request.headers.get('x-csrf-token');
  if (!headerToken) return false;

  return validateCSRFToken(headerToken, sessionToken);
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (Egyptian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^01[0-2,5]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}
