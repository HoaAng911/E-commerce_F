import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            to="/" 
            className="text-[10px] font-bold tracking-widest text-premium-gray uppercase hover:text-premium-black transition-colors"
          >
            Trang chủ
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-3 h-3 text-gray-300" />
            {item.path ? (
              <Link
                to={item.path}
                className="text-[10px] font-bold tracking-widest text-premium-gray uppercase hover:text-premium-black transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[10px] font-bold tracking-widest text-premium-black uppercase">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
