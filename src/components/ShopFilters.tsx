// ===== Shop Filters Component =====
// Product filtering sidebar
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface Category {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
}

interface ShopFiltersProps {
  categories: Category[];
}

export default function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const tFilters = useTranslations('filters');
  const tCategories = useTranslations('categories');
  const tFooter = useTranslations('footer');

  // Get initial values from URL
  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '500000';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [maxPrice, setMaxPrice] = useState(parseInt(initialMaxPrice));

  // Sync state with URL when search params change (e.g. back button)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedCategory(searchParams.get('category') || '');
      setSelectedBrand(searchParams.get('brand') || '');
      setMaxPrice(parseInt(searchParams.get('maxPrice') || '500000'));
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    if (selectedBrand) {
      params.set('brand', selectedBrand);
    } else {
      params.delete('brand');
    }

    if (maxPrice < 500000) {
      params.set('maxPrice', maxPrice.toString());
    } else {
      params.delete('maxPrice');
    }

    // Always reset to page 1 on filter apply
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMaxPrice(500000);
    router.push(pathname);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 sticky top-24 backdrop-blur-md shadow-lg">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-outline-variant/20">
        <h3 className="font-mono font-bold text-sm tracking-wider uppercase text-on-surface flex items-center gap-2">
          <i className="fas fa-filter text-primary-container text-xs"></i>
          <span>{tFilters('title')}</span>
        </h3>
        {(selectedCategory || selectedBrand || maxPrice < 500000) && (
          <button 
            onClick={handleClear}
            className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
          >
            {tFilters('clearAll')}
          </button>
        )}
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-mono text-xs uppercase tracking-wider text-primary-container font-semibold mb-3">
          // {tCategories('title')}
        </h4>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer group">
            <input 
              type="radio" 
              name="category"
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
              className="accent-cyan-400 w-4 h-4 bg-surface-container border-outline-variant/50 focus:ring-0 cursor-pointer" 
            />
            <span className="text-on-surface-variant group-hover:text-on-surface text-sm transition-colors">{tFilters('allCategories')}</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer group">
              <input 
                type="radio" 
                name="category"
                value={category.id}
                checked={selectedCategory === category.id.toString()}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="accent-cyan-400 w-4 h-4 bg-surface-container border-outline-variant/50 focus:ring-0 cursor-pointer" 
              />
              <span className="text-on-surface-variant group-hover:text-on-surface text-sm transition-colors">{locale === 'ar' ? category.name_ar : category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-mono text-xs uppercase tracking-wider text-primary-container font-semibold">
            // {tFilters('priceRange')}
          </h4>
          <span className="text-xs font-mono font-bold text-primary-container">
            &le; {maxPrice.toLocaleString()} {tFooter('currency')}
          </span>
        </div>
        <div className="space-y-2">
          <input 
            type="range" 
            min="0" 
            max="500000" 
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-cyan-400" 
          />
          <div className="flex justify-between text-[11px] font-mono text-on-surface-variant/60">
            <span>0 {tFooter('currency')}</span>
            <span>500k {tFooter('currency')}</span>
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6">
        <h4 className="font-mono text-xs uppercase tracking-wider text-primary-container font-semibold mb-3">
          // {tFilters('brand')}
        </h4>
        <div className="space-y-2.5">
          <label className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer group">
            <input 
              type="radio" 
              name="brand"
              checked={selectedBrand === ''}
              onChange={() => setSelectedBrand('')}
              className="accent-cyan-400 w-4 h-4 bg-surface-container border-outline-variant/50 focus:ring-0 cursor-pointer" 
            />
            <span className="text-on-surface-variant group-hover:text-on-surface text-sm transition-colors">{tFilters('allBrands')}</span>
          </label>
          {['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI'].map((brand) => (
            <label key={brand} className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer group">
              <input 
                type="radio" 
                name="brand"
                value={brand}
                checked={selectedBrand === brand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="accent-cyan-400 w-4 h-4 bg-surface-container border-outline-variant/50 focus:ring-0 cursor-pointer" 
              />
              <span className="text-on-surface-variant group-hover:text-on-surface text-sm transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="w-full bg-primary-container text-on-primary-container py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all font-mono font-bold text-xs uppercase tracking-wider active:scale-[0.98]"
      >
        {tFilters('apply')}
      </button>
    </div>
  );
}
