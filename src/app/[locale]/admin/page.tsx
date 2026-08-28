// ===== Admin Dashboard Page =====
// Main admin panel for managing products, orders, and users
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LoadingSpinner, { FullPageLoading } from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { csrfFetch } from '@/lib/csrf';

// Add useState import for ProductsTable

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
      <div className="min-h-screen bg-gray-100">
        {/* Admin Header */}
        <div className="bg-purple-600 text-white py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">{tAdmin('dashboard')}</h1>
            <p className="text-purple-100 mt-2">{tAdmin('subtitle')}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <div className="flex space-x-4 rtl:space-x-reverse mb-8 border-b">
            {['dashboard', 'products', 'orders', 'users', 'content'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold ${
                  activeTab === tab
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {tab === 'dashboard' && tAdmin('tabs.dashboard')}
                {tab === 'products' && tAdmin('tabs.products')}
                {tab === 'orders' && tAdmin('tabs.orders')}
                {tab === 'users' && tAdmin('tabs.users')}
                {tab === 'content' && tAdmin('tabs.content')}
              </button>
            ))}
          </div>

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && stats && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title={tAdmin('stats.totalProducts')}
                  value={stats.totalProducts}
                  icon="fa-box"
                  color="bg-blue-500"
                />
                <StatCard
                  title={tAdmin('stats.totalOrders')}
                  value={stats.totalOrders}
                  icon="fa-shopping-cart"
                  color="bg-green-500"
                />
                <StatCard
                  title={tAdmin('stats.totalUsers')}
                  value={stats.totalUsers}
                  icon="fa-users"
                  color="bg-purple-500"
                />
                <StatCard
                  title={tAdmin('stats.totalRevenue')}
                  value={`${stats.totalRevenue.toLocaleString()} ${t('footer.currency', {defaultValue: 'EGP'})}`}
                  icon="fa-dollar-sign"
                  color="bg-yellow-500"
                />
              </div>

              {/* Pending Orders Alert */}
              {stats.pendingOrders > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center">
                    <i className="fas fa-exclamation-triangle text-red-500 text-2xl mr-4 rtl:mr-0 rtl:ml-4"></i>
                    <div>
                      <h3 className="font-semibold text-red-800">
                        {stats.pendingOrders} {tAdmin('stats.pendingOrders')}
                      </h3>
                      <p className="text-red-600 text-sm">
                        {tAdmin('stats.pendingOrdersAlert')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">{tAdmin('activity.title')}</h2>
                <div className="space-y-4">
                  <ActivityItem
                    title={tAdmin('activity.newOrder')}
                    description={tAdmin('activity.newOrderDesc')}
                    time={tAdmin('activity.newOrderTime')}
                    icon="fa-shopping-cart"
                  />
                  <ActivityItem
                    title={tAdmin('activity.newProduct')}
                    description={tAdmin('activity.newProductDesc')}
                    time={tAdmin('activity.newProductTime')}
                    icon="fa-plus-circle"
                  />
                  <ActivityItem
                    title={tAdmin('activity.newUser')}
                    description={tAdmin('activity.newUserDesc')}
                    time={tAdmin('activity.newUserTime')}
                    icon="fa-user-plus"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <ProductsTable />
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">{tAdmin('orders.manage')}</h2>
              <OrdersTable />
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">{tAdmin('users.manage')}</h2>
              <UsersTable />
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">{tAdmin('tabs.content')}</h2>
              <ContentTable />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Helper Components
function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center`}>
          <i className={`fas ${icon} text-white text-xl`}></i>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time, icon }: { title: string; description: string; time: string; icon: string }) {
  return (
    <div className="flex items-start space-x-4 rtl:space-x-reverse">
      <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
        <i className={`fas ${icon} text-purple-600`}></i>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="text-gray-400 text-xs mt-1">{time}</p>
      </div>
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
    specifications: ''
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
      specifications: ''
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
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
      setFormData(prev => ({
        ...prev,
        images: JSON.stringify([...uploadedImages, ...urls])
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setFormData(prev => ({
      ...prev,
      images: JSON.stringify(newImages)
    }));
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    const images = Array.isArray(product.images) ? product.images : (product.images ? JSON.parse(product.images) : []);
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
      specifications: product.specifications ? JSON.stringify(product.specifications) : ''
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

      // Parse images
      try {
        parsedImages = formData.images ? JSON.parse(formData.images) : [];
      } catch {
        parsedImages = uploadedImages;
      }

      // Parse specifications
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
        specifications: parsedSpecs
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{tAdmin('products.manage')}</h2>
        <button onClick={handleAdd} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          <i className="fas fa-plus ml-2 rtl:ml-0 rtl:mr-2"></i>
          {tAdmin('products.add')}
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder={tAdmin('products.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right">{tAdmin('products.image')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.name')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.price')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.stock')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.status')}</th>
              <th className="px-4 py-3 text-right">{tAdmin('products.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img src={product.images && Array.isArray(product.images) && product.images[0] ? product.images[0] : product.image_url} alt="" className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.price} {t('footer.currency', {defaultValue: 'EGP'})}</td>
                <td className="px-4 py-3">{product.stock_quantity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.is_active ? tAdmin('products.active') : tAdmin('products.inactive')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 ml-2">{tAdmin('products.edit')}</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">{tAdmin('products.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingProduct ? tAdmin('products.editProduct') : tAdmin('products.addNew')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.nameEn')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.nameAr')}</label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.price')}</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.oldPrice')}</label>
                  <input
                    type="number"
                    value={formData.old_price}
                    onChange={(e) => setFormData({...formData, old_price: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.category')}</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
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
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.brand')}</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.stock')}</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.badge')}</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">{tAdmin('products.badgeNone')}</option>
                    <option value="new">{tAdmin('products.badgeNew')}</option>
                    <option value="sale">{tAdmin('products.badgeSale')}</option>
                    <option value="bestseller">{tAdmin('products.badgeBestseller')}</option>
                    <option value="featured">{tAdmin('products.badgeFeatured')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{tAdmin('products.images')}</label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="w-full px-3 py-2 border rounded"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">{tAdmin('products.uploading')}</p>}
                
                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Uploaded ${index}`} className="w-full h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{tAdmin('products.imagesJson')}</label>
                <textarea
                  value={formData.images}
                  onChange={(e) => setFormData({...formData, images: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                  placeholder='["https://example.com/image.jpg"]'
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{tAdmin('products.descriptionEn')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{tAdmin('products.descriptionAr')}</label>
                <textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{tAdmin('products.specifications')}</label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                  placeholder='{"key": "value"}'
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {tAdmin('products.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
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
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">{tAdmin('orders.allStatus')}</option>
          <option value="pending">{tAdmin('orders.pending')}</option>
          <option value="processing">{tAdmin('orders.processing')}</option>
          <option value="shipped">{tAdmin('orders.shipped')}</option>
          <option value="delivered">{tAdmin('orders.delivered')}</option>
          <option value="cancelled">{tAdmin('orders.cancelled')}</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
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
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">#{order.id}</td>
                <td className="px-4 py-3">{order.customer_name}</td>
                <td className="px-4 py-3">{order.total_amount} {t('footer.currency', {defaultValue: 'EGP'})}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="pending">{tAdmin('orders.pending')}</option>
                    <option value="processing">{tAdmin('orders.processing')}</option>
                    <option value="shipped">{tAdmin('orders.shipped')}</option>
                    <option value="delivered">{tAdmin('orders.delivered')}</option>
                    <option value="cancelled">{tAdmin('orders.cancelled')}</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.payment_status === 'paid' ? tAdmin('orders.paid') : tAdmin('orders.unpaid')}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString('ar-EG')}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:text-blue-800">{tAdmin('orders.view')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          {tAdmin('products.previous')}
        </button>
        <span>{tAdmin('products.page')} {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
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
      <table className="w-full">
        <thead className="bg-gray-50">
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
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{user.id}</td>
              <td className="px-4 py-3">{user.first_name} {user.last_name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.phone || '-'}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.role === 'admin' ? tAdmin('roles.admin') : tAdmin('roles.user')}
                </span>
              </td>
              <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString('ar-EG')}</td>
              <td className="px-4 py-3">
                <button 
                  onClick={() => updateUserRole(user.id, user.role === 'user' ? 'admin' : 'user')}
                  className="text-purple-600 hover:text-purple-800"
                >
                  {user.role === 'user' ? tAdmin('roles.admin') : tAdmin('roles.user')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    
    // Simulate save - in real implementation, this would call an API
    setTimeout(() => {
      setLoading(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex space-x-4 rtl:space-x-reverse mb-4 border-b">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 font-semibold ${
                activeSection === section.id
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          Content saved successfully!
        </div>
      )}

      {activeSection === 'about' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">About Title (Arabic)</label>
            <input
              type="text"
              defaultValue={t('about.title')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">About Title (English)</label>
            <input
              type="text"
              defaultValue="About Us"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Who We Are (Arabic)</label>
            <textarea
              defaultValue={t('about.whoWeAreText')}
              className="w-full px-3 py-2 border rounded"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Who We Are (English)</label>
            <textarea
              defaultValue="Y0 Hardware is a specialized store for selling computer parts, laptops, and accessories with the highest quality and best prices in Egypt."
              className="w-full px-3 py-2 border rounded"
              rows={4}
            />
          </div>
        </div>
      )}

      {activeSection === 'contact' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address (Arabic)</label>
            <input
              type="text"
              defaultValue={t('contact.addressValue')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address (English)</label>
            <input
              type="text"
              defaultValue="Beni Suef, Egypt"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              defaultValue="+20 112 933 4173"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              defaultValue="info@y0ussef.com"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      )}

      {activeSection === 'hero' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hero Title (Arabic)</label>
            <input
              type="text"
              defaultValue={t('hero.title')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Title (English)</label>
            <input
              type="text"
              defaultValue="Latest Computer Parts at Best Prices"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Subtitle (Arabic)</label>
            <textarea
              defaultValue={t('hero.subtitle')}
              className="w-full px-3 py-2 border rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Subtitle (English)</label>
            <textarea
              defaultValue="Your trusted store for computer parts, laptops, and accessories"
              className="w-full px-3 py-2 border rounded"
              rows={2}
            />
          </div>
        </div>
      )}

      {activeSection === 'features' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fast Shipping Title (Arabic)</label>
            <input
              type="text"
              defaultValue={t('features.fastShipping.title')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fast Shipping Description (Arabic)</label>
            <textarea
              defaultValue={t('features.fastShipping.description')}
              className="w-full px-3 py-2 border rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Secure Payment Title (Arabic)</label>
            <input
              type="text"
              defaultValue={t('features.securePayment.title')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Secure Payment Description (Arabic)</label>
            <textarea
              defaultValue={t('features.securePayment.description')}
              className="w-full px-3 py-2 border rounded"
              rows={2}
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
