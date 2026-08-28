// ===== Product Card Component =====
// Reusable product card for displaying products
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { csrfFetch } from '@/lib/csrf';

interface ProductCardProps {
  product: Product;
  locale?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const locale = useLocale();
  const tProduct = useTranslations('product');
  const tCart = useTranslations('cart');
  const tFooter = useTranslations('footer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const name = locale === 'ar' ? product.name_ar : product.name;
  const currency = tFooter('currency');
  
  // Get image from images array or fallback to image_url
  let imageUrl = product.image_url;
  
  if (product.images) {
    try {
      // Handle both JSON string and array
      const imagesArray = typeof product.images === 'string' 
        ? JSON.parse(product.images) 
        : product.images;
      
      if (Array.isArray(imagesArray) && imagesArray.length > 0) {
        imageUrl = imagesArray[0];
      }
    } catch (error) {
      console.error('Error parsing images:', error);
    }
  }

  // Fallback if no image
  if (!imageUrl) {
    return null;
  }

  const addToCart = async () => {
    if (!isAuthenticated) {
      setMessage(tCart('loginFirst'));
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await csrfFetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });

      const data = await res.json();
      
      if (data.status === 'success') {
        setMessage(tCart('addedToCart'));
      } else {
        setMessage(data.message || tCart('error'));
      }
    } catch (error) {
      setMessage(tCart('error'));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <Link href={`/${locale}/product/${product.slug}`}>
        <div className="relative aspect-square">
          <Image
            src={imageUrl || ''}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {product.badge && (
            <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              {product.badge === 'new' && tProduct('badgeNew')}
              {product.badge === 'sale' && tProduct('badgeSale')}
              {product.badge === 'bestseller' && tProduct('badgeBestseller')}
              {product.badge === 'featured' && tProduct('badgeFeatured')}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {discount}%
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/${locale}/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 mb-2 hover:text-purple-600 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 rtl:space-x-reverse mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star text-xs ${
                  i < Math.floor(product.rating) ? '' : 'text-gray-300'
                }`}
              ></i>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.review_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
          <span className="text-lg font-bold text-purple-600">
            {product.price.toLocaleString()} {currency}
          </span>
          {product.old_price && (
            <span className="text-sm text-gray-400 line-through">
              {product.old_price.toLocaleString()} {currency}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={addToCart}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>{tCart('adding')}</span>
          ) : (
            <>
              <i className="fas fa-cart-plus ml-2 rtl:ml-0 rtl:mr-2"></i>
              {tProduct('addToCart')}
            </>
          )}
        </button>
        {message && (
          <div className={`mt-2 text-sm text-center ${
            message.includes(tCart('error')) || message.includes(tCart('loginFirst')) 
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
