# ⚡ Urgent Fix: Allowed Dev Origins (CORS) & Header Icon Cleanup

## المطلوب تنفيذه فوراً (Surgical Fix):

1. **تحديث إعدادات Next.js (`next.config.ts` أو `next.config.js`)**:
   - أضف إعداد `allowedDevOrigins` للسماح لـ IP المحلي بالوصول للموارد دون قيود CORS:
     ```ts
     const nextConfig = {
       // ... إعداداتك الحالية ...
       allowedDevOrigins: ['10.20.0.1', 'localhost:3200', '127.0.0.1:3200'],
     };
     ```

2. **تنظيف أيقونة الهيدر في (`Header.tsx`)**:
   - تأكد من عدم ظهور النص الخام `account_circle` كمكتوب على الشاشة.
   - استبدله بـ SVG نقي وصغير يمثل أيقونة الحساب أو استخدم عنصر واجهة صحيح لا يطبع اسم المادة النصية كـ String.

3. **التحقق والبناء**:
   - تشغيل `npx tsc --noEmit` للتأكد من عدم وجود أخطاء في الـ TypeScript.
   - تشغيل `npm run build` للتأكد من نجاح بناء الـ 39 مساراً (Exit Code 0).
   - توثيق الإصلاح في ملفات الـ `README.md`.

   v1.1.17