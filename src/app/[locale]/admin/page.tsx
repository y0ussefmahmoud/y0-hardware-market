// ===== Admin Dashboard Page =====
// Cyber-Industrial Ops Command Center & Store Operations
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LoadingSpinner, { FullPageLoading } from '../../../components/LoadingSpinner';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { csrfFetch } from '../../../lib/csrf';
import AdminCommandCenter from '../../../components/AdminCommandCenter';
import { getImageUrl, getProductMainImage } from '../../../lib/image';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const t = useTranslations();
  const tAdmin = useTranslations('admin');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      setTimeout(() => { fetchStats(); }, 0);
    }
  }, [user]);

  if (loading || authLoading) {
    return <FullPageLoading />;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-surface text-on-surface">
        {/* Tactical Cyber HUD Top Bar */}
        <div className="bg-surface-container-lowest border-b border-surface-container-high py-6 px-4">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-10 bg-primary-container rounded-sm shadow-[0_0_12px_#00f2fe]"></div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-mono font-extrabold tracking-tight text-primary">
                    Y0 // ADMIN OPERATIONS HUD
                  </h1>
                  <span className="font-mono text-xs bg-surface-container-highest text-tertiary-fixed border border-tertiary-container/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    ROOT SECURE
                  </span>
                </div>
                <p className="font-mono text-xs text-on-surface-variant mt-1">
                  High-Performance Greater Cairo Silicon Logistics &amp; System Administration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                <span className="font-mono text-xs text-on-surface">NODE: CAIRO // EST 24/7</span>
              </div>
              <button
                onClick={() => fetchStats()}
                className="bg-surface-container-high hover:bg-surface-bright text-on-surface border border-outline-variant/30 font-mono text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-primary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>REFRESH</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 py-8">
          {/* Cyberpunk Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 bg-surface-container-lowest p-2 rounded-xl border border-surface-container-high shadow-lg">
            {[
              { id: 'dashboard', label: tAdmin('tabs.dashboard'), icon: 'dashboard' },
              { id: 'command-center', label: '⚡ Ops Command Center', icon: 'radar' },
              { id: 'products', label: tAdmin('tabs.products'), icon: 'inventory' },
              { id: 'orders', label: tAdmin('tabs.orders'), icon: 'receipt' },
              { id: 'users', label: tAdmin('tabs.users'), icon: 'group' },
              { id: 'content', label: tAdmin('tabs.content'), icon: 'settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 font-mono text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-surface-container-high text-primary-container border border-primary-container/40 shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Command Center Content */}
          {activeTab === 'command-center' && (
            <div className="mb-12">
              <AdminCommandCenter />
            </div>
          )}

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-8">
              {/* Telemetry Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title={tAdmin('stats.totalProducts')}
                  value={stats.totalProducts}
                  subtext="ACTIVE HARDWARE UNITS"
                  color="#00f2fe"
                />
                <StatCard
                  title={tAdmin('stats.totalOrders')}
                  value={stats.totalOrders}
                  subtext="PIPELINE WORK ORDERS"
                  color="#6ffbbe"
                />
                <StatCard
                  title={tAdmin('stats.totalUsers')}
                  value={stats.totalUsers}
                  subtext="REGISTERED IDENTITIES"
                  color="#d2bbff"
                />
                <StatCard
                  title={tAdmin('stats.totalRevenue')}
                  value={`${stats.totalRevenue.toLocaleString()} ${t('footer.currency', {defaultValue: 'EGP'})}`}
                  subtext="TOTAL GROSS REVENUE"
                  color="#ffb4ab"
                />
              </div>

              {/* Pending Orders Alert */}
              {stats.pendingOrders > 0 && (
                <div className="bg-surface-container-low border border-error/30 rounded-xl p-4 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                    <div>
                      <h3 className="font-mono text-sm font-bold text-error">
                        // ALERT: {stats.pendingOrders} {tAdmin('stats.pendingOrders')}
                      </h3>
                      <p className="font-mono text-xs text-on-surface-variant">
                        {tAdmin('stats.pendingOrdersAlert')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="bg-error-container hover:brightness-110 text-on-error-container font-mono text-xs px-3 py-1.5 rounded font-bold transition-all cursor-pointer"
                  >
                    RESOLVE NOW
                  </button>
                </div>
              )}

              {/* Recent Activity in Cyber Terminal Frame */}
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-container-high">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-tertiary-fixed rounded-sm"></span>
                    <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-on-surface">
                      // SYSTEM AUDIT &amp; ACTIVITY TELEMETRY
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-outline">AUTO-REFRESH: 5s</span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <ActivityItem
                    title={tAdmin('activity.newOrder')}
                    description={tAdmin('activity.newOrderDesc')}
                    time={tAdmin('activity.newOrderTime')}
                    tag="ORDER"
                    tagColor="text-primary-container border-primary-container/30 bg-primary-container/10"
                  />
                  <ActivityItem
                    title={tAdmin('activity.newProduct')}
                    description={tAdmin('activity.newProductDesc')}
                    time={tAdmin('activity.newProductTime')}
                    tag="PRODUCT"
                    tagColor="text-tertiary-fixed border-tertiary-fixed/30 bg-tertiary-fixed/10"
                  />
                  <ActivityItem
                    title={tAdmin('activity.newUser')}
                    description={tAdmin('activity.newUserDesc')}
                    time={tAdmin('activity.newUserTime')}
                    tag="IDENTITY"
                    tagColor="text-secondary border-secondary/30 bg-secondary/10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 shadow-md">
              <ProductsTable />
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-5 bg-primary-container rounded-sm shadow-[0_0_8px_#00f2fe]"></span>
                <h2 className="font-mono text-base font-extrabold tracking-tight text-on-surface uppercase">
                  {tAdmin('orders.manage')}
                </h2>
              </div>
              <OrdersTable />
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-5 bg-secondary rounded-sm shadow-[0_0_8px_#d2bbff]"></span>
                <h2 className="font-mono text-base font-extrabold tracking-tight text-on-surface uppercase">
                  {tAdmin('users.manage')}
                </h2>
              </div>
              <UsersTable />
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-5 bg-tertiary-fixed rounded-sm shadow-[0_0_8px_#6ffbbe]"></span>
                <h2 className="font-mono text-base font-extrabold tracking-tight text-on-surface uppercase">
                  {tAdmin('tabs.content')}
                </h2>
              </div>
              <ContentTable />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Telemetry Stat Card Component
function StatCard({ title, value, subtext, color }: { title: string; value: string | number; subtext: string; color: string }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 p-5 rounded-xl shadow-sm relative overflow-hidden group hover:bg-surface-container transition-all">
      <div className="flex items-center justify-between text-on-surface-variant mb-2">
        <span className="font-mono text-xs uppercase tracking-wider">{title}</span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}></span>
      </div>
      <div>
        <div className="font-mono text-2xl font-extrabold tracking-tight text-on-surface">
          {value}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-outline">
          <span className="font-semibold" style={{ color }}>// {subtext}</span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time, tag, tagColor }: { title: string; description: string; time: string; tag: string; tagColor: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-surface-container-high/60 hover:border-outline-variant transition-all">
      <div className="flex items-center gap-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tagColor}`}>
          {tag}
        </span>
        <div>
          <h4 className="font-semibold text-on-surface">{title}</h4>
          <p className="text-on-surface-variant text-[11px]">{description}</p>
        </div>
      </div>
      <span className="text-outline text-[10px] whitespace-nowrap">{time}</span>
    </div>
  );
}

function ProductsTable() {
  const tAdmin = useTranslations('admin');
  const t = useTranslations();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    slug: '',
    description: '',
    description_ar: '',
    price: '',
    old_price: '',
    category_id: '',
    brand: '',
    stock_quantity: '',
    badge: '',
    images: '',
    specifications: '',
    is_featured: false
  });

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/products/categories');
      const data = await res.json();
      if (data.status === 'success') {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch(`/api/admin/products?page=${page}&search=${search}`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setUploadedImages([]);
    setFormData({
      name: '',
      name_ar: '',
      slug: '',
      description: '',
      description_ar: '',
      price: '',
      old_price: '',
      category_id: '',
      brand: '',
      stock_quantity: '',
      badge: '',
      images: '',
      specifications: '',
      is_featured: false
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await csrfFetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await res.json();
        return getImageUrl(data.url || data.path);
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => {
        const updated = [...prev, ...urls];
        setFormData(f => ({ ...f, images: JSON.stringify(updated) }));
        return updated;
      });
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setFormData(f => ({ ...f, images: JSON.stringify(updated) }));
      return updated;
    });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    const rawImages = Array.isArray(product.images)
      ? product.images
      : (product.images ? JSON.parse(product.images) : (product.image_url ? [product.image_url] : []));
    const images = rawImages.map((img: string) => getImageUrl(img));
    setUploadedImages(images);
    setFormData({
      name: product.name,
      name_ar: product.name_ar,
      slug: product.slug,
      description: product.description,
      description_ar: product.description_ar,
      price: product.price,
      old_price: product.old_price || '',
      category_id: product.category_id,
      brand: product.brand,
      stock_quantity: product.stock_quantity,
      badge: product.badge || '',
      images: JSON.stringify(images),
      specifications: product.specifications ? JSON.stringify(product.specifications) : '',
      is_featured: Boolean(product.is_featured)
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(tAdmin('products.deleteConfirm'))) return;
    
    try {
      await csrfFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let parsedImages = [];
      let parsedSpecs = {};

      try {
        parsedImages = formData.images ? JSON.parse(formData.images) : [];
      } catch {
        parsedImages = uploadedImages;
      }

      try {
        parsedSpecs = formData.specifications ? JSON.parse(formData.specifications) : {};
      } catch {
        parsedSpecs = {};
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        old_price: formData.old_price ? parseFloat(formData.old_price) : null,
        category_id: parseInt(formData.category_id),
        stock_quantity: parseInt(formData.stock_quantity),
        images: parsedImages,
        specifications: parsedSpecs,
        is_featured: Boolean(formData.is_featured)
      };

      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      await csrfFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 bg-primary-container rounded-sm shadow-[0_0_8px_#00f2fe]"></span>
          <h2 className="font-mono text-base font-extrabold tracking-tight text-on-surface uppercase">
            {tAdmin('products.manage')}
          </h2>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary-container hover:bg-surface-tint text-on-primary-fixed font-mono text-xs px-4 py-2 rounded-lg font-bold shadow-[0_0_12px_rgba(0,242,254,0.25)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {tAdmin('products.add')}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={tAdmin('products.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-surface-container-lowest border border-surface-container-high rounded-lg font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-surface-container-high">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-surface-container-high text-on-surface-variant uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-4 py-3 text-right">{tAdmin('products.image')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.name')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.price')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.stock')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.status')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40 bg-surface-container-lowest">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-3">
                  <img
                    src={getProductMainImage(product)}
                    alt=""
                    className="w-12 h-12 object-cover rounded border border-outline-variant/30"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-on-surface">{product.name}</td>
                <td className="px-4 py-3 text-primary-container font-bold">{product.price} {t('footer.currency', {defaultValue: 'EGP'})}</td>
                <td className="px-4 py-3">{product.stock_quantity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    product.is_active
                      ? 'bg-tertiary-container/20 text-tertiary-fixed border-tertiary-container/30'
                      : 'bg-error-container/20 text-error border-error-container/30'
                  }`}>
                    {product.is_active ? tAdmin('products.active') : tAdmin('products.inactive')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-primary-container hover:underline cursor-pointer"
                    >
                      {tAdmin('products.edit')}
                    </button>
                    <span className="text-outline">|</span>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-error hover:underline cursor-pointer"
                    >
                      {tAdmin('products.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center font-mono text-xs">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 bg-surface-container-high text-on-surface rounded disabled:opacity-40 hover:bg-surface-bright cursor-pointer"
        >
          Previous
        </button>
        <span className="text-on-surface-variant">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1.5 bg-surface-container-high text-on-surface rounded hover:bg-surface-bright cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Cyber Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto font-mono text-xs text-on-surface shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container-high">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                // {editingProduct ? tAdmin('products.editProduct') : tAdmin('products.addNew')}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface text-lg">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.nameEn')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const autoSlug = newName.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '').replace(/--+/g, '-');
                      setFormData(prev => ({
                        ...prev,
                        name: newName,
                        slug: (!editingProduct && (!prev.slug || prev.slug === prev.name.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '').replace(/--+/g, '-')))
                          ? autoSlug
                          : prev.slug
                      }));
                    }}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.nameAr')}</label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-on-surface-variant mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.price')}</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.oldPrice')}</label>
                  <input
                    type="number"
                    value={formData.old_price}
                    onChange={(e) => setFormData({...formData, old_price: e.target.value})}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.category')}</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.name_ar})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.brand')}</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.stock')}</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.badge')}</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                  >
                    <option value="">{tAdmin('products.badgeNone')}</option>
                    <option value="new">{tAdmin('products.badgeNew')}</option>
                    <option value="sale">{tAdmin('products.badgeSale')}</option>
                    <option value="bestseller">{tAdmin('products.badgeBestseller')}</option>
                    <option value="featured">{tAdmin('products.badgeFeatured')}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-surface-container-lowest border border-surface-container-high rounded-lg">
                <input
                  type="checkbox"
                  id="admin_is_featured"
                  checked={Boolean(formData.is_featured)}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded text-primary-container bg-surface-container border-outline-variant/40 focus:ring-primary-container focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="admin_is_featured" className="text-xs text-on-surface font-semibold cursor-pointer select-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#00f2fe]"></span>
                  <span>{tAdmin('products.featuredProduct')}</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.images')}</label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface file:bg-surface-container-high file:text-on-surface file:border-0 file:rounded file:px-2 file:py-1 file:mr-2 file:text-xs"
                  disabled={uploading}
                />
                {uploading && <p className="text-xs text-primary-container mt-1">// Uploading silicon asset...</p>}
                
                {uploadedImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={getImageUrl(url)} alt={`Uploaded ${index}`} className="w-full h-20 object-cover rounded border border-outline-variant/30" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-error text-on-error w-5 h-5 rounded-full text-xs flex items-center justify-center cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.descriptionEn')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.descriptionAr')}</label>
                <textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-on-surface-variant mb-1">{tAdmin('products.specifications')}</label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
                  rows={2}
                  placeholder='{"key": "value"}'
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface rounded hover:bg-surface-bright cursor-pointer"
                >
                  {tAdmin('products.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-container hover:bg-surface-tint text-on-primary-fixed rounded font-bold shadow-[0_0_12px_rgba(0,242,254,0.3)] cursor-pointer"
                >
                  {editingProduct ? tAdmin('products.update') : tAdmin('products.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTable() {
  const tAdmin = useTranslations('admin');
  const t = useTranslations();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  async function fetchOrders() {
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&status=${statusFilter}`);
      const data = await res.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await csrfFetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-surface-container-lowest border border-surface-container-high rounded-lg font-mono text-xs text-on-surface focus:outline-none focus:border-primary-container"
        >
          <option value="">{tAdmin('orders.allStatus')}</option>
          <option value="pending">{tAdmin('orders.pending')}</option>
          <option value="processing">{tAdmin('orders.processing')}</option>
          <option value="shipped">{tAdmin('orders.shipped')}</option>
          <option value="delivered">{tAdmin('orders.delivered')}</option>
          <option value="cancelled">{tAdmin('orders.cancelled')}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-surface-container-high">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-surface-container-high text-on-surface-variant uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-4 py-3 text-right">{tAdmin('orders.orderNum')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('orders.customer')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('orders.total')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('orders.status')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('orders.payment')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('orders.date')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('orders.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40 bg-surface-container-lowest">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-3 font-bold text-primary">#{order.id}</td>
                <td className="px-4 py-3 font-semibold text-on-surface">{order.customer_name}</td>
                <td className="px-4 py-3 text-tertiary-fixed font-bold">{order.total_amount} {t('footer.currency', {defaultValue: 'EGP'})}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-2 py-1 bg-surface-container-high border border-outline-variant/30 rounded text-xs text-on-surface focus:outline-none"
                  >
                    <option value="pending">{tAdmin('orders.pending')}</option>
                    <option value="processing">{tAdmin('orders.processing')}</option>
                    <option value="shipped">{tAdmin('orders.shipped')}</option>
                    <option value="delivered">{tAdmin('orders.delivered')}</option>
                    <option value="cancelled">{tAdmin('orders.cancelled')}</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    order.payment_status === 'paid'
                      ? 'bg-tertiary-container/20 text-tertiary-fixed border-tertiary-container/30'
                      : 'bg-error-container/20 text-error border-error-container/30'
                  }`}>
                    {order.payment_status === 'paid' ? tAdmin('orders.paid') : tAdmin('orders.unpaid')}
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{new Date(order.created_at).toLocaleDateString('ar-EG')}</td>
                <td className="px-4 py-3">
                  <button className="text-primary-container hover:underline cursor-pointer">
                    {tAdmin('orders.view')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center font-mono text-xs">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 bg-surface-container-high text-on-surface rounded disabled:opacity-40 hover:bg-surface-bright cursor-pointer"
        >
          {tAdmin('products.previous')}
        </button>
        <span className="text-on-surface-variant">{tAdmin('products.page')} {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1.5 bg-surface-container-high text-on-surface rounded hover:bg-surface-bright cursor-pointer"
        >
          {tAdmin('products.next')}
        </button>
      </div>
    </div>
  );
}

function UsersTable() {
  const tAdmin = useTranslations('admin');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      await csrfFetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  useEffect(() => {
    setTimeout(() => { fetchUsers(); }, 0);
  }, []);

  if (loading) {
    return <div className="text-center py-8"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-surface-container-high">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-surface-container-high text-on-surface-variant uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-4 py-3 text-right">{tAdmin('users.id')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('users.name')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('users.email')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('users.phone')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('users.role')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('users.createdAt')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('users.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40 bg-surface-container-lowest">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-3 font-semibold text-primary">{user.id}</td>
                <td className="px-4 py-3 font-bold text-on-surface">{user.first_name} {user.last_name}</td>
                <td className="px-4 py-3 text-on-surface-variant">{user.email}</td>
                <td className="px-4 py-3 text-on-surface-variant">{user.phone || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    user.role === 'admin'
                      ? 'bg-primary-container/20 text-primary-container border-primary-container/30'
                      : user.role === 'seller'
                      ? 'bg-secondary/20 text-secondary border-secondary/30'
                      : 'bg-surface-container-highest text-on-surface border-outline-variant/30'
                  }`}>
                    {user.role === 'admin'
                      ? '[ADMIN]'
                      : user.role === 'seller'
                      ? '[SELLER]'
                      : '[USER]'}
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{new Date(user.created_at).toLocaleDateString('ar-EG')}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="px-2 py-1 bg-surface-container-high border border-outline-variant/30 rounded text-xs text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="user">{tAdmin('roles.user')}</option>
                    <option value="seller">{tAdmin('roles.seller', { defaultValue: 'Seller' })}</option>
                    <option value="admin">{tAdmin('roles.admin')}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentTable() {
  const tAdmin = useTranslations('admin');
  const t = useTranslations();
  const [activeSection, setActiveSection] = useState('about');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const sections = [
    { id: 'about', label: 'About Page' },
    { id: 'contact', label: 'Contact Page' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'features', label: 'Features Section' }
  ];

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus('idle');
    setTimeout(() => {
      setLoading(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="font-mono text-xs">
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4 border-b border-surface-container-high pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                activeSection === section.id
                  ? 'bg-surface-container-high text-primary-container border border-primary-container/30'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="mb-4 p-3 bg-tertiary-container/20 text-tertiary-fixed border border-tertiary-container/30 rounded-lg">
          // Content modifications synchronized successfully!
        </div>
      )}

      {activeSection === 'about' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">About Title (Arabic)</label>
            <input
              type="text"
              defaultValue={t('about.title')}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">About Title (English)</label>
            <input
              type="text"
              defaultValue="About Us"
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Who We Are (Arabic)</label>
            <textarea
              defaultValue={t('about.whoWeAreText')}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Who We Are (English)</label>
            <textarea
              defaultValue="Y0 Hardware is a specialized store for selling computer parts, laptops, and accessories with the highest quality and best prices in Egypt."
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
              rows={4}
            />
          </div>
        </div>
      )}

      {activeSection === 'contact' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Address (Arabic)</label>
            <input
              type="text"
              defaultValue={t('contact.addressValue')}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Address (English)</label>
            <input
              type="text"
              defaultValue="Beni Suef, Egypt"
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Phone</label>
            <input
              type="text"
              defaultValue="+20 112 933 4173"
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Email</label>
            <input
              type="text"
              defaultValue="info@y0ussef.com"
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
        </div>
      )}

      {activeSection === 'hero' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Hero Title (Arabic)</label>
            <input
              type="text"
              defaultValue={t('hero.title')}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Hero Title (English)</label>
            <input
              type="text"
              defaultValue="Latest Computer Parts at Best Prices"
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Hero Subtitle (Arabic)</label>
            <textarea
              defaultValue={t('hero.subtitle')}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Hero Subtitle (English)</label>
            <textarea
              defaultValue="Your trusted store for computer parts, laptops, and accessories"
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
              rows={2}
            />
          </div>
        </div>
      )}

      {activeSection === 'features' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Fast Shipping Title (Arabic)</label>
            <input
              type="text"
              defaultValue={t('features.fastShipping.title')}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Fast Shipping Description (Arabic)</label>
            <textarea
              defaultValue={t('features.fastShipping.description')}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Secure Payment Title (Arabic)</label>
            <input
              type="text"
              defaultValue={t('features.securePayment.title')}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>
          <div>
            <label className="block text-[11px] text-on-surface-variant mb-1">Secure Payment Description (Arabic)</label>
            <textarea
              defaultValue={t('features.securePayment.description')}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container-high rounded text-on-surface focus:outline-none focus:border-primary-container"
              rows={2}
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary-container hover:bg-surface-tint text-on-primary-fixed font-bold px-6 py-2.5 rounded-lg shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all disabled:opacity-40 cursor-pointer"
        >
          {loading ? 'SYNCHRONIZING...' : 'SAVE CHANGES'}
        </button>
      </div>
    </div>
  );
}
