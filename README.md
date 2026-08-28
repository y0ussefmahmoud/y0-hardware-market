# Y0 Hardware - Next.js E-Commerce

متجر إلكتروني متكامل لبيع قطع الكمبيوتر واللابتوب والاكسسوارات مبني باستخدام Next.js و MySQL.

## المتطلبات الأساسية

- Node.js (v18 أو أحدث)
- MySQL (v8.0 أو أحدث)
- npm أو yarn

## التثبيت

### 1. تثبيت الاعتمادات

```bash
npm install
```

### 2. إعداد قاعدة البيانات

#### أ. إنشاء قاعدة البيانات يدوياً:

```bash
mysql -u root -p
```

ثم نفذ:

```sql
CREATE DATABASE y0_hardware CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### ب. استخدم schema من المشروع القديم:

انسخ محتوى `database/schema.sql` من المشروع القديم ونفذه في قاعدة البيانات الجديدة.

### 3. إعداد متغيرات البيئة

انسخ ملف `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

عدل الملف بإعداداتك:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=y0_hardware
DB_PORT=3306

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

### 4. تشغيل السيرفر

```bash
npm run dev
```

افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

## هيكل المشروع

```
y0-hardware-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── products/      # Products API
│   │   │   ├── auth/          # Authentication API
│   │   │   ├── cart/          # Cart API
│   │   │   └── orders/        # Orders API
│   │   ├── product/[slug]/    # Product detail page
│   │   ├── shop/              # Shop page
│   │   ├── cart/              # Cart page
│   │   ├── auth/              # Auth pages
│   │   └── page.tsx           # Home page
│   ├── components/            # React Components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── lib/                   # Utilities
│   │   ├── db.ts              # Database connection
│   │   └── auth.ts            # Auth utilities
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/                    # Static assets
└── .env.local                 # Environment variables
```

## API Endpoints

### المنتجات
- `GET /api/products` - جميع المنتجات مع الفلاتر
- `GET /api/products/featured` - المنتجات المميزة
- `GET /api/products/categories` - الفئات
- `GET /api/products/[id]` - منتج محدد
- `GET /api/products/[id]/related` - منتجات ذات صلة

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول

### السلة
- `GET /api/cart` - محتويات السلة
- `POST /api/cart` - إضافة منتج للسلة
- `DELETE /api/cart/[productId]` - حذف من السلة
- `DELETE /api/cart` - تفريغ السلة

### الطلبات
- `GET /api/orders` - طلبات المستخدم
- `POST /api/orders` - إنشاء طلب جديد

## التقنيات المستخدمة

- **Next.js 16** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **MySQL** - Database
- **Font Awesome** - Icons
- **Cairo Font** - Arabic Typography

## الميزات

- ✅ تصميم متجاوب (Responsive)
- ✅ دعم اللغة العربية (RTL)
- ✅ نظام مصادقة JWT
- ✅ سلة مشتريات
- ✅ نظام الطلبات
- ✅ فلاتر المنتجات
- ✅ تصميم عصري وجذاب

## التطوير

### إضافة صفحة جديدة

أنشئ ملف جديد في `src/app/`:

```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

### إضافة API route جديد

أنشئ ملف في `src/app/api/`:

```typescript
// src/app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello' });
}
```

## النشر

يمكنك نشر المشروع على:
- [Vercel](https://vercel.com) - الموصى به لـ Next.js
- [Netlify](https://netlify.com)
- أي استضافة تدعم Node.js

## الترخيص

جميع الحقوق محفوظة © 2024 Y0 Hardware
