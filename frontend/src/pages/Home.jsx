import React from 'react';
import { BrandCategory } from '../components/common/BrandCategory';
import Banner from '../components/common/Banner';
import FeaturedProducts from '../components/product/FeaturedProducts';
import ArticleList from '../components/common/ArticleList';
import NewArrivals from '../components/product/NewArrivals';
import PromoBanner from '../components/common/PromoBanner';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Banner Section */}
      <Banner />

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Brands Section */}
        <BrandCategory />
        
        {/* New Arrivals Section */}
        <NewArrivals />

        <div className="py-16">
          <FeaturedProducts />
        </div>

        {/* Promotion Section */}
        <div className="py-12">
           <PromoBanner />
        </div>

        {/* Article Section */}
        <ArticleList />
      </div>
    </div>
  );
};

export default Home;