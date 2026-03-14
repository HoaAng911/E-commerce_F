import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useArticleStore from '../store/article.store';

const ArticleDetail = () => {
  const { slug } = useParams();
  const { currentArticle, fetchArticleBySlug, isLoading, clearCurrentArticle } = useArticleStore();

  useEffect(() => {
    if (slug) fetchArticleBySlug(slug);
    return () => clearCurrentArticle();
  }, [slug]);

  if (isLoading || !currentArticle) return <div className="min-h-screen"></div>;

  return (
    <div className="min-h-screen pb-20 bg-white">
      {/* Hero Section */}
      <div className="w-full h-[60vh] md:h-[80vh] relative bg-[#f5f5f5]">
        <img 
          src={currentArticle.thumbnail} //
          className="object-cover w-full h-full"
          alt={currentArticle.title} //
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-black/20 md:p-20">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest text-black uppercase bg-white">
              Journal
            </span>
            <h1 className="mb-4 text-4xl italic font-black leading-none tracking-tighter text-white uppercase md:text-7xl">
              {currentArticle.title} {/* */}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl px-6 mx-auto mt-16">
        <div className="flex flex-col items-start justify-between pb-8 mb-12 border-b border-gray-200 md:flex-row md:items-center">
          <div className="flex items-center mb-4 space-x-4 md:mb-0">
            <div className="flex items-center justify-center w-12 h-12 font-bold text-white bg-black rounded-full">
              {currentArticle.author?.fullName?.charAt(0) || 'N'}
            </div>
            <div>
              <p className="font-bold tracking-tight uppercase">{currentArticle.author?.fullName}</p>
              <p className="text-sm text-gray-500">{new Date(currentArticle.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          <div className="text-sm font-bold tracking-widest text-gray-400 uppercase">
            Views: {currentArticle.views} {/* */}
          </div>
        </div>

        {/* Rich Text Content */}
        <div 
          className="prose prose-lg md:prose-xl prose-slate max-w-none prose-headings:uppercase prose-headings:italic prose-headings:font-black prose-headings:tracking-tighter prose-p:text-gray-800 prose-p:leading-relaxed prose-img:rounded-xl shadow-sm bg-white p-8 rounded-2xl border border-gray-100"
          dangerouslySetInnerHTML={{ __html: currentArticle.content }}
        />
      </div>
    </div>
  );
};
export default ArticleDetail