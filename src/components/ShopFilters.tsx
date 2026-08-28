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
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">{tFilters('title')}</h3>
        {(selectedCategory || selectedBrand || maxPrice < 500000) && (
          <button 
            onClick={handleClear}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            {tFilters('clearAll')}
          </button>
        )}
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">{tCategories('title')}</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
            <input 
              type="radio" 
              name="category"
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
              className="rounded-full text-purple-600 focus:ring-purple-500" 
            />
            <span className="text-gray-700 text-sm">{tFilters('allCategories')}</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
              <input 
                type="radio" 
                name="category"
                value={category.id}
                checked={selectedCategory === category.id.toString()}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-full text-purple-600 focus:ring-purple-500" 
              />
              <span className="text-gray-700 text-sm">{locale === 'ar' ? category.name_ar : category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold">{tFilters('priceRange')}</h4>
          <span className="text-sm font-bold text-purple-600">
            {tFilters('upTo')} {maxPrice.toLocaleString()} {tFooter('currency')}
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 {tFooter('currency')}</span>
            <span>500,000 {tFooter('currency')}</span>
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">{tFilters('brand')}</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
            <input 
              type="radio" 
              name="brand"
              checked={selectedBrand === ''}
              onChange={() => setSelectedBrand('')}
              className="rounded-full text-purple-600 focus:ring-purple-500" 
            />
            <span className="text-gray-700 text-sm">{tFilters('allBrands')}</span>
          </label>
          {['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI'].map((brand) => (
            <label key={brand} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
              <input 
                type="radio" 
                name="brand"
                value={brand}
                checked={selectedBrand === brand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="rounded-full text-purple-600 focus:ring-purple-500" 
              />
              <span className="text-gray-700 text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-sm"
      >
        {tFilters('apply')}
      </button>
    </div>
  );
}
