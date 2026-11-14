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
    imageUrl = '/placeholder.jpg';
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
    <div className="bg-surface-container-low border border-outline-variant/30 hover:border-primary-container/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,242,254,0.12)] group flex flex-col justify-between">
      {/* Product Image */}
      <Link href={`/${locale}/product/${product.slug}`} className="block relative aspect-square bg-surface-container-lowest overflow-hidden">
        <Image
          src={imageUrl || ''}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/80 via-transparent to-transparent pointer-events-none" />
        
        {(product.badge || Boolean(product.is_featured)) && (
          <span className="absolute top-2.5 right-2.5 bg-primary-container/90 text-on-primary-container text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,242,254,0.4)] backdrop-blur-sm border border-primary-container">
            {product.badge === 'new' && tProduct('badgeNew')}
            {product.badge === 'sale' && tProduct('badgeSale')}
            {product.badge === 'bestseller' && tProduct('badgeBestseller')}
            {(product.badge === 'featured' || (!product.badge && Boolean(product.is_featured))) && tProduct('badgeFeatured')}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-tertiary-container/90 text-on-tertiary-container text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-tertiary/40 shadow-sm backdrop-blur-sm">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <Link href={`/${locale}/product/${product.slug}`}>
            <h3 className="font-semibold text-on-surface group-hover:text-primary-container transition-colors line-clamp-2 text-sm leading-snug">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1 rtl:space-x-reverse mt-2">
            <div className="flex text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star ${
                    i < Math.floor(product.rating) ? 'text-amber-400' : 'text-outline-variant/30'
                  }`}
                ></i>
              ))}
            </div>
            <span className="text-xs text-on-surface-variant/70 font-mono">({product.review_count})</span>
          </div>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline space-x-2 rtl:space-x-reverse mb-3">
            <span className="text-lg font-bold font-mono text-primary-container">
              {product.price.toLocaleString()} <span className="text-xs text-on-surface-variant font-sans font-normal">{currency}</span>
            </span>
            {product.old_price && (
              <span className="text-xs text-on-surface-variant/50 font-mono line-through">
                {product.old_price.toLocaleString()} {currency}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={addToCart}
            disabled={loading}
            className="w-full bg-surface-container hover:bg-primary-container text-on-surface hover:text-on-primary-container border border-outline-variant/40 hover:border-primary-container py-2.5 rounded-lg font-medium text-xs font-mono uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <span>{tCart('adding')}</span>
            ) : (
              <>
                <i className="fas fa-cart-plus text-xs"></i>
                <span>{tProduct('addToCart')}</span>
              </>
            )}
          </button>
          {message && (
            <div className={`mt-2 text-xs font-mono text-center py-1 px-2 rounded ${
              message.includes(tCart('error')) || message.includes(tCart('loginFirst')) 
                ? 'text-red-400 bg-red-950/40 border border-red-500/30' 
                : 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
