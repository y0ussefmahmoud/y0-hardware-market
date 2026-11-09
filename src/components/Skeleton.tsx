// ===== Skeleton Loading Component =====
// Placeholder loading state for content
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-container"></div>
      <div className="p-4">
        <div className="h-4 bg-surface-container rounded mb-2"></div>
        <div className="h-4 bg-surface-container rounded w-2/3 mb-4"></div>
        <div className="h-6 bg-surface-container rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-surface-container rounded"></div>
      </div>
    </div>
  );
}

export function ProductListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
