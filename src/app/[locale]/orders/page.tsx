'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/types';

export default function OrdersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params.locale as string) || 'en';
  const tOrders = useTranslations('orders');
  const tFooter = useTranslations('footer');
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const successOrderNumber = searchParams.get('order');

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders', { credentials: 'include' });
        const data = await res.json();

        if (data.status === 'success') {
          setOrders(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [authLoading, isAuthenticated, locale, router]);

  const statusLabel = (status: Order['status']) => {
    const map: Record<Order['status'], string> = {
      pending: tOrders('statusPending'),
      processing: tOrders('statusProcessing'),
      shipped: tOrders('statusShipped'),
      delivered: tOrders('statusDelivered'),
      cancelled: tOrders('statusCancelled'),
    };
    return map[status] || status;
  };

  const paymentLabel = (status: Order['payment_status']) => {
    const map: Record<Order['payment_status'], string> = {
      pending: tOrders('paymentPending'),
      paid: tOrders('paymentPaid'),
      failed: tOrders('paymentFailed'),
      refunded: tOrders('paymentRefunded'),
    };
    return map[status] || status;
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

  return (
    <div className="flex flex-col">
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{tOrders('title')}</h1>
          <p className="text-gray-600">{tOrders('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {successOrderNumber && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            <h2 className="font-semibold">{tOrders('successTitle')}</h2>
            <p>{tOrders('successMessage', { orderNumber: successOrderNumber })}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md py-16 text-center">
            <i className="fas fa-shopping-bag text-6xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold mb-4">{tOrders('empty')}</h2>
            <p className="text-gray-600 mb-6">{tOrders('emptyMessage')}</p>
            <Link
              href={`/${locale}/shop`}
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {tOrders('browseProducts')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-bold text-lg">
                      {tOrders('orderNumber')} #{order.order_number}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {tOrders('date')}: {new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      {statusLabel(order.status)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                      {paymentLabel(order.payment_status)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-gray-600">
                    {tOrders('items')}: {order.item_count ?? 0}
                  </p>
                  <p className="font-bold text-purple-600 text-lg">
                    {tOrders('total')}: {Number(order.total_amount).toLocaleString()} {tFooter('currency')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
