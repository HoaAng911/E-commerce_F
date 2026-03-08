import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SearchSuggestions() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          // Sử dụng full URL để tránh lỗi trả về HTML nếu chưa cấu hình Proxy
          const response = await axios.get(`http://localhost:3000/products/suggestions?search=${query}`);
          const rawData = response.data;
          const results = Array.isArray(rawData) ? rawData : (rawData.products || rawData.data || []);
          setSuggestions(results);
          setIsOpen(true);
        } catch (error) {
          console.error("Lỗi gọi API:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 400); // Tăng debounce lên một chút để tạo cảm giác mượt mà

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      if (query.trim()) {
        navigate(`/products?q=${query}`);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={searchRef}>
      {/* Search Input Container */}
      <div className={`
        group flex items-center px-4 py-2.5 transition-all duration-300 rounded-full
        ${isOpen ? 'bg-white shadow-2xl ring-1 ring-black/5' : 'bg-gray-100 hover:bg-gray-200/70'}
      `}>
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        ) : (
          <Search className={`w-5 h-5 transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
        )}
        
        <input
          type="text"
          placeholder="Tìm kiếm giày, quần áo..."
          className="flex-1 ml-3 text-[15px] bg-transparent outline-none border-none focus:ring-0 text-gray-800 placeholder:text-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
          onFocus={() => query.length > 1 && setIsOpen(true)}
        />

        {query && (
          <button 
            onClick={() => { setQuery(''); setSuggestions([]); }}
            className="p-1 transition-colors rounded-full hover:bg-gray-200"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-[100] mt-3 bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          
          {suggestions.length > 0 ? (
            <>
              <div className="px-4 py-3 border-b bg-gray-50/50 border-gray-50">
                <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Kết quả gợi ý</span>
              </div>
              
              <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(`/products/${item.id}`);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-4 p-3 mx-2 my-1 transition-all cursor-pointer hover:bg-blue-50/60 rounded-xl group/item"
                  >
                    <div className="relative flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg w-14 h-14">
                      <img
                        src={item.mainImage}
                        alt={item.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover/item:scale-110"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate group-hover/item:text-blue-600">
                        {item.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-500">Nike Sportswear • Black</p>
                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {new Intl.NumberFormat('vi-VN').format(item.price)}₫
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-300 transition-all -translate-x-2 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:text-blue-500" />
                  </div>
                ))}
              </div>

              <div 
                onClick={() => navigate(`/products?q=${query}`)}
                className="p-3 m-2 text-center transition-colors cursor-pointer rounded-xl bg-gray-50 hover:bg-gray-100"
              >
                <span className="text-sm font-medium text-gray-600">
                  Xem tất cả kết quả cho <span className="font-bold text-gray-900">"{query}"</span>
                </span>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Không tìm thấy sản phẩm nào khớp với từ khóa.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}