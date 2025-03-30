import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../lib/auth';

export default function NewProduct() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, getToken, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    discount: false,
    description: '',
    category: '蚵仔',
    stock: '50',
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 檢查用戶是否已登入且是管理員
  useEffect(() => {
    if (!loading) {
      console.log('Auth state:', { isAuthenticated: isAuthenticated(), isAdmin: isAdmin() });
      
      if (!isAuthenticated()) {
        toast.error('請先登入');
        router.push('/login');
        return;
      } 
      
      if (!isAdmin()) {
        toast.error('您沒有管理員權限');
        router.push('/');
        return;
      }
      
      // 用戶已登入且是管理員
      setIsAuthorized(true);
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // 處理表單輸入變更
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('請填寫必填欄位');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 準備要發送的數據
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image_url: formData.image_url,
        description: formData.description,
        category: formData.category
      };
      
      // 如果是特價商品，添加原價
      if (formData.discount && formData.originalPrice) {
        productData.originalPrice = Number(formData.originalPrice);
      }
      
      const token = getToken();
      const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      toast.success('商品新增成功！');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('新增商品失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 顯示加載中狀態
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">正在載入...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>新增商品 - 管理員後台 | 海鮮專賣</title>
        <meta name="description" content="海鮮專賣管理員後台 - 新增商品" />
      </Head>

      <Navbar />

      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">新增商品</h1>
            <p className="mt-2 text-sm text-gray-500">
              添加新的海鮮商品到您的商店。
            </p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* 商品名稱 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    商品名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                {/* 商品價格 */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      售價 (NT$) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      step="1"
                      value={formData.price}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                      庫存數量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      id="stock"
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* 特價設定 */}
                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="discount"
                      id="discount"
                      checked={formData.discount}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="discount" className="ml-2 block text-sm text-gray-700">
                      此商品為特價商品
                    </label>
                  </div>
                  
                  {formData.discount && (
                    <div className="mt-3">
                      <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                        原價 (NT$)
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        id="originalPrice"
                        min="0"
                        step="1"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* 商品分類 */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    商品分類
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="蚵仔">蚵仔</option>
                    <option value="蝦子">蝦子</option>
                    <option value="魚類">魚類</option>
                    <option value="螃蟹">螃蟹</option>
                    <option value="貝類">貝類</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                {/* 商品圖片 URL */}
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                    商品圖片 URL
                  </label>
                  <input
                    type="text"
                    name="image_url"
                    id="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">預覽圖片:</p>
                      <img 
                        src={formData.image_url} 
                        alt="商品預覽" 
                        className="h-40 w-40 object-cover rounded-md border border-gray-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=圖片載入失敗";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* 商品描述 */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    商品描述
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>

                {/* 提交按鈕 */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/products')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? '處理中...' : '新增商品'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
