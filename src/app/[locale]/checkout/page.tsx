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
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-6"></i>
        <h1 className="text-2xl font-bold mb-4">{tCart('empty')}</h1>
        <p className="text-gray-600 mb-6">{tCart('emptyMessage')}</p>
        <Link
          href={`/${locale}/shop`}
          className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {tCart('browseProducts')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{tCheckout('title')}</h1>
          <p className="text-gray-600">{tCheckout('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">{tCheckout('shippingInfo')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{tAuth('firstName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{tAuth('lastName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{tAuth('email')}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{tAuth('phone')}</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{tCheckout('address')}</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{tCheckout('city')}</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{tCheckout('postalCode')}</label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{tCheckout('paymentMethod')}</label>
                <select
                  required
                  value={formData.payment_method}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_method: e.target.value as 'cod' | 'vodafone' | 'bank_transfer',
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="cod">{tCheckout('paymentCod')}</option>
                  <option value="vodafone">{tCheckout('paymentVodafone')}</option>
                  <option value="bank_transfer">{tCheckout('paymentBank')}</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">{tCheckout('notes')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? tCheckout('processing') : tCheckout('completeOrder')}
              </button>
            </form>
          </div>

          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-6">{tCheckout('orderSummary')}</h3>

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
                    <div key={item.cart_id} className="flex items-center gap-4">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={locale === 'ar' ? item.name_ar : item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {locale === 'ar' ? item.name_ar : item.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {tCheckout('quantity')}: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-purple-600">
                        {item.total_price.toLocaleString()} {tFooter('currency')}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tCart('subtotal')}</span>
                  <span className="font-semibold">
                    {subtotal.toLocaleString()} {tFooter('currency')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tCart('shipping')}</span>
                  <span className="font-semibold">
                    {shippingAmount === 0
                      ? tCheckout('freeShipping')
                      : `${shippingAmount.toLocaleString()} ${tFooter('currency')}`}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold text-lg">{tCart('total')}</span>
                  <span className="font-bold text-lg text-purple-600">
                    {totalAmount.toLocaleString()} {tFooter('currency')}
                  </span>
                </div>
              </div>

              <Link
                href={`/${locale}/cart`}
                className="block w-full mt-4 text-center text-purple-600 hover:text-purple-700"
              >
                {tCheckout('backToCart')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
