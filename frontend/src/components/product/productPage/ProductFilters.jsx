import React from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';

const ProductFilters = ({ 
  categories = [], 
  brands = [], 
  selectedCategory = '', 
  selectedBrand = '', 
  priceRange = { min: '', max: '' },
  onFilterChange,
  expandedSections,
  setExpandedSections,
  onReset
}) => {
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper để kiểm tra xem một item có đang được chọn không
  const isSelected = (type, value) => {
    if (type === 'category') return selectedCategory === value;
    if (type === 'brand') return selectedBrand === value;
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Header Filter & Reset */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-black">
        <span className="text-sm font-black tracking-tighter uppercase">Bộ lọc</span>
        <button 
          onClick={onReset}
          className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400 hover:text-black transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Xóa tất cả
        </button>
      </div>

      {/* Categories Section */}
      <div className="pb-6 border-b border-gray-100">
        <button 
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-4 group"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Danh mục</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedSections.category ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.category && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected('category', cat.id)}
                      onChange={() => onFilterChange('category', cat.id)}
                      className="w-5 h-5 transition-all border-2 border-gray-200 rounded-sm appearance-none checked:bg-black checked:border-black"
                    />
                    {isSelected('category', cat.id) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <span className={`text-sm transition-colors ${isSelected('category', cat.id) ? 'font-bold text-black' : 'text-gray-500 group-hover:text-black'}`}>
                    {cat.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div className="pb-6 border-b border-gray-100">
        <button 
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full mb-4 group"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Thương hiệu</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedSections.brand ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.brand && (
          <div className="grid grid-cols-2 gap-2 animate-in fade-in">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => onFilterChange('brand', brand)}
                className={`px-3 py-2 text-xs font-medium border transition-all rounded-md ${
                  isSelected('brand', brand) 
                  ? 'border-black bg-black text-white shadow-md' 
                  : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section - Bổ sung mới */}
      <div className="pb-6">
        <button 
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-4 group"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Khoảng giá</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedSections.price ? 'rotate-180' : ''}`} />
        </button>

        {expandedSections.price && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Từ"
                  value={priceRange.min}
                  onChange={(e) => onFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black"
                />
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Đến"
                  value={priceRange.max}
                  onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black"
                />
              </div>
            </div>
            {/* Quick Price Tags */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: '< 1Tr', min: 0, max: 1000000 },
                { label: '1Tr - 3Tr', min: 1000000, max: 3000000 }
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    onFilterChange('minPrice', range.min);
                    onFilterChange('maxPrice', range.max);
                  }}
                  className="px-2 py-1 text-[10px] font-bold uppercase border border-gray-100 bg-gray-50 text-gray-500 hover:bg-black hover:text-white rounded transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;