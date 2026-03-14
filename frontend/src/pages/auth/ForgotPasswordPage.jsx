import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../../api/auth.service';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tokens, setTokens] = useState({ ticket: '', reset: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.sendOtp(email);
      setTokens({ ...tokens, ticket: res.data.ticket_token });
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Email không tồn tại trong hệ thống.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ ticket_token: tokens.ticket, otp });
      setTokens({ ...tokens, reset: res.data.reset_access_token });
      setStep(3);
      setError('');
    } catch (err) {
      setError('Mã xác nhận không hợp lệ. Vui lòng thử lại.');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.finalizeReset({ reset_access_token: tokens.reset, newPassword });
      navigate('/login', { state: { message: 'Mật khẩu đã được cập nhật.' } });
    } catch (err) {
      setError('Phiên làm việc đã hết hạn.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-20 px-6 font-sans text-[#111]">
      <div className="max-w-[440px] w-full">
        {/* Logo Nike Style (Tùy chỉnh) */}
        <div className="flex justify-center mb-8">
           <h1 className="text-2xl italic font-black tracking-tighter uppercase">My Brand</h1>
        </div>

        <h2 className="text-[26px] font-medium leading-7 mb-2 text-center uppercase tracking-tight">
          {step === 1 && 'Nhập email của bạn'}
          {step === 2 && 'Kiểm tra hộp thư'}
          {step === 3 && 'Tạo mật khẩu mới'}
        </h2>
        
        <p className="text-gray-500 text-center mb-8 text-[14px]">
          {step === 1 && 'Chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.'}
          {step === 2 && `Mã xác thực đã được gửi đến ${email}`}
          {step === 3 && 'Hãy chọn một mật khẩu mạnh và dễ nhớ.'}
        </p>

        {error && (
          <div className="p-4 mb-6 border-l-4 border-red-600 bg-red-50">
            <p className="text-xs font-bold text-red-700 uppercase">{error}</p>
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                placeholder="Địa chỉ Email"
                className="w-full px-4 py-4 transition-all border border-gray-300 rounded-md outline-none focus:border-black placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <p className="text-[12px] text-gray-500 leading-tight">
              Bằng cách tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của chúng tôi.
            </p>
            <button
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-full font-bold uppercase text-[15px] hover:bg-[#333] transition duration-300 disabled:bg-gray-400"
            >
              {loading ? 'Đang gửi...' : 'Tiếp tục'}
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <input
              type="text"
              placeholder="Mã xác thực 6 số"
              maxLength={6}
              className="w-full py-4 px-4 border border-gray-300 rounded-md focus:border-black outline-none text-center text-2xl font-bold tracking-[0.5em]"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button className="w-full bg-black text-white py-4 rounded-full font-bold uppercase text-[15px] hover:bg-[#333] transition">
              Xác nhận mã
            </button>
            <button 
               type="button"
               onClick={() => setStep(1)} 
               className="w-full text-sm font-medium text-center underline"
            >
              Thay đổi email
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="w-full px-4 py-4 border border-gray-300 rounded-md outline-none focus:border-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button className="w-full bg-black text-white py-4 rounded-full font-bold uppercase text-[15px] hover:bg-[#333] transition">
              Cập nhật mật khẩu
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
          <Link to="/login" className="text-sm font-bold tracking-widest underline uppercase hover:text-gray-600">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
