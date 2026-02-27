import React from 'react';
import { ShoppingBag, Sparkles, MoveRight } from 'lucide-react';

import bannerImg from '../../assets/giay2.png';

export const Banner = () => {
  return (
    <div className="relative min-h-[600px] lg:h-[85vh] flex items-center overflow-hidden bg-white">
      {/* Background Decor - Giữ nguyên các khối màu loang để tạo chiều sâu */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-60" />

      <div className="container relative z-10 px-4 mx-auto md:px-12">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-blue-100 rounded-full bg-blue-50/50">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase">
                Thế hệ mới 2025
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter uppercase italic mb-6">
              Nâng Tầm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Bản Sắc
              </span>
            </h1>

            <p className="max-w-lg mb-10 text-lg leading-relaxed text-gray-500 md:text-xl">
              Khám phá sự kết hợp hoàn hảo giữa công nghệ <span className="font-medium text-gray-900">Cushioning</span> đột phá 
              và ngôn ngữ thiết kế <span className="font-medium text-gray-900">Minimalism</span>.
            </p>

            <div className="flex flex-wrap gap-5">
              <button className="relative px-10 py-4 overflow-hidden font-bold text-white transition-all bg-black group rounded-2xl hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)]">
                <div className="absolute inset-0 transition-transform duration-300 translate-y-full bg-blue-600 group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center gap-3 text-sm tracking-widest uppercase">
                  Mua Ngay <ShoppingBag className="w-5 h-5" />
                </span>
              </button>

              <button className="flex items-center gap-3 px-10 py-4 text-sm font-bold tracking-widest text-gray-900 uppercase transition-all border-2 border-gray-100 rounded-2xl hover:bg-gray-50 group">
                Bộ sưu tập 
                <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </button>
            </div>

            {/* Trusted User Stats */}
            <div className="flex items-center gap-4 pt-8 mt-12 border-t border-gray-100">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 overflow-hidden bg-gray-100 border-2 border-white rounded-full">
                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-gray-500">
                <span className="font-bold text-gray-900">1,200+</span> khách hàng đã tin dùng
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT: Visual Showcase */}
          <div className="relative order-1 lg:order-2">
            <div className="relative z-20 transition-all duration-700 hover:scale-[1.02]">
              {/* Ánh sáng phía sau giày */}
              <div className="absolute rounded-full -inset-10 bg-gradient-to-tr from-blue-400/20 to-indigo-400/10 blur-3xl" />
              
              <img
                src={bannerImg}
                alt="Sneaker Hero"
                className="relative w-full h-auto max-h-[500px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* Floating Info Card 1 - Ưu đãi */}
            <div className="absolute z-30 hidden p-5 border border-white shadow-2xl -top-6 -right-6 bg-white/90 backdrop-blur-md rounded-3xl md:block animate-float">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 italic font-black text-white bg-blue-600 shadow-lg rounded-2xl shadow-blue-200">
                  -30%
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Ưu đãi độc quyền</p>
                  <p className="text-sm italic font-black text-gray-900">LIMITED EDITION</p>
                </div>
              </div>
            </div>

            {/* Floating Info Card 2 - Công nghệ */}
            <div className="absolute z-30 hidden p-6 text-white bg-black shadow-2xl -bottom-10 -left-10 rounded-3xl md:block animate-float-delayed">
              <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">Technology</p>
              <h4 className="text-lg italic font-bold leading-tight tracking-tighter uppercase">
                Hệ thống <br /> đệm Air Max
              </h4>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};