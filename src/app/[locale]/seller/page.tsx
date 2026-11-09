// ===== Seller Dashboard Page =====
// Vendor panel for sellers to manage their own products
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

interface SellerProduct {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  price: number;
  old_price: number | null;
  category_id: number;
  stock_quantity: number;
  brand: string;
  images: string[];
  specifications: Record<string, string>;
  badge: string | null;
  is_active: boolean;
  seller_id: number;
  category_name?: string;
  category_name_ar?: string;
}

export default function SellerDashboard() {
  const t = useTranslations();
  const tAdmin = useTranslations('admin');
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
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

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'seller')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'seller') {
      fetchProducts();
      fetchCategories();
    }
  }, [user, page, search]);

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
      const res = await fetch(`/api/seller/products?page=${page}&search=${search}`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching seller products:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setEditingProduct(null);
    setUploadedImages([]);
    setFormData({
      name: '', name_ar: '', slug: '', description: '', description_ar: '',
      price: '', old_price: '', category_id: '', brand: '', stock_quantity: '',
      badge: '', images: '', specifications: ''
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await csrfFetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        return data.url;
      });
      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
      setFormData(prev => ({ ...prev, images: JSON.stringify([...uploadedImages, ...urls]) }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setFormData(prev => ({ ...prev, images: JSON.stringify(newImages) }));
  };

  const handleEdit = (product: SellerProduct) => {
    setEditingProduct(product);
    const images = Array.isArray(product.images) ? product.images : (product.images ? JSON.parse(product.images as unknown as string) : []);
    setUploadedImages(images);
    setFormData({
      name: product.name,
      name_ar: product.name_ar,
      slug: product.slug,
      description: product.description,
      description_ar: product.description_ar,
      price: String(product.price),
      old_price: product.old_price ? String(product.old_price) : '',
      category_id: String(product.category_id),
      brand: product.brand,
      stock_quantity: String(product.stock_quantity),
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
      let parsedImages: string[] = [];
      let parsedSpecs = {};
      try { parsedImages = formData.images ? JSON.parse(formData.images) : []; } catch { parsedImages = uploadedImages; }
      try { parsedSpecs = formData.specifications ? JSON.parse(formData.specifications) : {}; } catch { parsedSpecs = {}; }

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

  if (loading || authLoading) {
    return <FullPageLoading />;
  }

  if (!user || user.role !== 'seller') {
    return null;
  }

  const totalStock = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
  const activeProducts = products.filter(p => p.is_active).length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Seller Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">🏪 {tAdmin('seller.dashboard', { defaultValue: 'Seller Dashboard' })}</h1>
            <p className="text-blue-100 mt-2">
              {tAdmin('seller.welcome', { defaultValue: 'Manage your products and track your sales' })}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Seller Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{tAdmin('seller.myProducts', { defaultValue: 'My Products' })}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{products.length}</p>
                </div>
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{tAdmin('seller.activeListings', { defaultValue: 'Active Listings' })}</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{activeProducts}</p>
                </div>
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{tAdmin('seller.totalStock', { defaultValue: 'Total Stock' })}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{totalStock}</p>
                </div>
                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Products Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{tAdmin('seller.myProducts', { defaultValue: 'My Products' })}</h2>
              <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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
                        <img src={product.images && Array.isArray(product.images) && product.images[0] ? product.images[0] : '/placeholder.png'} alt="" className="w-12 h-12 object-cover rounded" />
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

            {products.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <p className="text-lg font-medium">{tAdmin('seller.noProducts', { defaultValue: 'No products yet' })}</p>
                <p className="text-sm mt-1">{tAdmin('seller.addFirst', { defaultValue: 'Click "Add Product" to list your first item' })}</p>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Previous</button>
              <span>Page {page}</span>
              <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-gray-200 rounded">Next</button>
            </div>
          </div>
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">{editingProduct ? tAdmin('products.editProduct') : tAdmin('products.addNew')}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{tAdmin('products.nameEn')}</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{tAdmin('products.nameAr')}</label>
                    <input type="text" value={formData.name_ar} onChange={(e) => setFormData({...formData, name_ar: e.target.value})} className="w-full px-3 py-2 border rounded" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{tAdmin('products.price')}</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{tAdmin('products.oldPrice')}</label>
                    <input type="number" value={formData.old_price} onChange={(e) => setFormData({...formData, old_price: e.target.value})} className="w-full px-3 py-2 border rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{tAdmin('products.category')}</label>
                    <select value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="w-full px-3 py-2 border rounded" required>
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name} ({cat.name_ar})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{tAdmin('products.brand')}</label>
                    <input type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full px-3 py-2 border rounded" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{tAdmin('products.stock')}</label>
                    <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} className="w-full px-3 py-2 border rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{tAdmin('products.badge')}</label>
                    <select value={formData.badge} onChange={(e) => setFormData({...formData, badge: e.target.value})} className="w-full px-3 py-2 border rounded">
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
                  <input type="file" onChange={handleImageUpload} accept="image/*" multiple className="w-full px-3 py-2 border rounded" disabled={uploading} />
                  {uploading && <p className="text-sm text-gray-500 mt-1">{tAdmin('products.uploading')}</p>}
                  {uploadedImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`Uploaded ${index}`} className="w-full h-20 object-cover rounded" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.descriptionEn')}</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded" rows={2} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.descriptionAr')}</label>
                  <textarea value={formData.description_ar} onChange={(e) => setFormData({...formData, description_ar: e.target.value})} className="w-full px-3 py-2 border rounded" rows={2} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{tAdmin('products.specifications')}</label>
                  <textarea value={formData.specifications} onChange={(e) => setFormData({...formData, specifications: e.target.value})} className="w-full px-3 py-2 border rounded" rows={2} placeholder='{"key": "value"}' />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">{tAdmin('products.cancel')}</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingProduct ? tAdmin('products.update') : tAdmin('products.add')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
