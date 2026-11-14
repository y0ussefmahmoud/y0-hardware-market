# ⚡ System Directive: Admin & Seller Modal Image Preview Fix (v1.3.11)

## 🎯 Objective:
Fix product image preview rendering in Admin and Seller edit modals where existing database images (stored as relative URL strings) incorrectly display as "Uploaded 0", "Uploaded 1" due to expecting `File` object `.name` properties.

---

## 🛠️ Implementation Steps:

### 1. Update Image Preview Mapping in Modals
- **Target Files:** 
  - `src/app/[locale]/admin/page.tsx`
  - `src/app/[locale]/seller/page.tsx`
- **Implementation Logic:**
  - Update the thumbnail rendering loop inside the image preview grid to handle both `string` (existing URLs from DB) and `File` (newly uploaded files) seamlessly.

```tsx
<div className="grid grid-cols-4 gap-2">
  {images.map((img, index) => {
    const isString = typeof img === 'string';
    const imgSrc = isString ? getImageUrl(img) : URL.createObjectURL(img);
    const imgName = isString ? img.split('/').pop() : (img as File).name;

    return (
      <div key={index} className="relative group border border-cyan-500/30 rounded p-1 bg-black/40">
        <img 
          src={imgSrc} 
          alt={imgName || `Image ${index}`} 
          className="w-full h-16 object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
        <span className="text-[10px] text-cyan-300 block truncate mt-1">
          {imgName}
        </span>
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
        >
          ×
        </button>
      </div>
    );
  })}
</div>
```
