# ⚡ Urgent Fix: Replace raw `progress_activity` string with clean SVG/CSS Spinner

## المشكلة الحالية:
يظهر النص الخام `progress_activity` كملصق نصي عائم في الهيدر (Header) بدلاً من أيقونة التحميل الدائرية.

## المطلوب تنفيذه فوراً في `Header.tsx` (Surgical Fix):
1. **إزالة النص الخام**:
   - البحث عن أي استخدام لكلمة `"progress_activity"` أو تفاعلات الـ loading state في شريط الأزرار العلوي.
2. **استبدالها بـ SVG Spinner نظيف وثابت**:
   - ضع عنصر SVG متحرك بسيط وصغير (مثل كلاس `animate-spin`) ليدل على التحميل دون الاعتماد على مكتبات خارجية قد لا تحمل خطوطها بشكل صحيح في الـ SSR:
     ```tsx
     <svg className="animate-spin h-4 w-4 text-cyan-400 inline-block" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24">
       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
     </svg>
     ```
3. **التحقق والبناء**:
   - تشغيل `npx tsc --noEmit` والتأكد من عدم وجود أخطاء.
   - تشغيل `npm run build` والتأكد من نجاح بناء الـ 39 مساراً (Exit Code 0).
   - توثيق الإصلاح في ملفات الـ `README.md`.
   v1.1.15