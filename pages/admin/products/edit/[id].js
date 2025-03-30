import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import ImageUploader from '../../../../components/ImageUploader';
import { useAuth } from '../../../../lib/auth';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, isAdmin, getToken, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    discount: false,
    description: '',
    category: '',
    stock: '',
    images: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 檢查用戶是否已登入且是管理員
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        toast.error('請先登入');
        router.push('/login');
      } else if (!isAdmin()) {
        toast.error('您沒有管理員權限');
        router.push('/');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // 獲取商品詳情
  useEffect(() => {
    if (id && isAuthorized) {
      fetchProductDetails();
    }
  }, [id, isAuthorized]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      
      const product = await response.json();
      
      // 將API返回的數據轉換為表單數據格式
      setFormData({
        name: product.name || '',
        price: product.price ? product.price.toString() : '',
        originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
        discount: !!product.originalPrice,
        description: product.description || '',
        category: product.category || '蚵仔',
        stock: product.stock ? product.stock.toString() : '50',
        images: product.image_url ? [product.image_url] : []
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('獲取商品詳情失敗');
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  // 處理表單輸入變更
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 處理圖片上傳
  const handleImageUpload = (imageUrl) => {
    setFormData({
      ...formData,
      images: [...formData.images, imageUrl]
    });
  };

  // 移除已上傳的圖片
  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表單驗證
    if (!formData.name.trim()) {
      toast.error('請輸入商品名稱');
      return;
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      toast.error('請輸入有效的商品價格');
      return;
    }
    
    if (formData.discount && (!formData.originalPrice || isNaN(Number(formData.originalPrice)) || Number(formData.originalPrice) <= Number(formData.price))) {
      toast.error('特價商品的原價必須大於現價');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('請輸入商品描述');
      return;
    }
    
    if (formData.images.length === 0) {
      toast.error('請至少上傳一張商品圖片');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = getToken();
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image_url: formData.images[0], // API 只支持一張圖片
        description: formData.description,
        category: formData.category
      };
      
      // 如果是特價商品，添加原價
      if (formData.discount) {
        productData.originalPrice = Number(formData.originalPrice);
      }
      
      const response = await fetch(`https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      toast.success('商品更新成功！');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('更新商品失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthorized || isLoading) {
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
        <title>編輯商品 - 管理員後台 | 海鮮專賣</title>
      </Head>

      <Navbar />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">編輯商品</h1>
            <p className="mt-1 text-sm text-gray-500">編輯商品信息</p>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* 基本資訊 */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2">基本資訊</h2>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        商品名稱 <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        商品分類
                      </label>
                      <div className="mt-1">
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="蚵仔">蚵仔</option>
                          <option value="蝦類">蝦類</option>
                          <option value="螃蟹">螃蟹</option>
                          <option value="龍蝦">龍蝦</option>
                          <option value="魚類">魚類</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        售價 (NT$) <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="price"
                          id="price"
                          min="0"
                          value={formData.price}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center h-full mt-6">
                        <input
                          id="discount"
                          name="discount"
                          type="checkbox"
                          checked={formData.discount}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="discount" className="ml-2 block text-sm text-gray-700">
                          特價商品
                        </label>
                      </div>
                    </div>

                    {formData.discount && (
                      <div className="sm:col-span-2">
                        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                          原價 (NT$) <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="originalPrice"
                            id="originalPrice"
                            min="0"
                            value={formData.originalPrice}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        庫存數量
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="stock"
                          id="stock"
                          min="0"
                          value={formData.stock}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        商品描述 <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 商品圖片 */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2">商品圖片</h2>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      上傳圖片 <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex flex-wrap gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="h-32 w-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      
                      {formData.images.length < 5 && (
                        <ImageUploader onImageUpload={handleImageUpload} />
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      上傳商品圖片，最多 5 張。建議尺寸 1000x1000 像素，格式為 JPG 或 PNG。
                    </p>
                  </div>
                </div>

                {/* 提交按鈕 */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/products')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? '更新中...' : '更新商品'}
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
