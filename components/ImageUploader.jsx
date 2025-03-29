import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ImageUploader({ onImageUpload }) {
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // 處理檔案選擇
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      toast.error('請選擇圖片檔案');
      return;
    }

    // 檢查檔案大小 (限制為 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('圖片大小不能超過 5MB');
      return;
    }

    // 創建預覽
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // 模擬上傳過程
    simulateUpload(file);
  };

  // 模擬上傳到雲端 (實際專案中會替換為真實的上傳功能)
  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadSuccess(false);
    
    // 模擬網路延遲
    setTimeout(() => {
      // 模擬成功上傳
      setIsUploading(false);
      setUploadSuccess(true);
      
      // 生成隨機 ID 作為檔案名稱
      const fileName = `product_${Math.random().toString(36).substring(2, 15)}.jpg`;
      
      // 在實際應用中，這裡會是真實的雲端 URL
      const mockCloudUrl = preview;
      
      // 將 URL 傳回給父元件
      if (onImageUpload) {
        onImageUpload(mockCloudUrl);
      }
      
      toast.success('圖片上傳成功！');
    }, 2000);
  };

  // 觸發檔案選擇器
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // 清除已選擇的圖片
  const clearImage = () => {
    setPreview(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          preview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        } transition-colors cursor-pointer`}
        onClick={!preview ? triggerFileInput : undefined}
      >
        {!preview ? (
          <div className="py-8">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">點擊上傳圖片</p>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF 最大 5MB</p>
          </div>
        ) : (
          <div className="relative">
            <div className="relative h-64 w-full overflow-hidden rounded-md">
              <Image 
                src={preview} 
                alt="圖片預覽" 
                fill
                style={{ objectFit: 'contain' }}
                className="transition-opacity"
              />
            </div>
            
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="rounded-full bg-white p-1.5 text-gray-900 shadow-sm hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                  <p className="mt-2 text-sm text-white">上傳中...</p>
                </div>
              </div>
            )}
            
            {uploadSuccess && (
              <div className="absolute bottom-2 right-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                  <Check size={12} className="mr-1" />
                  上傳成功
                </span>
              </div>
            )}
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}
