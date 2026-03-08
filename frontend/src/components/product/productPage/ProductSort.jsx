import React from 'react';

const ProductSort = ({ total, sortBy, onSortChange }) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl italic font-black tracking-tighter uppercase">Tất cả sản phẩm</h1>
        <p className="mt-1 text-xs tracking-widest text-gray-500 uppercase">Hiển thị {total} kết quả</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-full bg-gray-50">
        <span className="text-[10px] font-bold uppercase text-gray-400">Sắp xếp:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="p-0 pr-8 text-sm font-bold bg-transparent border-none cursor-pointer focus:ring-0"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến Cao</option>
          <option value="price_desc">Giá: Cao đến Thấp</option>
          <option value="popular">Phổ biến nhất</option>
        </select>
      </div>
    </div>
  );
};

export default ProductSort;