# ⚡ Urgent Fix: Server-Side Fetch Failed Error on Production

## المشكلة الحالية:
تعاني صفحة المتجر (`/shop`) وصفحات أخرى تعتمد على الـ SSR من خطأ:
`Error fetching products: TypeError: fetch failed` بسبب محاولة جلب البيانات عبر `fetch()` داخل Server Components باستخدام رابط مطلق يعتمد على `localhost` أو `0.0.0.0` غير مدعوم في بيئة الـ Standalone Production.

---

## 🛠️ المطلوب تنفيذه فوراً (Surgical Fix):

### 1. تصحيح استدعاء الـ API في الـ Server Components (`fetch` الداخلية):
- بدلاً من الاعتماد على جلب البيانات عبر `fetch('http://localhost:3000/api/...')` أو روابط مطلقة تعتمد على بورت السيرفر المحلي في مسارات الـ Server (والتي تفشل في بيئة الاستضافة)، قم بواحدة من الآتي:
  - **الخيار الأول (موصى به للأداء وسرعة البناء)**: استدعاء دالة قاعدة البيانات أو وظيفة الـ Controller مباشرة داخل Server Component بدلاً من إرسال طلب HTTP داخلي لنفس السيرفر.
  - **الخيار الثاني**: استخدام Base URL مرن وديناميكي يقرأ من متغيرات البيئة أو يعتمد على مسار نسبى إن كان مدعوماً، أو استخدام `headers()` للحصول على الـ host الفعلي.

### 2. مراجعة إعدادات `.env.production`:
- التأكد من تعيين المتغيرات البيئية بشكل صحيح على الاستضافة:
  ```env
  NEXT_PUBLIC_BASE_URL=[https://hardwaremarket.y0ussef.com](https://hardwaremarket.y0ussef.com)

  v1.3.3