import { useState } from 'react';

export default function ImageUploader({ onImageUpload }) {
  const [imageUrl, setImageUrl] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 處理圖片 URL 輸入
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setError(null);
  };

  // 處理圖片預覽
  const handlePreview = (e) => {
    e.preventDefault();
    
    if (!imageUrl.trim()) {
      setError('請輸入圖片 URL');
      return;
    }
    
    // 檢查 URL 格式
    try {
      new URL(imageUrl);
      setIsPreviewVisible(true);
      setError(null);
    } catch (error) {
      setError('請輸入有效的 URL');
    }
  };

  // 處理圖片加載錯誤
  const handleImageError = () => {
    setError('無法加載圖片，請檢查 URL 是否正確');
    setIsLoading(false);
  };

  // 處理圖片加載成功
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // 處理確認添加圖片
  const handleAddImage = () => {
    if (imageUrl.trim() && !error) {
      onImageUpload(imageUrl);
      setImageUrl('');
      setIsPreviewVisible(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          圖片 URL
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            value={imageUrl}
            onChange={handleUrlChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            onClick={handlePreview}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            預覽
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {isPreviewVisible && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">圖片預覽</h4>
          <div className="mt-1 relative border rounded-md p-2 h-48 flex items-center justify-center bg-gray-50">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: error ? 'none' : 'block' }}
            />
            {error && (
              <div className="text-red-500 text-center">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="mt-2">{error}</p>
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setIsPreviewVisible(false)}
              className="mr-3 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleAddImage}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={!!error}
            >
              添加圖片
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
