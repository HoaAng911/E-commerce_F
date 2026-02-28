import { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Menu, X, LogOut, ChevronDown, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import useAuthStore from '../../store/auth.store';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const isLoggedIn = isAuthenticated();
  
  // Giả lập số lượng giỏ hàng (Sau này lấy từ cart store)
  const cartItemCount = 3;

  // Hiệu ứng đổi màu header khi scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: 'Nike', path: '/products?brand=Nike' },
    { name: 'Adidas', path: '/products?brand=Adidas' },
    { name: 'Puma', path: '/products?brand=Puma' },
    { name: 'Collection', path: '/products' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo - Giữ tối giản */}
          <Link to="/" className="relative z-10 transition-transform duration-300 hover:scale-105">
            <img src={logo} alt="Logo" className="w-32 h-auto md:w-36" />
          </Link>

          {/* Desktop Navigation - Clean Spacing */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`text-[15px] font-medium tracking-wide transition-all duration-300 hover:text-blue-600 ${
                      location.search.includes(item.name) ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-5">
            
            {/* Search Bar - Expandable */}
            <div className="items-center hidden px-4 py-2 transition-all duration-300 border border-transparent rounded-full lg:flex bg-gray-100/50 focus-within:border-blue-500/50 focus-within:bg-white">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Tìm kiếm..."
                className="ml-2 text-sm transition-all duration-500 bg-transparent border-none focus:ring-0 w-28 focus:w-44"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Cart Icon - Modern Badge */}
            <Link to="/cart" className="relative p-2 group">
              <div className="absolute inset-0 transition-transform duration-300 scale-0 rounded-full bg-blue-50 group-hover:scale-100" />
              <ShoppingBag className="relative w-6 h-6 text-gray-700 transition-colors group-hover:text-blue-600" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile - Premium Dropdown */}
            <div className="relative">
              {isLoggedIn ? (
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-1 pr-3 transition-all rounded-full hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white border-2 border-white rounded-full shadow-sm bg-gradient-to-tr from-blue-600 to-purple-600">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="px-5 py-2 text-sm font-semibold text-white transition-all bg-gray-900 rounded-full hover:bg-black hover:shadow-lg active:scale-95"
                >
                  Sign In
                </Link>
              )}

              {/* Profile Dropdown Card */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 border border-gray-100 p-2 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                      <User className="w-4 h-4" /> Hồ sơ cá nhân
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all">
                        <Settings className="w-4 h-4" /> Quản trị viên
                      </Link>
                    )}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="p-2 text-gray-700 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu - Overlay Style */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white p-6 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-10">
            <img src={logo} alt="Logo" className="w-32" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav>
            <ul className="space-y-6">
              {['Nike', 'Adidas', 'Puma', 'Tất cả sản phẩm'].map((item) => (
                <li key={item}>
                  <Link 
                    to="/products" 
                    className="text-3xl font-bold text-gray-900 transition-colors hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="absolute bottom-10 left-6 right-6">
             {!isLoggedIn && (
               <Link 
                to="/login" 
                className="block w-full py-4 font-bold text-center text-white bg-gray-900 rounded-2xl"
                onClick={() => setIsMobileMenuOpen(false)}
               >
                 Đăng nhập ngay
               </Link>
             )}
          </div>
        </div>
      )}
      
      {/* Click outside to close dropdown */}
      {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />}
    </header>
  );
}