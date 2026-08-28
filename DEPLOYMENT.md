# تعليمات النشر على Hostinger

## المتطلبات
- حساب Hostinger
- قاعدة بيانات MySQL على Hostinger
- الوصول إلى SSH أو File Manager
- تفعيل Node.js على Hostinger (مطلوب)

## تفعيل Node.js على Hostinger (مهم جداً)

قبل البدء، يجب تفعيل Node.js على Hostinger:

1. اذهب إلى [hPanel](https://hpanel.hostinger.com/)
2. من القائمة الجانبية اختر **Advanced** > **Node.js**
3. اضغط على **Create application**
4. املأ البيانات:
   - **Project name:** y0-hardware-market
   - **Project folder:** `domains/y0-hardwaremarket.y0ussef.com/public_html`
   - **Node.js version:** أحدث إصدار متاح (مثلاً 20.x أو 18.x)
   - **Application mode:** Production
   - **Application URL:** `https://y0-hardwaremarket.y0ussef.com`
5. اضغط **Create**
6. بعد الإنشاء، ستحصل على أمر لتثبيت الاعتمادات، انسخه
7. انتظر حتى يتم تفعيل Node.js (قد يستغرق بضع دقائق)

بعد التفعيل، يمكنك استخدام `npm` و `node` عبر SSH.

## طريقتان للنشر

**ملاحظة مهمة:** إذا لم يكن Node.js متاحاً في PATH، يمكنك إضافته أو استخدام المسار الكامل.

### إضافة Node.js إلى PATH (إذا كان مثبتاً عبر nvm)
```bash
# إضافة Node.js إلى PATH مؤقتاً
export PATH="$HOME/.nvm/versions/node/v22.23.1/bin:$PATH"

# أو بشكل دائم (أضف هذا إلى ~/.bashrc)
echo 'export PATH="$HOME/.nvm/versions/node/v22.23.1/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

بعد ذلك يمكنك استخدام `npm` و `node` بشكل طبيعي.

### الطريقة 1: البناء محلياً ثم الرفع (موصى به للسيرفرات البطيئة)

#### 1. بناء المشروع للإنتاج
```bash
npm run build
```

#### 2. تحضير الملفات للنشر
بعد البناء، ستجد مجلد `.next` يحتوي على الملفات المطلوبة.

#### 3. رفع الملفات إلى Hostinger

##### عبر SSH
```bash
# رفع الملفات المطلوبة فقط
scp -r .next package.json package-lock.json public user@hostinger.com:~/domains/y0-hardwaremarket.y0ussef.com/public_html
```

##### عبر File Manager
1. افتح File Manager في Hostinger
2. انتقل إلى `public_html`
3. احذف الملفات القديمة (احتفظ بالنسخة الاحتياطية)
4. ارفع المجلدات التالية:
   - `.next`
   - `public`
   - `package.json`
   - `package-lock.json`

#### 4. تثبيت الاعتمادات على السيرفر
```bash
cd ~/domains/y0-hardwaremarket.y0ussef.com/public_html
npm install --production
```

---

### الطريقة 2: رفع الكود المصدري والبناء على السيرفر (أفضل للتحديثات السريعة)

#### 1. رفع الملفات المصدرية فقط
ارفع المجلدات التالية عبر File Manager أو SSH:
- `src/`
- `public/`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `.env.production`

#### 2. تثبيت الاعتمادات على السيرفر
```bash
cd ~/domains/y0-hardwaremarket.y0ussef.com/public_html
npm install
```

#### 3. بناء المشروع على السيرفر
```bash
npm run build
```

#### 4. تشغيل التطبيق
```bash
npm start
```

---

## الخطوات المشتركة لكلا الطريقتين

### إعداد متغيرات البيئة
أنشئ ملف `.env.production` في السيرفر:
```env
DB_HOST=localhost
DB_USER=u732920986_y0_hardware
DB_PASSWORD=Yoyo*110222*
DB_NAME=u732920986_y0_hardware
DB_PORT=3306

NEXTAUTH_URL=https://y0-hardwaremarket.y0ussef.com
NEXTAUTH_SECRET=HQ1dSCp4Mu65zlq/oq2hUtxENn/wqehl+aOEWk8nnOw=

JWT_SECRET=HQ1dSCp4Mu65zlq/oq2hUtxENn/wqehl+aOEWk8nnOw=
JWT_EXPIRE=7d

NODE_ENV=production
PORT=3000
REDIS_URL=
```

### إعداد قاعدة البيانات
1. أنشئ قاعدة البيانات `u732920986_y0_hardware` على Hostinger
2. استورد schema من ملف `database/schema.sql` (إذا كان موجوداً)

### تشغيل التطبيق
```bash
npm start
```

أو استخدام PM2 للإدارة:
```bash
pm2 start npm --name "y0-hardware" -- start
pm2 save
pm2 startup
```

أو استخدام hPanel Node.js app:
1. اذهب إلى Advanced > Node.js
2. ابحث عن التطبيق الموجود
3. اضغط **Run** أو **Restart** لتشغيل التطبيق

### إعداد Apache/Nginx
أضف هذا في `.htaccess` (لـ Apache):
```apache
RewriteEngine On
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

## التحقق من النشر
1. افتح https://y0-hardwaremarket.y0ussef.com
2. تأكد من أن الصفحة الرئيسية تعمل
3. اختبر تبديل اللغة
4. اختبر صفحة المنتجات
5. اختبر صفحة منتج محدد

## استكشاف الأخطاء
- إذا لم تعمل الصور: تأكد من إعدادات `next.config.ts`
- إذا لم تعمل قاعدة البيانات: تحقق من بيانات الاتصال في `.env.production`
- إذا لم يعمل التطبيق: تحقق من logs باستخدام `pm2 logs`

## التحديثات المستقبلية

### للطريقة 1 (البناء محلياً):
1. بناء المشروع محلياً: `npm run build`
2. رفع مجلد `.next` الجديد
3. إعادة تشغيل التطبيق: `pm2 restart y0-hardware`

### للطريقة 2 (البناء على السيرفر):
1. رفع الملفات المحدثة (`src/`, `public/`, إلخ)
2. بناء المشروع على السيرفر: `npm run build`
3. إعادة تشغيل التطبيق: `pm2 restart y0-hardware`

## أي طريقة تختار؟

**الطريقة 1 (البناء محلياً):**
- ✅ أسرع للنشر الأول
- ✅ لا يستهلك موارد السيرفر
- ❌ حجم الملفات أكبر للرفع
- ❌ يحتاج وقت أطول للتحديثات

**الطريقة 2 (البناء على السيرفر):**
- ✅ حجم الملفات أصغر للرفع
- ✅ أسهل للتحديثات المتكررة
- ✅ يضمن التوافق مع بيئة السيرفر
- ❌ يستهلك موارد السيرفر أثناء البناء
- ❌ قد يستغرق وقتاً إذا كان السيرفر بطيئاً
