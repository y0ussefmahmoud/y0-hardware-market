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
      <div className="container mx-auto px-4 py-32 text-center bg-surface min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-container/20 border-t-primary-container mx-auto"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col bg-surface text-on-surface min-h-screen">
      <div className="bg-gradient-to-b from-surface-container-lowest via-surface-container to-surface border-b border-outline-variant/30 py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,242,254,0.08),rgba(11,19,38,0))] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono text-xs uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            <span>ORDER TELEMETRY & TRACKING</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-on-surface font-mono">{tOrders('title')}</h1>
          <p className="text-on-surface-variant font-mono text-xs">{tOrders('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {successOrderNumber && (
          <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-400 font-mono text-xs">
            <h2 className="font-bold text-sm mb-1">{tOrders('successTitle')}</h2>
            <p>{tOrders('successMessage', { orderNumber: successOrderNumber })}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-xl py-16 text-center">
            <i className="fas fa-shopping-bag text-5xl text-outline-variant/40 mb-6"></i>
            <h2 className="text-xl font-bold font-mono mb-2 text-on-surface">{tOrders('empty')}</h2>
            <p className="text-on-surface-variant font-mono text-xs mb-6 max-w-sm mx-auto">{tOrders('emptyMessage')}</p>
            <Link
              href={`/${locale}/shop`}
              className="inline-block bg-primary-container text-on-primary-container px-8 py-3.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all"
            >
              {tOrders('browseProducts')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 shadow-md hover:border-primary-container/40 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-bold font-mono text-base text-on-surface">
                      {tOrders('orderNumber')} <span className="text-primary-container">#{order.order_number}</span>
                    </p>
                    <p className="text-on-surface-variant font-mono text-xs mt-1">
                      {tOrders('date')}: {new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 font-mono text-xs">
                    <span className="px-3 py-1 rounded-full bg-primary-container/15 text-primary-container border border-primary-container/30 uppercase tracking-wider font-semibold">
                      {statusLabel(order.status)}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/40 uppercase tracking-wider">
                      {paymentLabel(order.payment_status)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 font-mono text-xs">
                  <p className="text-on-surface-variant">
                    {tOrders('items')}: <span className="text-on-surface font-semibold">{order.item_count ?? 0}</span>
                  </p>
                  <p className="font-bold text-base text-primary-container">
                    {tOrders('total')}: {Number(order.total_amount).toLocaleString()} <span className="text-xs text-on-surface-variant font-sans font-normal">{tFooter('currency')}</span>
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
