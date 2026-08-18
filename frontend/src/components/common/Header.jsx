import { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Menu, X, LogOut, ChevronDown, Settings, Package } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import useAuthStore from '../../store/auth.store';
import useCartStore from '../../store/cart.store';
import SearchSuggestions from './SearchSuggestions';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const isLoggedIn = isAuthenticated();

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Hiệu ứng đổi màu header khi scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tự động fetch giỏ hàng khi user đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn, fetchCart]);

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
      className={`fixed top-0 left-0 right-0 z-[100] bg-bone/85 backdrop-blur-xl border-b border-ink/10 transition-all duration-500 ${isScrolled
        ? 'py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
        : 'py-4'
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
                    className={`pb-0.5 border-b-2 text-[13px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${location.search.includes(item.name) ? 'text-ink border-volt' : 'text-ink/50 border-transparent hover:text-ink'
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

            <div className="relative hidden lg:block">
              <SearchSuggestions />
            </div>

            {/* Cart Icon - Modern Badge */}
            <Link to="/cart" className="relative p-2 group" aria-label="Giỏ hàng">
              <div className="absolute inset-0 transition-transform duration-300 scale-0 bg-ink/5 group-hover:scale-100" />
              <ShoppingBag className="relative w-6 h-6 text-ink transition-transform duration-300 group-hover:scale-110" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-volt text-[10px] font-bold text-ink ring-2 ring-bone">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
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
                  <div className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full bg-ink text-volt">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-ink hover:bg-black active:scale-95 transition-all"
                >
                  Đăng nhập
                </Link>
              )}

              {/* Profile Dropdown Card */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-bone shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 border border-ink/10 p-2">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors">
                      <User className="w-4 h-4" /> Hồ sơ cá nhân
                    </Link>
                    <Link
                      to="/my-orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-all font-medium"
                    >
                      <Package className="w-4 h-4" /> Đơn hàng của tôi
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors">
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
        <div className="fixed inset-0 z-[60] bg-bone p-6">
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
                    className="font-display text-4xl uppercase tracking-wide text-ink hover:text-ink/60 transition-colors"
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
                className="block w-full py-4 text-sm font-bold uppercase tracking-widest text-center text-white bg-ink"
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
