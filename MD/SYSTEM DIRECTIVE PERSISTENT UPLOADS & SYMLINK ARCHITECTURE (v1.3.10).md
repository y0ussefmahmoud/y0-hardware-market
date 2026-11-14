# ⚡ System Directive: Persistent Image Uploads & Symbolic Link Architecture (v1.3.10)

## 🎯 Objective:
Ensure robust, permanent image storage across local and production environments, fix image preview rendering issues, and automate/document the production Symbolic Link architecture on Hostinger VPS.

---

## 🛠️ Implementation Tasks:

### 1. Backend Upload API Verification (`src/app/api/upload/route.ts`)
- Ensure upload path prioritizes `process.env.UPLOAD_DIR` with a fallback to `path.join(process.cwd(), 'public', 'uploads')`.
- Guarantee that the API returns clean, relative URL paths starting with `/uploads/...` (e.g., `/uploads/17946539...jpg`) rather than absolute server paths.
- Ensure proper error handling and file extension validations for uploaded hardware images.

### 2. Frontend Image Preview & Component Handling (`src/components/...` & Product Cards)
- Verify that image display components and modal thumbnail previews correctly resolve URLs:
  ```tsx
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    return img.startsWith('http') || img.startsWith('/uploads/') ? img : `/uploads/${img}`;
  };
  ```
- Standardize image URL resolution across storefront components (`ProductCard`, `product/[slug]`, `cart`, `checkout`, `admin`, and `seller` dashboards).
