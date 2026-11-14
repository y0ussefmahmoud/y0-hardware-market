# ⚡ Master System Directive: Y0 Hardware Market v1.3.9 (Consolidated Fixes & Features)

## 🎯 الهدف الرئيسي:
تحديث شامل ومتكامل لمنصة **Y0 Hardware Market** للإصدار **v1.3.9** يشمل: توحيد مسارات الصور والرفع محلياً وفي الإنتاج، إصلاح أخطاء الترجمة المفقودة (`MISSING_MESSAGE`)، معالجة مشكلة الـ Slug وصفحات المنتجات الديناميكية لمنع ظهور خطأ "Product not found"، وإضافة خاصية المنتجات المميزة (`is_featured`) لقاعدة البيانات ولوحات التحكم.

---

## 🛠️ تفاصيل المهام والتنفيذ البرمجي للأجينت المحلي:

### 1. إصلاح أخطاء الترجمة المفقودة (`next-intl`)
- **الملفات المستهدفة:** `messages/ar.json` و `messages/en.json`
- **التعديل في `ar.json`:**
  تأكد من وجود المفتاحين التاليين بدقة داخل الكائنات الخاصة بها:
  ```json
  "nav": {
    "shop": "المتجر",
    ...
  },
  "shop": {
    "tryAdjustingFilters": "حاول ضبط الفلاتر أو البحث عن منتج آخر",
    ...
  }
  ```
- **التعديل في `en.json`:**
  ```json
  "nav": {
    "shop": "Shop",
    ...
  },
  "shop": {
    "tryAdjustingFilters": "Try adjusting your filters or search query",
    ...
  }
  ```

### 2. توحيد مسارات رفع الصور وتخزينها (Local & Production Harmony)
- **الملف المستهدف:** مسارات الـ API الخاصة بالمنتجات والرفع (`app/api/upload/route.ts` أو مسارات الـ products).
- **التنفيذ البرمجي:**
  - جعل مسار الحفظ مرناً يعتمد على متغير بيئي (`process.env.UPLOAD_DIR`) مع دعم المسار المحلي افتراضياً:
  ```typescript
  import path from 'path';
  import fs from 'fs';

  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  ```
- التأكد من أن مسار الصورة المخزن في قاعدة البيانات يبدأ بصيغة نسبية نظيفة (مثل `/uploads/filename.jpg`) لضمان عرضها بشكل صحيح في الـ Frontend والـ Production عبر الـ Symlink القائم على الاستضافة.

---

### 3. حل مشكلة الـ Slug وصفحات المنتجات الديناميكية (`/product/[slug]`)
- **المشكلة:** عند إضافة منتج جديد (مثل RTX 3060 Ti) يتم حفظه في قاعدة البيانات لكن لا يتم توليد أو ربط الـ slug بالشكل الصحيح فتظهر رسالة "Product not found" عند محاولة تصفحه.
- **التنفيذ:**
  - في نموذج إضافة/تعديل المنتج (Admin/Seller Dashboard API):
    - توليد الـ slug تلقائياً من اسم المنتج إذا لم يتم إدخاله يدوياً (عبر دالة `slugify` تحويل الحروف الكبيرة لصغيرة واستبدال المسافات بشرطات).
    - حفظ قيمة الـ `slug` في جدول `products` بشكل إلزامي.
  - في صفحة تفاصيل المنتج `app/[locale]/product/[slug]/page.ts`:
    - جلب المنتج من قاعدة البيانات باستخدام الـ `slug` مع ضمان مطابقة التشفير وحالة الأحرف.

---

### 4. إضافة خاصية المنتجات المميزة (`is_featured`)
- **قاعدة البيانات (MySQL - Production & Local):**
  تحديث جدول المنتجات بإضافة حقل `is_featured`:
  ```sql
  ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
  ```
- **لوحات التحكم (Admin & Seller Dashboard Forms):**
  - إضافة حقل اختيار (Checkbox / Toggle) في نموذج إضافة وتعديل المنتج يسمح بتمييز المنتج (`Featured Product`).
  - تحديث الـ API الخاص بإنشاء وتعديل المنتجات (`POST`/`PUT`) لاستقبال وتخزين قيمة `is_featured` في قاعدة البيانات.
  - تحديث واجهة العرض الرئيسية لعرض المنتجات المميزة التي تملك `is_featured = 1`.

---

## 🧪 الاختبار والتحقق (Verification Protocol)
بعد تطبيق التعديلات، قم بتشغيل الأوامر التالية والتأكد من نجاحها:
1. فحص الأنواع: `npx tsc --noEmit` (يجب أن يعود بـ 0 أخطاء).
2. بناء المشروع: `npm run build` (يجب أن ينجح بـ Exit Code 0).
3. التأكد من حفظ التغييرات وتوثيق الإصدار v1.3.9 في `MD/CHANGELOG.md` و `README.md`.