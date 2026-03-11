import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useArticleStore from '../../store/article.store'; 

const ArticleList = () => {
  const { articles, fetchArticles, isLoading } = useArticleStore(); 

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]); //

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
    </div>
  );

  const displayArticles = articles.slice(0, 8); //

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto md:px-10">
        {/* Header theo kiểu Nike */}
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tighter text-black uppercase md:text-3xl">
            Mới Nhất & Nổi Bật
          </h2>
          <Link to="/articles" className="pb-1 font-medium text-black transition-colors border-b border-black hover:text-gray-500">
            Xem tất cả
          </Link>
        </div>
        
        {/* Grid 4 cột chuẩn Nike */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
          {displayArticles.map((article) => (
            <Link 
              key={article.id} 
              to={`/articles/${article.slug}`} //
              className="flex flex-col text-black no-underline group"
            >
              {/* Image Container */}
              <div className="aspect-[4/5] overflow-hidden bg-[#f5f5f5] mb-4">
                <img 
                  src={article.thumbnail || 'https://via.placeholder.com/600x750?text=Nike+Article'} //
                  alt={article.title} //
                  className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
              
              {/* Content */}
              <div className="flex flex-col flex-grow">
                <span className="text-[#757575] text-sm font-medium mb-1 uppercase">
                  {article.author?.fullName || 'Nike Journal'}
                </span>
                <h3 className="text-lg italic font-bold leading-tight tracking-tight uppercase transition-colors group-hover:text-gray-600 line-clamp-2">
                  {article.title} {/* */}
                </h3>
                <p className="mt-2 text-[#757575] text-sm line-clamp-2 font-normal">
                  {/* Loại bỏ tag HTML nếu có trong content */}
                  {article.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}... {/* */}
                </p>
                <span className="self-start mt-4 text-sm font-bold transition-all border-b-2 border-transparent group-hover:border-black">
                  Khám phá ngay
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleList;