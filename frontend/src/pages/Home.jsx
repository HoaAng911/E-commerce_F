import { Banner } from "../components/layout/Banner";
import { BrandCategory } from "../components/layout/BrandCategory";
import FeaturedProducts from "../components/product/FeaturedProducts";
import NewArrivals from "../components/product/NewArrivals";
import PromoBanner from "../components/layout/PromoBanner";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      
      <Banner />
      <main className="container px-4 py-12 mx-auto space-y-16 md:py-20 md:px-8 md:space-y-24">      
        <BrandCategory />      
        <FeaturedProducts />
        <PromoBanner />
        {/* Section Hàng mới về */}
        <section>
          <div className="flex flex-row items-center justify-between gap-4 mb-8 md:mb-10">
            <h2 className="text-2xl font-bold tracking-tight uppercase sm:text-3xl">
              Hàng mới về
            </h2>
            <div className="h-[1px] flex-1 bg-white/10 hidden md:block mx-4"></div>
            <a href="/new-arrivals" className="text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300 whitespace-nowrap">
              Xem tất cả &rarr;
            </a>
          </div>         
          <NewArrivals />
        </section>  
      </main>
    </div>
  );
}