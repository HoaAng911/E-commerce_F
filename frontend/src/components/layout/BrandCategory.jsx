import React from 'react';
import { ArrowRight } from 'lucide-react';

export const BrandCategory = () => {
  const brands = [
    {
      name: 'Nike',
      desc: 'Just Do It',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070',
      link: '/products?brand=Nike',
      gridClass: 'md:col-span-2'
    },
    {
      name: 'Adidas',
      desc: 'Impossible is Nothing',
      image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2070',
      link: '/products?brand=Adidas',
      gridClass: 'md:col-span-1'
    },
    {
      name: "Biti's",
      desc: 'Nâng niu bàn chân Việt',
      // Hình ảnh đại diện cho dòng Hunter Street/Lifestyle rất hợp với vibe hiện đại
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974', 
      link: "/products?brand=Biti's",
      gridClass: 'md:col-span-1'
    },
    {
      name: 'Converse',
      desc: 'Classic Never Dies',
      image: 'https://images.unsplash.com/photo-1494496195158-c3becb4f2475?q=80&w=2070',
      link: '/products?brand=Converse',
      gridClass: 'md:col-span-1'
    },
    {
      name: 'Vans',
      desc: 'Off The Wall',
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1996',
      link: '/products?brand=Vans',
      gridClass: 'md:col-span-1'
    }
  ];

  return (
    <div className="py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl italic font-black tracking-tighter text-gray-900 uppercase">
            Shop By <span className="text-blue-600">Brands</span>
          </h2>
          <div className="w-12 h-1 mt-2 bg-blue-600"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {brands.map((brand, index) => (
          <a 
            href={brand.link}
            key={index} 
            className={`relative overflow-hidden group rounded-[2rem] aspect-[4/3] md:aspect-auto md:h-[350px] ${brand.gridClass}`}
          >
            {/* Image */}
            <img 
              src={brand.image} 
              alt={brand.name}
              className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 transition-opacity bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                {brand.desc}
              </span>
              <h3 className="flex items-center gap-2 text-3xl italic font-black tracking-tighter text-white uppercase">
                {brand.name}
                <ArrowRight className="w-6 h-6 transition-transform duration-300 -rotate-45 group-hover:rotate-0" />
              </h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};