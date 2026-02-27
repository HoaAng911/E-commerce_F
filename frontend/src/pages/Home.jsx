import { Banner } from "../components/layout/Banner";

import { BrandCategory } from "../components/layout/BrandCategory";
import FeaturedProducts from "../components/product/FeaturedProducts";
import NewArrivals from "../components/product/NewArrivals";


export default function Home() {
  return (
    // Sử dụng màu nền đen đồng nhất cho toàn bộ trang
    <div className="min-h-screen ">

      {/* 1. HERO SECTION: Luôn để full width */}
      <Banner />


      <main className="container px-4 py-20 mx-auto space-y-24 md:px-8">
        <BrandCategory />
        {/* Section Dịch vụ: Cam kết của shop */}
        <section className="animate-fade-in">

        </section>

        {/* Section Sản phẩm nổi bật */}
        <section>
          <div className="flex flex-col justify-between gap-4 mb-10 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl italic font-black tracking-tighter text-white uppercase">
                Featured <span className="text-blue-600">Items</span>
              </h2>
              <p className="text-gray-500 text-sm mt-2 uppercase tracking-[0.2em]">Những sản phẩm được săn đón nhất</p>
            </div>
            <div className="h-[1px] flex-1 bg-white/10 mb-4 hidden md:block mx-8"></div>
            <button className="pb-1 text-xs font-bold tracking-widest text-white uppercase transition-all border-b border-blue-600 hover:text-blue-600">
              Xem tất cả
            </button>
          </div>

          <FeaturedProducts />
        </section>

        {/* Section Banner Quảng Cáo Giữa Trang (Tạo khoảng nghỉ) */}
        <section className="relative h-[300px] rounded-[2.5rem] overflow-hidden group">
          <div className="absolute inset-0 z-10 bg-linear-to-r from-blue-900/40 to-black" />
          <img
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070"
            className="absolute inset-0 object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
            alt="Promo"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12">
            <span className="text-blue-500 font-bold tracking-[0.3em] uppercase text-xs mb-2">New Season</span>
            <h3 className="text-4xl italic font-black tracking-tighter text-white uppercase">Summer <br /> Collection</h3>
            <button className="px-8 py-3 mt-6 text-xs font-bold text-black uppercase transition-all bg-white rounded-full w-fit hover:bg-blue-600 hover:text-white">
              Mua ngay
            </button>
          </div>
        </section>

        {/* Section Hàng mới về */}
        <section>
          <div className="flex flex-col justify-between gap-4 mb-10 md:flex-row md:items-end">
            <div className="h-[1px] flex-1 bg-white/10 mb-4 hidden md:block mx-8"></div>
          </div>
          <NewArrivals />
        </section>
      </main>
    </div>
  );
}