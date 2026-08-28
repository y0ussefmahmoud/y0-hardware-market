-- Y0 Hardware Database Schema
-- MySQL Database Schema for Hostinger
-- Note: Database is created in Hostinger panel, this script only creates tables

-- DROP DATABASE IF EXISTS y0_hardware;
-- CREATE DATABASE y0_hardware;
-- USE y0_hardware;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  description_ar TEXT,
  image_url VARCHAR(500),
  parent_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  category_id INT,
  brand VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  images JSON,
  specifications JSON,
  badge ENUM('featured', 'bestseller', 'new', 'sale'),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_category_id (category_id),
  INDEX idx_is_active (is_active),
  INDEX idx_badge (badge),
  FULLTEXT idx_search (name, name_ar, description, description_ar)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSON,
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_name_ar VARCHAR(255),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupons Table (Optional)
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO categories (name, name_ar, slug, description, description_ar) VALUES
('Processors', 'المعالجات', 'processors', 'Computer processors and CPUs', 'معالجات الكمبيوتر ووحدات المعالجة المركزية'),
('Graphics Cards', 'بطاقات الرسوميات', 'graphics-cards', 'GPU graphics cards', 'بطاقات معالجة الرسوميات'),
('Motherboards', 'اللوحات الأم', 'motherboards', 'Computer motherboards', 'اللوحات الأم للكمبيوتر'),
('Memory', 'الذاكرة', 'memory', 'RAM memory modules', 'وحدات ذاكرة الوصول العشوائي'),
('Storage', 'التخزين', 'storage', 'Storage devices SSD/HDD', 'أجهزة التخزين SSD/HDD'),
('Power Supplies', 'مزودات الطاقة', 'power-supplies', 'Power supply units', 'وحدات إمداد الطاقة'),
('Cases', 'الصناديق', 'cases', 'PC cases and chassis', 'صناديق الكمبيوتر'),
('Cooling', 'التبريد', 'cooling', 'Cooling solutions fans liquid cooling', 'حلول التبريد مراوح التبريد السائل');

INSERT INTO products (name, name_ar, slug, description, description_ar, price, old_price, category_id, brand, stock_quantity, badge, is_active, images) VALUES
('Intel Core i9-14900K', 'إنتل كور i9-14900K', 'intel-core-i9-14900k', '24-core 32-thread processor', 'معالج 24 نواة 32 خيط', 599.99, 649.99, 1, 'Intel', 50, 'featured', TRUE, '["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500"]'),
('AMD Ryzen 9 7950X', 'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', '16-core 32-thread processor', 'معالج 16 نواة 32 خيط', 549.99, 599.99, 1, 'AMD', 45, 'featured', TRUE, '["https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500"]'),
('NVIDIA RTX 4090', 'NVIDIA RTX 4090', 'nvidia-rtx-4090', '24GB GDDR6X graphics card', 'بطاقة رسوميات 24GB GDDR6X', 1599.99, 1799.99, 2, 'NVIDIA', 30, 'bestseller', TRUE, '["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500"]'),
('AMD RX 7900 XTX', 'AMD RX 7900 XTX', 'amd-rx-7900-xtx', '24GB GDDR6 graphics card', 'بطاقة رسوميات 24GB GDDR6', 999.99, 1099.99, 2, 'AMD', 25, 'sale', TRUE, '["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500"]'),
('ASUS ROG Maximus Z790', 'ASUS ROG Maximus Z790', 'asus-rog-maximus-z790', 'Premium gaming motherboard', 'لوحة أم للألعاب المتميزة', 499.99, 549.99, 3, 'ASUS', 20, 'featured', TRUE, '["https://images.unsplash.com/photo-1518770660439-4636190af475?w=500"]'),
('MSI MPG B650', 'MSI MPG B650', 'msi-mpg-b650', 'Mid-range gaming motherboard', 'لوحة أم للألعاب متوسطة المدى', 199.99, 229.99, 3, 'MSI', 35, 'new', TRUE, '["https://images.unsplash.com/photo-1518770660439-4636190af475?w=500"]'),
('Corsair Vengeance 32GB', 'Corsair Vengeance 32GB', 'corsair-vengeance-32gb', 'DDR5 32GB RAM kit', 'ذاكرة DDR5 32GB', 129.99, 149.99, 4, 'Corsair', 100, 'featured', TRUE, '["https://images.unsplash.com/photo-1562976540-1502c2145186?w=500"]'),
('Samsung 990 Pro 2TB', 'Samsung 990 Pro 2TB', 'samsung-990-pro-2tb', 'NVMe SSD 2TB', 'محرك SSD NVMe 2TB', 249.99, 279.99, 5, 'Samsung', 80, 'bestseller', TRUE, '["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500"]');

-- Insert admin user (password: admin123 - change this in production!)
-- NOTE: Admin user insertion should be handled securely via an environment variable seed script or application setup wizard.
-- INSERT INTO users (email, password, first_name, last_name, role) VALUES
-- ('admin@y0hardware.com', '...', 'Admin', 'User', 'admin');
