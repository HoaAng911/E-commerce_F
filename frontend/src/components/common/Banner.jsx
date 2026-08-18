import React from 'react';

export const Banner = () => {
  return (
    <div className="relative min-h-[640px] overflow-hidden bg-ink text-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-volt/10 skew-x-12 translate-x-32" />
      <div aria-hidden className="pointer-events-none absolute -left-6 bottom-[-0.18em] font-display uppercase leading-none tracking-tight text-[26rem] text-white/[0.05] select-none hidden xl:block">AIR</div>

      <div className="relative h-full container-premium mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center h-full gap-12 md:flex-row">
          
          {/* Content Left */}
          <div className="flex-1 text-center md:text-left">
            <p className="mb-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-volt">
              <span className="h-px w-10 bg-volt"></span> New Season — 2026
            </p>
            <h1 className="font-display text-6xl md:text-8xl uppercase leading-[0.95] tracking-wide">
              Step Into The <span className="text-volt">Future</span> Of Footwear
            </h1>
            <p className="mt-6 mb-10 text-lg text-white/70 md:text-xl max-w-xl mx-auto md:mx-0">
              Khám phá bộ sưu tập giày mới nhất với công nghệ tiên tiến mang lại cảm giác thoải mái tuyệt đối cho mỗi bước chân.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center md:justify-start">
              <button className="px-8 py-4 text-sm font-bold uppercase tracking-widest bg-volt text-ink hover:bg-white transition-colors">
                Mua Ngay
              </button>
              <button className="px-8 py-4 text-sm font-bold uppercase tracking-widest border-2 border-white/40 hover:border-white hover:bg-white/10 transition-colors">
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
            <div className="absolute z-30 p-4 text-white bg-white/10 backdrop-blur-md top-10 -right-4 hidden md:block border border-white/15">
              <p className="text-xs text-volt font-bold uppercase tracking-widest mb-1">New Release</p>
              <h4 className="font-display text-lg uppercase tracking-wide">Nike Air Max</h4>
            </div>

            <div className="absolute z-30 p-4 text-white bg-black/60 backdrop-blur-md -bottom-4 -left-10 hidden md:block border border-white/15">
               <h4 className="font-display text-lg uppercase tracking-wide">Innovation Tech</h4>
               <p className="text-xs text-gray-400">2026 Edition</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Banner;
