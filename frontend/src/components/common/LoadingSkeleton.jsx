// src/components/LoadingSkeleton.jsx
export default function LoadingSkeleton() {
  return (
    <div className="transition-shadow bg-white rounded-lg shadow hover:shadow-lg animate-pulse">
      {/* Ảnh sản phẩm */}
      <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>

      {/* Thông tin */}
      <div className="p-4 space-y-3">
        {/* Tên sản phẩm */}
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded"></div>

        {/* Giá */}
        <div className="w-1/3 h-6 mt-4 bg-gray-200 rounded"></div>

        {/* Đánh giá */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Số lượng bán */}
        <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}