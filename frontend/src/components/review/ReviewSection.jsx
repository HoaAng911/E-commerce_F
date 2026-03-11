import { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';

const ReviewSection = ({ reviews, onSendReview, user }) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* CỘT TRÁI: FORM GỬI ĐÁNH GIÁ */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Viết đánh giá</h2>
          <div className="space-y-4 p-6 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2">Số sao</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`cursor-pointer transition-colors ${
                      star <= newRating ? 'fill-black text-black' : 'text-gray-300'
                    }`}
                    onClick={() => setNewRating(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2">Nhận xét của bạn</p>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                className="w-full p-4 text-sm border-2 border-gray-200 rounded-xl focus:border-black outline-none h-32 transition-all"
              />
            </div>
            <button
              onClick={() => {
                onSendReview({ comment: newComment, rating: newRating });
                setNewComment('');
              }}
              className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 active:scale-95 transition-all"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH ĐÁNH GIÁ */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">
            Đánh giá khách hàng ({reviews?.length || 0})
          </h2>
          
          <div className="space-y-8">
            {reviews?.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="pb-8 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'fill-black text-black' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-sm uppercase">Khách hàng ẩn danh</span>
                    {review.isVerifiedPurchase && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                        <CheckCircle size={10} /> Đã mua hàng
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed text-sm italic">"{review.comment}"</p>
                  
                  {(review.size || review.color) && (
                    <div className="mt-3 flex gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                      {review.size && <span>Size: {review.size}</span>}
                      {review.color && <span>Màu: {review.color}</span>}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Chưa có đánh giá nào cho sản phẩm này.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewSection