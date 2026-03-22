import React from 'react';

export const Banner = () => {
  return (
    <div className="relative h-[600px] bg-gray-900 overflow-hidden pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-32" />

      <div className="relative h-full container-premium mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center h-full gap-12 md:flex-row">
          
          {/* Content Left */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl uppercase">
              Step into the <span className="text-blue-400">Future</span> of Footwear
            </h1>
            <p className="mb-10 text-lg text-gray-300 md:text-xl max-w-xl mx-auto md:mx-0">
              Khám phá bộ sưu tập giày mới nhất với công nghệ tiên tiến mang lại cảm giác thoải mái tuyệt đối cho mỗi bước chân.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center md:justify-start">
              <button className="px-8 py-4 font-bold text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-600/30">
                Mua Ngay
              </button>
              <button className="px-8 py-4 font-bold text-white transition-all border-2 border-white/50 rounded-full hover:border-white hover:bg-white/10">
                Bộ Sưu Tập
              </button>
            </div>
          </div>

          {/* Product Right */}
          <div className="relative flex-1 block">
             <div className="relative z-20 transition-transform duration-700 hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070" 
                alt="Banner Shoe"
                className="w-full h-auto drop-shadow-2xl -rotate-12"
              />
            </div>

            {/* Floating Info Cards */}
            <div className="absolute z-30 p-4 text-white bg-white/10 backdrop-blur-md shadow-2xl top-10 -right-4 rounded-xl hidden md:block">
              <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">New Release</p>
              <h4 className="text-lg font-bold">Nike Air Max</h4>
            </div>

            <div className="absolute z-30 p-4 text-white bg-black/60 backdrop-blur-md shadow-2xl -bottom-4 -left-10 rounded-xl hidden md:block">
               <h4 className="text-lg font-bold">Innovation Tech</h4>
               <p className="text-xs text-gray-400">2026 Edition</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Banner;
