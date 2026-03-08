import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      {/* Icon thành công */}
      <div className="flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-green-50">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      {/* Thông báo */}
      <h1 className="mb-4 text-2xl font-bold tracking-widest uppercase">Đặt hàng thành công!</h1>
      <p className="max-w-md mb-8 text-sm leading-relaxed text-center text-gray-500">
        Cảm ơn bạn đã tin tưởng chọn Shoes Store. Đơn hàng của bạn <span className="font-bold text-black">#{orderId}</span> đang được xử lý và sẽ sớm được giao đến bạn.
      </p>

      {/* Hành động */}
      <div className="grid w-full max-w-sm grid-cols-1 gap-4">
        <Link 
          to="/profile" 
          className="flex items-center justify-center gap-2 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border border-black hover:bg-black hover:text-white"
        >
          <Package className="w-4 h-4" /> Kiểm tra đơn hàng
        </Link>
        
        <Link 
          to="/products" 
          className="flex items-center justify-center gap-2 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all bg-black text-white hover:bg-gray-800"
        >
          Tiếp tục mua sắm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-12 text-[10px] uppercase tracking-widest text-gray-400">
        Email xác nhận đã được gửi đến bạn.
      </div>
    </div>
  );
};

export default OrderSuccessPage;