// ===== Image URL Resolver Utility =====
// Ensures robust, permanent image resolution across local and production environments
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

/**
 * Resolves an image URL cleanly across local dev and production symlinks.
 * Guarantees relative `/uploads/...` paths or absolute http/https URLs.
 */
export const getImageUrl = (img?: string | null): string => {
  if (!img || typeof img !== 'string' || img.trim() === '') {
    return '/placeholder.jpg';
  }

  const clean = img.trim();

  // If already absolute URL or data URI
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  // If already prefixed with /uploads/
  if (clean.startsWith('/uploads/')) {
    return clean;
  }

  // If explicitly pointing to public asset directories or root placeholder
  if (clean.startsWith('/assets/') || clean.startsWith('/placeholder') || clean.startsWith('/images/')) {
    return clean;
  }

  // Otherwise ensure it starts with /uploads/
  const stripped = clean.startsWith('/') ? clean.slice(1) : clean;
  return `/uploads/${stripped}`;
};

/**
 * Extracts the primary image URL from product objects supporting images (JSON/array) or image_url.
 */
export const getProductMainImage = (product?: {
  images?: string | string[] | null;
  image_url?: string | null;
} | null): string => {
  if (!product) return '/placeholder.jpg';

  if (product.images) {
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]) {
        return getImageUrl(parsed[0]);
      }
    } catch {
      if (typeof product.images === 'string' && product.images.trim()) {
        return getImageUrl(product.images);
      }
    }
  }

  if (product.image_url) {
    return getImageUrl(product.image_url);
  }

  return '/placeholder.jpg';
};
