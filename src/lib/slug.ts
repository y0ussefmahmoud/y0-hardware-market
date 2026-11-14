// ===== Slug Generator Utility =====
// Creates URL-friendly slugs supporting both English and Arabic characters
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

import pool from '@/lib/db';

/**
 * Convert string to standard lowercase hyphenated slug
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^\w\u0621-\u064A-]+/g, '') // Allow alphanumeric, Arabic letters, and hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim starting hyphen
    .replace(/-+$/, ''); // Trim trailing hyphen
}

/**
 * Ensures slug is non-empty and unique in the products table
 */
export async function ensureUniqueSlug(
  rawSlugOrName: string,
  excludeProductId?: number
): Promise<string> {
  const baseSlug = slugify(rawSlugOrName) || `product-${Date.now()}`;
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    let query = 'SELECT id FROM products WHERE slug = ?';
    const params: any[] = [candidate];
    if (excludeProductId) {
      query += ' AND id != ?';
      params.push(excludeProductId);
    }

    const [rows] = await pool.query(query, params) as any;
    if (!rows || rows.length === 0) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter++;
  }
}
