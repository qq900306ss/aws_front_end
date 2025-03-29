import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ImageUploader from '../../../components/ImageUploader';

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    discount: false,
    description: '',
    category: '蚵仔',
    stock: '50',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const handleSubmit = (e) => {
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
    
    // 模擬提交
    setIsSubmitting(true);
    
    // 在實際應用中，這裡會發送 API 請求
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('商品新增成功！');
      
      // 顯示新增的商品資料
      console.log('新增商品:', {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.discount ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock)
      });
      
      // 重置表單
      setFormData({
        name: '',
        price: '',
        originalPrice: '',
        discount: false,
        description: '',
        category: '蚵仔',
        stock: '50',
        images: []
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>新增商品 - 管理員後台 | Winsurf 海鮮專賣</title>
      </Head>

      <Navbar />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">新增商品</h1>
            <p className="mt-1 text-sm text-gray-500">填寫以下表單來新增海鮮商品</p>
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200">
                          <div className="aspect-square relative">
                            <img
                              src={image}
                              alt={`商品圖片 ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 rounded-full bg-white p-1 text-gray-900 shadow-sm hover:bg-gray-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      
                      {formData.images.length < 5 && (
                        <div className="aspect-square">
                          <ImageUploader onImageUpload={handleImageUpload} />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      最多可上傳 5 張商品圖片。第一張圖片將作為商品主圖。
                    </p>
                  </div>
                </div>

                {/* 提交按鈕 */}
                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          處理中...
                        </>
                      ) : '新增商品'}
                    </button>
                  </div>
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
