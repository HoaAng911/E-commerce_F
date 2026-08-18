// pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Footprints } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-ink">
          <Footprints className="w-10 h-10 text-volt" />
        </div>

        <h1 className="mb-4 font-display text-ink text-8xl uppercase">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Đường chân trời không tìm thấy
        </h2>
        <p className="mb-8 text-gray-600">
          Có vẻ như bạn đã lạc bước. Hãy cùng chúng tôi tìm lại con đường với những đôi giày phù hợp.
        </p>
        
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link 
            to="/" 
            className="px-8 py-3 font-bold uppercase tracking-wide text-white transition-colors bg-ink hover:bg-ink/80"
          >
            Về trang chủ
          </Link>
          <Link 
            to="/products" 
            className="px-8 py-3 font-bold uppercase tracking-wide text-ink transition-colors border-2 border-ink hover:bg-ink hover:text-bone"
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
