import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Minus, Plus, ShoppingCart, Heart, ArrowLeft, Star } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { cartAPI } from '../../lib/api';

// 獲取所有產品ID列表，用於靜態生成
export async function getStaticPaths() {
  try {
    // 從API獲取所有產品
    const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products');
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const products = await response.json();
    
    // 生成所有產品的路徑
    const paths = products.map(product => ({
      params: { id: product.id.toString() }
    }));
    
    return {
      paths,
      fallback: true // 允許不在paths中的頁面也能被訪問
    };
  } catch (error) {
    console.error('Error fetching product paths:', error);
    return {
      paths: [],
      fallback: true
    };
  }
}

// 獲取特定產品的資料
export async function getStaticProps({ params }) {
  const { id } = params;
  
  try {
    // 從API獲取特定產品資料 - 不需要授權令牌
    const response = await fetch(`https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products?id=${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const product = await response.json();
    
    // 如果API返回的是數組，取第一個元素
    const productData = Array.isArray(product) ? product[0] : product;
    
    if (!productData) {
      return {
        notFound: true // 如果產品不存在，返回404頁面
      };
    }
    
    return {
      props: {
        product: productData
      },
      revalidate: 60 // 每60秒重新生成頁面
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      notFound: true
    };
  }
}

export default function ProductDetail({ product }) {
  const router = useRouter();
  const { id } = router.query;
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clientProduct, setClientProduct] = useState(null);
  
  // 在客戶端獲取產品數據（如果SSR/SSG失敗）
  useEffect(() => {
    // 如果已經有產品數據，則不需要再次獲取
    if (product || !id || isLoading) return;
    
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        // 不需要授權令牌
        const response = await fetch(`https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products?id=${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        // 如果API返回的是數組，取第一個元素
        const productData = Array.isArray(data) ? data[0] : data;
        
        setClientProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, product, isLoading]);
  
  // 使用SSR/SSG獲取的產品或客戶端獲取的產品
  const productData = product || clientProduct;
  
  // 處理商品不存在的情況
  if (router.isFallback || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">正在載入商品資訊...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // 如果沒有產品資料，可能是直接訪問了不存在的ID
  if (!productData && !router.isFallback && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">商品不存在</h2>
            <p className="text-gray-600 mb-8">抱歉，您所查詢的商品不存在或已被移除。</p>
            <Link href="/products" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              返回商品列表
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 增加數量
  const increaseQuantity = () => {
    if (quantity < (productData.stock || 10)) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`庫存僅剩 ${productData.stock || 10} 件`);
    }
  };

  // 減少數量
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 加入購物車
  const handleAddToCart = () => {
    try {
      cartAPI.addToCart(productData, quantity);
      toast.success(`已加入購物車: ${productData.name} x ${quantity}`);
      
      // 觸發自定義事件，通知 Navbar 更新購物車數量
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      toast.error('加入購物車失敗');
      console.error(error);
    }
  };

  // 切換收藏狀態
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? '已從收藏移除' : '已加入收藏');
  };
  
  // 確保產品有圖片
  const images = productData.images || [productData.image || '/images/placeholder.jpg'];
  // 如果images是字串而非陣列，轉換為陣列
  const imageArray = typeof images === 'string' ? [images] : Array.isArray(images) ? images : ['/images/placeholder.jpg'];

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{productData.name} -  海鮮專賣</title>
        <meta name="description" content={productData.description} />
      </Head>

      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 返回按鈕 */}
          <div className="mb-6">
            <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft size={18} className="mr-1" />
              返回商品列表
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* 商品圖片區 */}
              <div>
                <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={imageArray[activeImage]}
                    alt={productData.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                
                {/* 縮圖列表 */}
                {imageArray.length > 1 && (
                  <div className="flex space-x-2 mt-4">
                    {imageArray.map((img, index) => (
                      <button
                        key={index}
                        className={`relative h-20 w-20 rounded-md overflow-hidden border-2 ${
                          activeImage === index ? 'border-blue-600' : 'border-gray-200'
                        }`}
                        onClick={() => setActiveImage(index)}
                      >
                        <Image
                          src={img}
                          alt={`${productData.name} - 圖片 ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 商品資訊區 */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{productData.name}</h1>
                
                {/* 評分 */}
                {productData.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < Math.floor(productData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {productData.rating} ({productData.reviews || 0} 評價)
                    </span>
                  </div>
                )}
                
                {/* 價格 */}
                <div className="mb-6">
                  {productData.discount && productData.originalPrice ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-red-600">NT$ {productData.price}</span>
                      <span className="ml-2 text-gray-500 line-through">NT$ {productData.originalPrice}</span>
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        {Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">NT$ {productData.price}</span>
                  )}
                </div>
                
                {/* 庫存 */}
                <div className="mb-4">
                  <span className={`text-sm ${(productData.stock || 10) > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                    {(productData.stock || 10) > 0 
                      ? `庫存: ${productData.stock || '有現貨'}` 
                      : '暫時缺貨'}
                  </span>
                </div>
                
                {/* 簡短描述 */}
                <div className="mb-6">
                  <p className="text-gray-700">{productData.description}</p>
                </div>
                
                {/* 數量選擇 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">數量</label>
                  <div className="flex items-center">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val > 0 && val <= (productData.stock || 10)) {
                          setQuantity(val);
                        }
                      }}
                      className="p-2 w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                      max={productData.stock || 10}
                    />
                    <button
                      onClick={increaseQuantity}
                      className="p-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                      disabled={quantity >= (productData.stock || 10)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                
                {/* 操作按鈕 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    disabled={(productData.stock || 10) <= 0}
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    加入購物車
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    className={`px-6 py-3 rounded-md flex items-center justify-center ${
                      isFavorite
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-red-600' : ''} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* 詳細描述 */}
            {productData.longDescription && (
              <div className="border-t border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">商品詳情</h2>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: productData.longDescription.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            )}
            
            {/* 相關商品 */}
            {productData.relatedProducts && productData.relatedProducts.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">相關商品</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* 這裡可以放相關商品 */}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
