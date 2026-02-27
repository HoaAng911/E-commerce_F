// components/Footer.jsx
import React from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Clock,
  Send,
  ArrowUpRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 font-sans">
      <div className="container px-4 mx-auto -translate-y-1/2">
      </div>
      {/* 2. Main Footer Content */}
      <div className="container px-4 pt-4 pb-16 mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Newsletter */}
          <div className="space-y-8 lg:col-span-4">
            <div>
              <h2 className="text-2xl italic font-black tracking-tighter text-white uppercase">
                Shoe<span className="text-blue-500">Store</span>
              </h2>
              <p className="max-w-sm mt-4 text-sm leading-relaxed text-gray-500">
                Chúng tôi không chỉ bán giày, chúng tôi mang đến phong cách sống. 
                Cam kết sản phẩm chính hãng 100% với dịch vụ hậu mãi tốt nhất.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-widest text-white uppercase">Đăng ký nhận tin</h3>
              <div className="relative max-w-sm group">
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  className="w-full bg-[#141414] border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button className="absolute px-4 text-black transition-all bg-white rounded-full right-1 top-1 bottom-1 hover:bg-blue-500 hover:text-white">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          {/* Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-5">
            <div>
              <h3 className="mb-6 text-sm font-bold tracking-widest text-white uppercase">Danh mục</h3>
              <ul className="space-y-3">
                {['Giày Thể Thao', 'Giày Sneaker', 'Giày Chạy Bộ', 'Phụ Kiện'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center text-sm transition-colors hover:text-white group">
                      <span className="w-0 group-hover:w-4 transition-all duration-300 h-[1px] bg-blue-500 mr-0 group-hover:mr-2"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-bold tracking-widest text-white uppercase">Hỗ trợ</h3>
              <ul className="space-y-3">
                {['Chọn size giày', 'Chính sách đổi trả', 'Đơn hàng của tôi', 'Liên hệ'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm transition-colors hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Contact & Social */}
          <div className="space-y-6 lg:col-span-3">
            <h3 className="text-sm font-bold tracking-widest text-white uppercase">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm">227 Nguyễn Văn Cừ, Quận 5, TP. HCM</span>
              </div>
              <div className="flex items-center gap-3 font-bold text-white">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-lg tracking-wider">1900 1234</span>
              </div>
            </div>      
            <div className="flex gap-3 pt-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#141414] border border-white/5 text-gray-500 hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all shadow-lg">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 3. Bottom Bar */}
      <div className="py-8 border-t border-white/5 bg-black/50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-xs tracking-widest text-gray-600 uppercase">
              © 2024 <span className="font-bold text-white">ShoeStore</span>. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Payment</span>
              <div className="flex gap-2">
                {['Visa', 'MasterCard', 'MoMo', 'VNPAY'].map((p) => (
                  <div key={p} className="px-3 py-1 bg-[#141414] border border-white/10 rounded-md text-[10px] text-gray-400 font-bold">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;