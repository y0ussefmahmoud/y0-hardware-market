// ===== TypeScript Types =====
// Shared types for the application
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

export interface Product {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  price: number;
  old_price: number | null;
  category_id: number | null;
  brand: string | null;
  sku: string | null;
  stock_quantity: number;
  image_url: string;
  images: string[] | null;
  specifications: Record<string, any> | null;
  rating: number;
  review_count: number;
  badge: 'new' | 'sale' | 'bestseller' | 'featured' | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_name_ar?: string;
}

export interface Category {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  product_count?: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

export interface CartItem {
  cart_id: number;
  quantity: number;
  id: number;
  name: string;
  name_ar: string;
  price: number;
  old_price: number | null;
  image_url: string;
  stock_quantity: number;
  total_price: number;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  shipping_amount: number;
  discount_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'cod' | 'card' | 'bank_transfer' | 'vodafone';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string | null;
  order_notes: string | null;
  coupon_code: string | null;
  created_at: string;
  item_count?: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_name_ar: string;
  quantity: number;
  price: number;
  total_price: number;
}
