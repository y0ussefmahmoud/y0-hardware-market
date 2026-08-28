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
      const data = await res.json();
      
      console.log('Cart API response:', data);
      
      if (data.status === 'success') {
        setCartItems(data.data.items);
        setSubtotal(data.data.subtotal);
      } else {
        console.error('Cart API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => { fetchCart(); }, 0);
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
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
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
      {/* Page Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{tCart('title')}</h1>
          <p className="text-gray-600">{cartItems.length} {tCart('items')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cartItems.map((item) => {
                // Parse images JSON string to get first image
                let imageUrl = '';
                if (item.images) {
                  try {
                    const imagesArray = typeof item.images === 'string' 
                      ? JSON.parse(item.images) 
                      : item.images;
                    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                      imageUrl = imagesArray[0];
                    }
                  } catch (error) {
                    console.error('Error parsing images:', error);
                  }
                }

                return (
                <div key={item.cart_id} className="flex items-center p-6 border-b last:border-b-0">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name_ar}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 mr-4 rtl:mr-0 rtl:ml-4">
                    <Link href={`/${locale}/product/${item.id}`} className="font-semibold hover:text-purple-600">
                      {locale === 'ar' ? item.name_ar : item.name}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">{item.price.toLocaleString()} {tFooter('currency')}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border rounded">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="mr-4 rtl:mr-0 rtl:ml-4 text-right">
                    <p className="font-bold text-purple-600">
                      {item.total_price.toLocaleString()} {tFooter('currency')}
                    </p>
                  </div>

                  {/* Remove */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                );
              })}
            </div>

            {/* Coupon Code */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex space-x-4 rtl:space-x-reverse">
                <input
                  type="text"
                  placeholder={tCart('couponPlaceholder')}
                  className="flex-1 border rounded-lg px-4 py-2"
                />
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  {tCart('apply')}
                </button>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-6">{tCart('title')}</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tCart('subtotal')}</span>
                  <span className="font-semibold">{subtotal.toLocaleString()} {tFooter('currency')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tCart('shipping')}</span>
                  <span className="font-semibold">{locale === 'ar' ? 'مجاني' : 'Free'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tCart('discount')}</span>
                  <span className="font-semibold text-red-500">0 {tFooter('currency')}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold text-lg">{tCart('total')}</span>
                  <span className="font-bold text-lg text-purple-600">{subtotal.toLocaleString()} {tFooter('currency')}</span>
                </div>
              </div>

              <Link
                href={`/${locale}/checkout`}
                className="block w-full bg-purple-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-purple-700 transition-colors"
              >
                {tCart('checkout')}
              </Link>

              <Link
                href={`/${locale}/shop`}
                className="block w-full mt-4 text-center text-purple-600 hover:text-purple-700"
              >
                {tCart('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
