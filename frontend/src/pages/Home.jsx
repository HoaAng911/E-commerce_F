import { Banner } from "../components/layout/Banner";
import { BrandCategory } from "../components/layout/BrandCategory";
import FeaturedProducts from "../components/product/FeaturedProducts";
import NewArrivals from "../components/product/NewArrivals";
import PromoBanner from "../components/layout/PromoBanner";
import ArticleDetail from "./ArticleDetail";
import ArticleList from "../components/layout/ArticleList";

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
          <NewArrivals />
        </section>
        <ArticleList/>
      </main>
    </div>
  );
}