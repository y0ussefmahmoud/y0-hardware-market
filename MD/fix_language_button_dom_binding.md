# ⚡ Urgent Fix: Language Switcher DOM Anchor Correction

## المشكلة الحالية:
زر تبديل اللغة (Language Switcher) لا يستجيب للضغط رغم ظهوره في الواجهة، وذلك بسبب قيود التفاعل أو تداخل الـ Event Listeners.

## المطلوب تنفيذه فوراً (Surgical Fix):
1. **تعديل مكون LanguageSwitcher.tsx**:
   - بدلاً من الاعتماد حصراً على `<button onClick={...}>` مع `window.location.assign` المعقدة، قم بتحويل الزر أو العنصر الحاوي إلى عنصر رابط مباشر (`<a href={targetUrl}>`) أو ضمان أن الـ onClick يستخدم رابحاً مباشراً لـ `window.location.href = targetUrl`.
   - تأكد من إزالة أي `pointer-events-none` أو تداخل طبقات (`z-index` عائق) فوق زر اللغة في الهيدر العلوي.

2. **التأكد من مسار الترجمة**:
   - إذا كنا في `/en/...`، يجب أن يكون الرابط الموجه إليه هو نفس الـ pathname مع استبدال `/en` بـ `/ar`.
   - إذا كنا في `/ar/...`، يجب استبدال `/ar` بـ `/en`.

3. **التحقق والاختبار**:
   - تشغيل `npx tsc --noEmit` للتأكد من عدم وجود أخطاء.
   - تشغيل `npm run build` للتأكد من سلامة البناء.
   - توثيق التحديث في نهاية ملفات الـ `README.md`.

   v1.1.12