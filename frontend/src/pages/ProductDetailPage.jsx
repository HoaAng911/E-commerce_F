import { useState, useEffect } from 'react';
import { Heart, Minus, Plus, ShoppingCart, Star, ChevronLeft, Share2, Info, MessageSquare, ShieldCheck } from 'lucide-react';
import useProductStore from '../store/product.store';
import useCartStore from '../store/cart.store';
import useReviewStore from '../store/review.store';
import { useParams, Link } from 'react-router-dom';
import ReviewSection from '../components/review/ReviewSection'
import useAuthStore from '../store/auth.store';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { fetchProductById, selectedProduct, loading, error } = useProductStore();
  const { reviews, fetchReviewsByProduct, addReview } = useReviewStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = selectedProduct?.stock === 0;
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab ] = useState('description');
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    if (id) {
      fetchProductById(id);
      fetchReviewsByProduct(id);
    }
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (selectedProduct) {
      setMainImage(selectedProduct.mainImage);
    }
  }, [selectedProduct]);

  const handleSendReview = async (data) => {
    if (!user) return toast.error("Vui lòng đăng nhập để đánh giá");
    await addReview({
      ...data,
      productId: id,
      userId: user.id,
      size: selectedSize,
      color: selectedColor
    });
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuantityChange = (type) => {
    if (isOutOfStock) return;
    if (type === 'increase' && quantity < selectedProduct?.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-admin-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!selectedProduct) return <div className="flex items-center justify-center min-h-screen">Sản phẩm không tồn tại</div>;

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Navigation Head */}
        <div className="flex items-center justify-between mb-8">
           <Link to="/products" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-admin-primary transition-colors uppercase tracking-widest">
              <ChevronLeft size={18} />
              Quay lại cửa hàng
           </Link>
           <div className="flex items-center gap-4">
              <button className="p-2.5 text-gray-400 hover:text-black border border-gray-100 rounded-full transition-all hover:bg-gray-50"><Share2 size={18} /></button>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2.5 border rounded-full transition-all hover:bg-gray-50 ${isLiked ? 'text-red-500 border-red-100 bg-red-50' : 'text-gray-400 border-gray-100'}`}
              >
                <Heart size={18} className={isLiked ? "fill-current" : ""} />
              </button>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

          {/* LEFT: IMAGE GALLERY (MINIMALIST) */}
          <div className="flex-1 space-y-4">
            <div className="bg-[#F8F8F9] rounded-3xl overflow-hidden aspect-[4/5] flex items-center justify-center p-8 group relative">
               <img 
                src={mainImage} 
                alt={selectedProduct.name} 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
               />
               {selectedProduct.discountPercent > 0 && (
                 <span className="absolute top-8 left-8 bg-black text-white px-4 py-1.5 text-xs font-black tracking-widest rounded-full uppercase">
                    -{selectedProduct.discountPercent}% OFF
                 </span>
               )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
               {[selectedProduct.mainImage, ...(selectedProduct.images || [])].slice(0, 4).map((img, idx) => (
                 <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square bg-[#F8F8F9] rounded-2xl overflow-hidden p-2 border-2 transition-all ${mainImage === img ? 'border-admin-primary' : 'border-transparent hover:border-gray-200'}`}
                 >
                    <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="thumb" />
                 </button>
               ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex-1">
             <div className="space-y-8">
                <div>
                   <span className="text-[10px] font-black tracking-[0.3em] text-admin-primary uppercase bg-admin-primary-light px-3 py-1 rounded-full">{selectedProduct.brand}</span>
                   <h1 className="mt-4 text-4xl sm:text-5xl font-black text-black tracking-tight leading-none uppercase italic">{selectedProduct.name}</h1>
                   <div className="flex items-center gap-4 mt-6">
                      <div className="flex items-center gap-1 text-yellow-400">
                         <Star size={16} fill="currentColor" />
                         <span className="text-sm font-black text-black ml-1">{selectedProduct.rating || '4.8'}</span>
                      </div>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <button className="text-sm font-bold text-gray-400 border-b border-transparent hover:border-gray-400 transition-all">{selectedProduct.reviewCount || 0} Nhận xét</button>
                   </div>
                </div>

                <div className="space-y-1">
                   {selectedProduct.discountPercent > 0 && (
                     <p className="text-sm font-bold text-gray-400 line-through tracking-wider">{formatPrice(selectedProduct.originalPrice)}</p>
                   )}
                   <p className="text-4xl font-black text-black tracking-tighter italic">{formatPrice(selectedProduct.price)}</p>
                </div>

                {/* SELECTORS */}
                <div className="space-y-10 py-8 border-y border-gray-100">
                   {/* Color Selector */}
                   <div>
                      <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-900 mb-4">Chọn màu sắc</h4>
                      <div className="flex flex-wrap gap-3">
                         {selectedProduct.colors?.map(color => (
                            <button 
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-6 py-2.5 rounded-full text-xs font-black transition-all border-2 ${
                                   selectedColor === color 
                                   ? 'bg-black text-white border-black shadow-lg shadow-black/20' 
                                   : 'bg-white text-black border-gray-100 hover:border-gray-300'
                                } uppercase tracking-widest`}
                            >
                               {color}
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Size Selector */}
                   <div>
                      <div className="flex items-center justify-between mb-4">
                         <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-900">Chọn kích thước</h4>
                         <button className="text-[10px] font-bold text-admin-primary uppercase tracking-widest border-b border-admin-primary">Hướng dẫn chọn size</button>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                         {selectedProduct.sizes?.map(size => (
                            <button 
                               key={size}
                               onClick={() => setSelectedSize(size)}
                               className={`aspect-square sm:aspect-auto sm:py-3 flex items-center justify-center rounded-2xl text-xs font-black transition-all border-2 ${
                                  selectedSize === size 
                                  ? 'bg-admin-primary text-white border-admin-primary shadow-lg shadow-admin-primary/20' 
                                  : 'bg-white text-black border-gray-100 hover:border-gray-300'
                               }`}
                            >
                               {size}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="space-y-6">
                   <div className="flex gap-8 border-b border-gray-100">
                      {['description', 'reviews', 'faq'].map(tab => (
                        <button 
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                              activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                           }`}
                        >
                           {tab === 'description' ? 'Mô tả' : tab === 'reviews' ? 'Đánh giá' : 'Hỏi đáp'}
                           {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-admin-primary rounded-full"></div>}
                        </button>
                      ))}
                   </div>

                   <div className="text-sm leading-relaxed text-gray-500 min-h-[100px] animate-fade-in">
                      {activeTab === 'description' && (
                        <div className="space-y-4">
                           <p>{selectedProduct.description || "Thêm một chút tự tin vào bước đi của bạn với thiết kế đột phá này."}</p>
                           <ul className="space-y-2">
                              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-admin-primary rounded-full"></div> Kiểu dáng hiện đại, dễ phối đồ.</li>
                              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-admin-primary rounded-full"></div> Chất liệu cao cấp, độ bền vượt trội.</li>
                              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-admin-primary rounded-full"></div> Bảo hành chính hãng 12 tháng.</li>
                           </ul>
                        </div>
                      )}
                      {activeTab === 'reviews' && (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                           <MessageSquare className="mx-auto text-gray-300 mb-2" size={32} />
                           <p className="font-bold text-gray-400">Xem chi tiết đánh giá ở phía dưới</p>
                        </div>
                      )}
                      {activeTab === 'faq' && (
                         <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                               <p className="font-bold text-gray-900 mb-1">Cách bảo quản?</p>
                               <p className="text-xs">Tránh phơi trực tiếp dưới ánh nắng mặt trời.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                               <p className="font-bold text-gray-900 mb-1">Chính sách đổi trả?</p>
                               <p className="text-xs">Hỗ trợ đổi size trong vòng 7 ngày nếu còn nguyên tem mác.</p>
                            </div>
                         </div>
                      )}
                   </div>
                </div>

                {/* TRUST BADGES */}
                <div className="grid grid-cols-2 gap-4 py-8">
                   <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <ShieldCheck className="text-admin-primary" size={24} />
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Cam kết</p>
                         <p className="text-[9px] font-bold text-gray-400">100% Chính hãng</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <Info className="text-admin-primary" size={24} />
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Hỗ trợ</p>
                         <p className="text-[9px] font-bold text-gray-400">Tư vấn 24/7</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* REVIEW SECTION DOWN BELOW */}
        <div className="mt-24 pt-24 border-t border-gray-100">
           <ReviewSection
            reviews={reviews}
            onSendReview={handleSendReview}
            user={user}
          />
        </div>

      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-6 animate-slide-up">
         <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-2xl border border-gray-100 shadow-[0_-20px_50px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 pl-4">
               <div className="hidden sm:block w-12 h-12 bg-gray-50 rounded-xl overflow-hidden p-1">
                  <img src={selectedProduct.mainImage} className="w-full h-full object-contain mix-blend-multiply" alt="mini" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-black uppercase italic tracking-tight line-clamp-1">{selectedProduct.name}</h4>
                  <p className="text-[10px] font-bold text-admin-primary">{formatPrice(selectedProduct.price)}</p>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className={`hidden md:flex items-center bg-gray-100 rounded-full px-4 h-12 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <button onClick={() => handleQuantityChange('decrease')} disabled={isOutOfStock} className="p-1 hover:text-admin-primary transition-colors"><Minus size={14} /></button>
                  <span className="w-10 text-center text-sm font-black italic">{isOutOfStock ? 0 : quantity}</span>
                  <button onClick={() => handleQuantityChange('increase')} disabled={isOutOfStock} className="p-1 hover:text-admin-primary transition-colors"><Plus size={14} /></button>
               </div>
               
               <button 
                disabled={isOutOfStock}
                onClick={async () => {
                   if (isOutOfStock) {
                     toast.error("Sản phẩm này hiện đang hết hàng");
                     return;
                   }
                   if (!selectedSize || !selectedColor) {
                     toast.error("Vui lòng chọn size và màu sắc");
                     return;
                   }
                   try {
                     await addToCart({ productId: selectedProduct.id, quantity, size: selectedSize, color: selectedColor });
                     toast.success("Đã thêm vào giỏ hàng!");
                   } catch (err) {
                     toast.error(err.message || "Không thể thêm vào giỏ hàng");
                   }
                 }}
                className={`flex items-center gap-3 px-10 h-14 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
                  isOutOfStock 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-black text-white hover:bg-admin-primary shadow-black/10'
                }`}
               >
                  <ShoppingCart size={18} />
                  <span>{isOutOfStock ? 'Hết hàng' : `Thêm vào giỏ (${quantity})`}</span>
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ProductDetailPage;
