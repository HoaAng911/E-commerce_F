// components/layout/NotFoundPage.jsx (Minimal)
import React from 'react';
import { Link } from 'react-router-dom';
import { Footprints } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-red-100 rounded-full">
          <Footprints className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="mb-4 font-bold text-gray-900 text-8xl">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Đường chân trời không tìm thấy
        </h2>
        <p className="mb-8 text-gray-600">
          Có vẻ như bạn đã lạc bước. Hãy cùng chúng tôi tìm lại con đường với những đôi giày phù hợp.
        </p>
        
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link 
            to="/" 
            className="px-8 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Về trang chủ
          </Link>
          <Link 
            to="/products" 
            className="px-8 py-3 font-semibold text-gray-900 transition-colors border-2 border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white"
          >
            Xem sản phẩm
          </Link>
        </div>
        
        <div className="pt-8 mt-12 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Cần hỗ trợ? Liên hệ: <span className="font-medium">support@shoestore.vn</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;