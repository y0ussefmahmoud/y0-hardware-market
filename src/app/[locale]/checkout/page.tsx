'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { csrfFetch } from '@/lib/csrf';
import { useAuth } from '@/hooks/useAuth';

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

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const tCheckout = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const tAuth = useTranslations('auth');
  const tFooter = useTranslations('footer');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    notes: '',
    payment_method: 'cod' as 'cod' | 'vodafone' | 'bank_transfer',
  });

  const shippingAmount = subtotal > 0 && subtotal < 1000 ? 50 : 0;
  const totalAmount = subtotal + shippingAmount;

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      const data = await res.json();

      if (data.status === 'success') {
        setCartItems(data.data.items);
        setSubtotal(data.data.subtotal);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    fetchCart();
  }, [authLoading, isAuthenticated, locale, router]);

  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      first_name: prev.first_name || user.first_name || '',
      last_name: prev.last_name || user.last_name || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
    }));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await csrfFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping_first_name: formData.first_name,
          shipping_last_name: formData.last_name,
          shipping_email: formData.email,
          shipping_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: formData.postal_code || null,
          payment_method: formData.payment_method,
          order_notes: formData.notes || null,
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        router.push(`/${locale}/orders?order=${encodeURIComponent(data.data.order_number)}`);
      } else {
        alert(data.message || 'Error creating order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-surface min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-container/20 border-t-primary-container mx-auto"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
      <div className="bg-gradient-to-b from-surface-container-lowest via-surface-container to-surface border-b border-outline-variant/30 py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,242,254,0.08),rgba(11,19,38,0))] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono text-xs uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            <span>SECURE CHECKOUT TERMINAL</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-on-surface">{tCheckout('title')}</h1>
          <p className="text-on-surface-variant font-mono text-xs">{tCheckout('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 shadow-xl">
              <h2 className="text-base font-bold font-mono uppercase tracking-wider mb-6 text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/20">
                <i className="fas fa-truck text-primary-container text-xs"></i>
                <span>{tCheckout('shippingInfo')}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('firstName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('lastName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('email')}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tAuth('phone')}</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tCheckout('address')}</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tCheckout('city')}</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tCheckout('postalCode')}</label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tCheckout('paymentMethod')}</label>
                <select
                  required
                  value={formData.payment_method}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_method: e.target.value as 'cod' | 'vodafone' | 'bank_transfer',
                    })
                  }
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                >
                  <option value="cod">{tCheckout('paymentCod')}</option>
                  <option value="vodafone">{tCheckout('paymentVodafone')}</option>
                  <option value="bank_transfer">{tCheckout('paymentBank')}</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5">{tCheckout('notes')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-mono text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none resize-none"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-primary-container text-on-primary-container py-3.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? tCheckout('processing') : tCheckout('completeOrder')}
              </button>
            </form>
          </div>

          <div className="lg:w-96">
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 sticky top-24 shadow-xl">
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-6 text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/20">
                <i className="fas fa-file-invoice text-primary-container text-xs"></i>
                <span>{tCheckout('orderSummary')}</span>
              </h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  let imageUrl = '';
                  if (item.images) {
                    try {
                      const imagesArray =
                        typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                      if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                        imageUrl = imagesArray[0];
                      }
                    } catch {
                      // ignore invalid image JSON
                    }
                  }

                  return (
                    <div key={item.cart_id} className="flex items-center gap-3">
                      {imageUrl && (
                        <div className="w-14 h-14 bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={imageUrl}
                            alt={locale === 'ar' ? item.name_ar : item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-on-surface truncate">
                          {locale === 'ar' ? item.name_ar : item.name}
                        </p>
                        <p className="text-on-surface-variant font-mono text-[11px]">
                          {tCheckout('quantity')}: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold font-mono text-xs text-primary-container whitespace-nowrap">
                        {item.total_price.toLocaleString()} <span className="text-[10px] text-on-surface-variant font-sans">{tFooter('currency')}</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-outline-variant/30 pt-4 space-y-3 mb-6 font-mono text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>{tCart('subtotal')}</span>
                  <span className="font-semibold text-on-surface">
                    {subtotal.toLocaleString()} {tFooter('currency')}
                  </span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>{tCart('shipping')}</span>
                  <span className="font-semibold text-emerald-400">
                    {shippingAmount === 0
                      ? tCheckout('freeShipping')
                      : `${shippingAmount.toLocaleString()} ${tFooter('currency')}`}
                  </span>
                </div>
                <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-baseline">
                  <span className="font-bold text-sm uppercase text-on-surface">{tCart('total')}</span>
                  <span className="font-bold text-xl text-primary-container">
                    {totalAmount.toLocaleString()} <span className="text-xs text-on-surface-variant font-sans font-normal">{tFooter('currency')}</span>
                  </span>
                </div>
              </div>

              <Link
                href={`/${locale}/cart`}
                className="block w-full text-center text-xs font-mono uppercase tracking-wider text-primary-container hover:underline"
              >
                &larr; {tCheckout('backToCart')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
