import React, { useEffect } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cart.store';
import PriceDisplay from '../ProductCard/PriceDisplay'; 

const CartPage = () => {
  const { cart, isLoading, fetchCart, updateItemQuantity, removeItem, selectItem } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading && !cart) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border border-black rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <ShoppingBag className="w-12 h-12 mb-6 text-gray-200" />
        <h2 className="text-xl font-bold tracking-tight text-gray-900 uppercase">Giỏ hàng trống</h2>
        <p className="mt-2 text-sm text-gray-500">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link to="/products" className="px-8 py-3 mt-8 text-xs font-bold tracking-widest text-white uppercase transition-colors bg-black hover:bg-gray-800">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-white">
      {/* Header */}
      <div className="max-w-6xl px-4 pt-12 mx-auto mb-12">
        <div className="flex items-end justify-between pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase">Giỏ hàng</h1>
            <p className="mt-1 text-xs tracking-widest text-gray-400 uppercase">
              Tạm tính ({cart.totalItems} sản phẩm)
            </p>
          </div>
          <Link to="/products" className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:opacity-60">
            <ArrowLeft className="w-4 h-4" /> Tiếp tục mua sắm
          </Link>
        </div>
      </div>

      <div className="max-w-6xl px-4 mx-auto">
        <div className="grid grid-cols-12 gap-16">
          {/* Danh sách sản phẩm */}
          <div className="col-span-12 lg:col-span-7">
            <div className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-6 py-8 first:pt-0">
                  {/* Checkbox ẩn hoặc dùng custom nhẹ nhàng */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={(e) => selectItem(item.id, e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-black"
                    />
                  </div>

                  {/* Ảnh sản phẩm */}
                  <div className="overflow-hidden rounded-sm w-28 h-36 bg-gray-50 shrink-0">
                    <img 
                      src={item.product.mainImage} 
                      alt={item.product.name} 
                      className="object-cover w-full h-full" 
                    />
                  </div>

                  {/* Thông tin */}
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold leading-tight text-gray-900">
                          {item.product.name}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 transition-colors hover:text-black"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-4 mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>Size: {item.size}</span>
                        <span>Màu: {item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Bộ tăng giảm số lượng tối giản */}
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="flex items-center justify-center w-8 h-8 hover:bg-gray-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-xs font-bold text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="flex items-center justify-center w-8 h-8 hover:bg-gray-50"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <PriceDisplay price={item.price * item.quantity} className="text-lg font-bold tracking-tight" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky p-8 rounded-sm bg-gray-50 top-10">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 border-b border-gray-200 pb-4">
                Chi tiết thanh toán
              </h2>
              
              <div className="mb-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tổng tiền hàng</span>
                  <span className="font-medium">{cart.totalPrice.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className="text-black font-bold italic text-[11px] uppercase tracking-widest">Miễn phí</span>
                </div>
                <div className="flex items-end justify-between pt-6 border-t border-gray-200">
                  <span className="text-sm font-bold tracking-widest uppercase">Tổng cộng</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold tracking-tighter">
                      {cart.totalPrice.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-sm">
                Thanh toán đơn hàng
              </button>

              <div className="mt-8 space-y-3">
                 <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full"></span> Chính sách đổi trả trong vòng 7 ngày
                 </p>
                 <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full"></span> Cam kết hàng chính hãng 100%
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;