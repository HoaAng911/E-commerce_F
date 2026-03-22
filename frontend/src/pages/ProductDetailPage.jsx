import { useState, useEffect } from 'react';
import { Heart, Minus, Plus, ShoppingCart, ChevronDown, Star } from 'lucide-react';
import useProductStore from '../store/product.store';
import useCartStore from '../store/cart.store';
import useReviewStore from '../store/review.store';
import { useParams } from 'react-router-dom';
import ReviewSection from '../components/review/ReviewSection'
import useAuthStore from '../store/auth.store';
import { toast } from 'sonner';
const ProductDetailPage = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const { fetchProductById, selectedProduct, loading, error } = useProductStore();
  const { reviews, fetchReviewsByProduct, addReview } = useReviewStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();
  useEffect(() => {
    if (id) {
      fetchProductById(id);
      fetchReviewsByProduct(id);
    }
    window.scrollTo(0, 0);
  }, [id]);
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
  // Giữ nguyên hàm format giá của bạn
  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Giữ nguyên logic thay đổi số lượng
  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < selectedProduct?.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  if (!selectedProduct) return <div className="flex items-center justify-center min-h-screen">Không tìm thấy sản phẩm</div>;

  return (
    <div className="min-h-screen pb-20 bg-white pt-28">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-16 lg:flex-row">

          {/* CỘT TRÁI: DANH SÁCH ẢNH DÀN TRẢI (NIKE STYLE) */}
          <div className="w-full lg:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#f5f5f5] aspect-square overflow-hidden md:col-span-2">
              <img src={selectedProduct.mainImage} alt={selectedProduct.name} className="object-cover w-full h-full" />
            </div>
            {selectedProduct.images?.slice(0, 3).map((img, index) => (
              <div key={index} className="bg-[#f5f5f5] aspect-square overflow-hidden">
                <img src={img} alt={`${selectedProduct.name} ${index}`} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: THÔNG TIN SẢN PHẨM (STICKY) */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-28 self-start">
            <div className="mb-2 font-bold tracking-tighter uppercase text-md">{selectedProduct.brand}</div>
            <h1 className="mb-4 text-3xl italic font-black leading-none tracking-tighter uppercase">
              {selectedProduct.name}
            </h1>

            <div className="mb-6">
              <div className="text-xl font-bold text-red-600">{formatPrice(selectedProduct.price)}</div>
              {selectedProduct.discountPercent > 0 && (
                <div className="flex gap-2 mt-1 text-sm">
                  <span className="text-gray-400 line-through">{formatPrice(selectedProduct.originalPrice)}</span>
                  <span className="font-bold text-black">-{selectedProduct.discountPercent}%</span>
                </div>
              )}
            </div>

            {/* Màu sắc */}
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold tracking-widest uppercase">Chọn màu sắc</p>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-2 border-2 text-sm font-bold transition-all ${selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Kích thước */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold tracking-widest uppercase">Chọn size</p>
                <span className="text-xs text-gray-500 underline cursor-pointer">Bảng quy đổi</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {selectedProduct.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border-2 text-sm font-bold rounded-sm transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div className="mb-10">
              <p className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">Số lượng (Còn {selectedProduct.stock})</p>
              <div className="flex items-center w-32 overflow-hidden border-2 border-gray-200 rounded-full">
                <button onClick={() => handleQuantityChange('decrease')} className="flex-1 p-2 hover:bg-gray-100"><Minus size={16} /></button>
                <span className="font-bold">{quantity}</span>
                <button onClick={() => handleQuantityChange('increase')} className="flex-1 p-2 hover:bg-gray-100"><Plus size={16} /></button>
              </div>
            </div>

            {/* Nút bấm Nike Style */}
            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
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
                className="w-full py-5 font-bold tracking-widest text-white uppercase transition-all bg-black rounded-full hover:bg-gray-800 active:scale-95"
              >
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center justify-center w-full gap-2 py-5 font-bold tracking-widest uppercase transition-all border-2 border-gray-200 rounded-full hover:border-black"
              >
                Yêu thích <Heart size={20} className={isLiked ? "fill-red-600 text-red-600" : ""} />
              </button>
            </div>

            {/* Mô tả */}
            <div className="pt-8 mt-12 border-t border-gray-100">
              <p className="mb-6 leading-relaxed text-gray-800">{selectedProduct.description}</p>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                <span>SỐ LẦN ĐƯỢC XEM: {selectedProduct.views || 0}</span>
                <span>ĐÃ BÁN: {selectedProduct.soldCount}</span>
              </div>
            </div>
            
          </div>
          
        </div>
        <ReviewSection
              reviews={reviews}
              onSendReview={handleSendReview}
              user={user}
            />
      </div>
    </div>
  );
};

export default ProductDetailPage;
