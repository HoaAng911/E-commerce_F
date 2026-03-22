import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Copy, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import mediaService from '../../../api/media.service';

const AdminMediaPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Vui lòng chọn một tập tin hình ảnh hợp lệ.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Kích thước ảnh không được vượt quá 5MB.');
      return;
    }

    setFile(selectedFile);
    setUploadedImageUrl('');
    
    // Tạo preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Chưa có ảnh nào được chọn.');
      return;
    }

    try {
      setIsUploading(true);
      const data = await mediaService.uploadImage(file);
      
      setUploadedImageUrl(data.url);
      toast.success('Upload ảnh thành công!');
      
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi upload ảnh.';
      toast.error(typeof errorMessage === 'string' ? errorMessage : (Array.isArray(errorMessage) ? errorMessage[0] : 'Lỗi không xác định'));
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setUploadedImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = () => {
    if (uploadedImageUrl) {
      navigator.clipboard.writeText(uploadedImageUrl);
      toast.success('Đã sao chép link ảnh vào Clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
          Quản lý Media
        </h2>
        <p className="mt-1 text-sm font-bold tracking-widest text-gray-500 uppercase">
          Tải ảnh lên Cloudinary để nhúng vào bài viết hoặc sản phẩm
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upload Area */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="mb-4 text-xs font-bold tracking-widest text-gray-900 uppercase">Tải Lên Ảnh Mới</h3>
          
          <div 
            className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-black bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Input Hidden */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!preview ? (
              <div className="flex flex-col items-center text-center">
                <div className="p-4 mb-4 bg-white rounded-full shadow-sm">
                  <UploadCloud className="w-8 h-8 text-gray-600" />
                </div>
                <p className="mb-2 text-sm font-medium text-gray-900">
                  Kéo thả file ảnh vào đây, hoặc <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 hover:underline focus:outline-none">tìm trên máy</button>
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">PNG, JPG, WEBP, GIF, AVIF tối đa 5MB</p>
              </div>
            ) : (
              <div className="relative w-full">
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button 
                    onClick={clearSelection}
                    className="p-1.5 text-white bg-black/50 hover:bg-red-500 transition-colors rounded-full backdrop-blur-sm"
                    title="Hủy"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="aspect-video w-full overflow-hidden bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                  <img src={preview} alt="Preview" className="object-contain w-full h-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={clearSelection}
                    disabled={isUploading}
                    className="py-2.5 px-4 text-xs font-bold tracking-widest text-gray-700 uppercase transition-colors bg-white border-2 border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Chọn Lại
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !file || uploadedImageUrl}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold tracking-widest text-white uppercase transition-colors bg-black border-2 border-black rounded-sm hover:bg-gray-900 disabled:opacity-50 disabled:bg-gray-400 disabled:border-gray-400"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <UploadCloud size={16} /> Tải lên Cloudinary
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Area */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="mb-4 text-xs font-bold tracking-widest text-gray-900 uppercase">Kết Quả Upload</h3>
          
          {uploadedImageUrl ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 text-green-800 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-green-600" />
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">Thành Công</h4>
                  <p className="mt-1 text-sm">Ảnh của bạn đã được lưu trữ an toàn trên Cloudinary.</p>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-xs font-bold tracking-widest text-gray-700 uppercase">URL Hình Ảnh</label>
                <div className="flex bg-gray-50 border border-gray-300 rounded-sm overflow-hidden focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-all">
                  <div className="flex items-center justify-center px-4 bg-gray-100 border-r border-gray-300">
                    <ImageIcon size={16} className="text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    readOnly 
                    value={uploadedImageUrl} 
                    className="flex-1 px-3 py-2.5 text-sm truncate bg-transparent outline-none font-mono"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-black hover:bg-gray-800"
                  >
                    <Copy size={16} /> Copy
                  </button>
                </div>
              </div>
              
              <div className="flex justify-start">
                <a 
                  href={uploadedImageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 group"
                >
                  Mở ảnh ở tab mới 
                  <ExternalLink size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center p-8 h-[300px] border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                <div className="p-4 mb-4 bg-white rounded-full shadow-sm">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-center text-gray-500 max-w-[250px]">
                  Link ảnh sẽ xuất hiện tại đây sau khi bạn tải hình lên thành công.
                </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMediaPage;
