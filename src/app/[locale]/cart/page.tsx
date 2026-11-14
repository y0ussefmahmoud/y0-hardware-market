// ===== Cart Page =====
// Shopping cart page
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { csrfFetch } from '@/lib/csrf';
import { getProductMainImage } from '@/lib/image';

interface CartItem {
  cart_id: number;
  quantity: number;
  id: number;
  name: string;
  name_ar: string;
  price: number;
  old_price: number | null;
  images: string;
  stock_quantity: number;
  total_price: number;
}

export default function CartPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const tCart = useTranslations('cart');
  const tFooter = useTranslations('footer');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () =>  {
    try {
      const res = await fetch('/api/cart', {
        credentials: 'include'
      });
      
      if (!res.ok) {
        // If 401 Unauthorized or guest session, handle gracefully without endless spinning
        if (res.status === 401) {
          try {
            const hold = typeof window !== 'undefined' ? localStorage.getItem('y0_silicon_lock') : null;
            if (hold) {
              const parsed = JSON.parse(hold);
              if (parsed.expiresAt > Date.now()) {
                setCartItems([{
                  cart_id: 999999,
                  quantity: 1,
                  id: parsed.productId || 1,
                  name: parsed.name || 'Silicon Deal Hold',
                  name_ar: parsed.name_ar || 'حجز عتاد سيليكون حصري',
                  price: parsed.price || 114999,
                  old_price: null,
                  images: parsed.image ? JSON.stringify([parsed.image]) : '[]',
                  stock_quantity: 1,
                  total_price: parsed.price || 114999,
                }]);
                setSubtotal(parsed.price || 114999);
                return;
              }
            }
          } catch (e) {}
          setCartItems([]);
          setSubtotal(0);
          return;
        }
      }

      const data = await res.json();
      
      if (data.status === 'success' && data.data) {
        setCartItems(data.data.items || []);
        setSubtotal(data.data.subtotal || 0);
      } else {
        setCartItems([]);
        setSubtotal(0);
      }
    } catch (error) {
      console.warn('Cart data unavailable (offline or guest):', error);
      setCartItems([]);
      setSubtotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    try {
      const res = await csrfFetch(`/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await res.json();
      
      if (data.status === 'success') {
        fetchCart(); // Refresh cart
      } else {
        alert(data.message || 'Error updating quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity');
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const res = await csrfFetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      
      if (data.status === 'success') {
        fetchCart(); // Refresh cart
      } else {
        alert(data.message || 'Error removing item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-surface min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-container/20 border-t-primary-container mx-auto"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-surface text-on-surface min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-surface-container border border-outline-variant/40 flex items-center justify-center text-primary-container text-3xl mb-6 shadow-lg">
          <i className="fas fa-shopping-cart"></i>
        </div>
        <h1 className="text-2xl font-bold font-mono mb-2 text-on-surface">{tCart('empty')}</h1>
        <p className="text-on-surface-variant font-mono text-xs max-w-sm mb-8">{tCart('emptyMessage')}</p>
        <Link
          href={`/${locale}/shop`}
          className="inline-block bg-primary-container text-on-primary-container px-8 py-3.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(0,242,254,0.4)] transition-all"
        >
          {tCart('browseProducts')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-surface text-on-surface min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-surface-container-lowest via-surface-container to-surface border-b border-outline-variant/30 py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,242,254,0.08),rgba(11,19,38,0))] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono text-xs uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            <span>DISPATCH QUEUE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-on-surface">{tCart('title')}</h1>
          <p className="text-on-surface-variant font-mono text-xs">{cartItems.length} {tCart('items')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-lg">
              {cartItems.map((item) => {
                const imageUrl = getProductMainImage(item);

                return (
                <div key={item.cart_id} className="flex flex-wrap sm:flex-nowrap items-center p-6 border-b border-outline-variant/20 last:border-b-0 gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name_ar}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="text-outline-variant/60 font-mono text-[10px]">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-[200px]">
                    <Link href={`/${locale}/product/${item.id}`} className="font-semibold text-sm text-on-surface hover:text-primary-container transition-colors line-clamp-2">
                      {locale === 'ar' ? item.name_ar : item.name}
                    </Link>
                    <p className="text-on-surface-variant/80 font-mono text-xs mt-1">{item.price.toLocaleString()} {tFooter('currency')}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center bg-surface-container border border-outline-variant/40 rounded-lg font-mono text-xs">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 hover:bg-surface-container-high text-on-surface transition-colors disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 border-x border-outline-variant/30 text-on-surface font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-surface-container-high text-on-surface transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right font-mono min-w-[100px]">
                    <p className="font-bold text-sm text-primary-container">
                      {item.total_price.toLocaleString()} <span className="text-[10px] text-on-surface-variant font-sans">{tFooter('currency')}</span>
                    </p>
                  </div>

                  {/* Remove */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 rounded-lg bg-surface-container hover:bg-red-950/40 text-on-surface-variant hover:text-red-400 border border-outline-variant/30 hover:border-red-500/30 transition-all flex items-center justify-center text-xs"
                    title="Remove item"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                );
              })}
            </div>

            {/* Coupon Code */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 mt-6 shadow-md">
              <div className="flex space-x-3 rtl:space-x-reverse">
                <input
                  type="text"
                  placeholder={tCart('couponPlaceholder')}
                  className="flex-1 bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-xs uppercase tracking-wider focus:border-primary-container focus:outline-none"
                />
                <button className="bg-surface-container hover:bg-primary-container text-on-surface hover:text-on-primary-container border border-outline-variant/40 hover:border-primary-container px-6 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all">
                  {tCart('apply')}
                </button>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-96">
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 sticky top-24 shadow-xl">
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-6 text-on-surface pb-3 border-b border-outline-variant/20 flex items-center gap-2">
                <i className="fas fa-receipt text-primary-container text-xs"></i>
                <span>{tCart('title')} Summary</span>
              </h3>
              
              <div className="space-y-3.5 mb-6 font-mono text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>{tCart('subtotal')}</span>
                  <span className="font-semibold text-on-surface">{subtotal.toLocaleString()} {tFooter('currency')}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>{tCart('shipping')}</span>
                  <span className="text-emerald-400 font-semibold">{locale === 'ar' ? 'مجاني' : 'Free'}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>{tCart('discount')}</span>
                  <span className="text-on-surface-variant/70">0 {tFooter('currency')}</span>
                </div>
                <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-baseline">
                  <span className="font-bold text-sm uppercase text-on-surface">{tCart('total')}</span>
                  <span className="font-bold text-xl text-primary-container">{subtotal.toLocaleString()} <span className="text-xs text-on-surface-variant font-sans font-normal">{tFooter('currency')}</span></span>
                </div>
              </div>

              <Link
                href={`/${locale}/checkout`}
                className="block w-full bg-primary-container text-on-primary-container py-3.5 rounded-lg text-center font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] active:scale-[0.98] transition-all"
              >
                {tCart('checkout')}
              </Link>

              <Link
                href={`/${locale}/shop`}
                className="block w-full mt-4 text-center text-xs font-mono uppercase tracking-wider text-primary-container hover:underline"
              >
                &larr; {tCart('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
