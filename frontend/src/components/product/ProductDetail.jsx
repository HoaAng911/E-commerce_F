import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Minus, Plus, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import useProductStore from '../../store/product.store';
import useCartStore from '../../store/auth.store'
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { fetchProductById, selectedProduct, loading, error } = useProductStore();
  
  const addToCart = useCartStore((state) => state.addToCart);
  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id]);

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < selectedProduct?.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {

    if (!selectedSize) return alert('Vui lòng chọn size');
    if (!selectedColor) return alert('Vui lòng chọn màu sắc');

    try {
      await addToCart({
        productId: selectedProduct.id,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor
      });

      alert('Đã thêm vào giỏ hàng thành công!');

    } catch (error) {
      console.error("Lỗi khi thêm giỏ hàng:", error);
      alert(error.response?.data?.message || 'Vui lòng đăng nhập để thực hiện chức năng này');
    }
  };
  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn size');
      return;
    }
    if (!selectedColor) {
      alert('Vui lòng chọn màu');
      return;
    }
    console.log('Buy now:', { selectedProduct, selectedSize, selectedColor, quantity });
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải sản phẩm...</div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mb-4 text-lg text-red-600">Có lỗi xảy ra: {error}</div>
        <button
          onClick={() => fetchProductById(id)}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Kiểm tra nếu không có sản phẩm
  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Không tìm thấy sản phẩm</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container px-4 py-4 mx-auto">
        <div className="text-sm text-gray-500">
          <span>Trang chủ</span>
          <span className="mx-2">/</span>
          <span>Giày trẻ em</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{selectedProduct.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="mb-4 overflow-hidden border border-gray-200 rounded aspect-square">
              <img
                src={selectedProduct.images?.[selectedImage] || selectedProduct.mainImage}
                alt={selectedProduct.name}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {selectedProduct.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded border-2 ${selectedImage === index ? 'border-black' : 'border-gray-200'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${selectedProduct.name} ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Brand */}
            <div className="mb-2 text-sm text-gray-500 uppercase">{selectedProduct.brand}</div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-gray-900">{selectedProduct.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(parseFloat(selectedProduct.rating) || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {parseFloat(selectedProduct.rating).toFixed(1)} ({selectedProduct.reviewCount} đánh giá)
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Đã bán: {selectedProduct.soldCount}
              </div>
            </div>

            {/* Price */}
            <div className="pb-6 mb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(selectedProduct.price)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(selectedProduct.originalPrice)}
                </span>
                <span className="px-2 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded">
                  -{selectedProduct.discountPercent}%
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <div className="mb-3 font-medium text-gray-900">Màu sắc:</div>
              <div className="flex gap-2">
                {selectedProduct.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded transition-colors ${selectedColor === color
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="mb-3 font-medium text-gray-900">Kích thước:</div>
              <div className="grid grid-cols-5 gap-2">
                {selectedProduct.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 border-2 rounded transition-colors ${selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <div className="mb-3 font-medium text-gray-900">Số lượng:</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity >= selectedProduct.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Còn {selectedProduct.stock} sản phẩm
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-black transition-colors border-2 border-black rounded hover:bg-black hover:text-white"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-white transition-colors bg-black rounded hover:bg-gray-800"
              >
                Mua ngay
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 border-2 rounded transition-colors ${isLiked
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-red-300'
                  }`}
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">Miễn phí vận chuyển</div>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">Bảo hành 6 tháng</div>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-xs text-gray-600">Đổi trả 7 ngày</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 uppercase">Mô tả sản phẩm</h2>
            <div className="w-16 h-1 mt-2 bg-black"></div>
          </div>
          <div className="prose max-w-none">
            <p className="leading-relaxed text-gray-600">{selectedProduct.description}</p>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Đặc điểm nổi bật:</h3>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• Thiết kế hợp tác cùng Disney với hình ảnh nhân vật ngộ nghĩnh</li>
                  <li>• Chất liệu an toàn, thân thiện với làn da trẻ em</li>
                  <li>• Đế giày êm ái, chống trượt hiệu quả</li>
                  <li>• Dễ dàng vệ sinh và bảo quản</li>
                  <li>• Phù hợp cho các hoạt động thể thao và vui chơi hàng ngày</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;