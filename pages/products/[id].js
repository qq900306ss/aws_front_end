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

// 模擬產品資料
const mockProducts = {
  '1': {
    id: '1',
    name: '新鮮蚵仔',
    price: 299,
    description: '來自台灣東部的優質蚵仔，鮮美多汁，適合各種料理方式。每包約500公克，可供2-3人食用。我們的蚵仔採用最嚴格的品質控管，從養殖到包裝都經過專業處理，確保新鮮度和衛生安全。',
    longDescription: `
      # 產品特色
      
      - 台灣東部養殖，品質保證
      - 肉質飽滿，鮮甜可口
      - 富含蛋白質和多種礦物質
      - 真空包裝，保持新鮮
      
      # 食用方式
      
      蚵仔可以有多種料理方式，包括：
      
      1. **蚵仔煎**：台灣傳統小吃，將蚵仔與蛋液、太白粉混合煎製
      2. **蒜蓉蒸蚵**：簡單的蒸煮方式，保留蚵仔原始風味
      3. **蚵仔湯**：加入薑、蒜、蔥等調味，煮成鮮美湯品
      4. **炒蚵仔**：快速翻炒，保持蚵仔鮮嫩口感
      
      # 保存方式
      
      - 冷藏：可保存3-5天
      - 冷凍：可保存1個月
      
      收到商品後請盡快食用，以享受最佳風味。
    `,
    images: [
      'https://images.unsplash.com/photo-1635146037526-e21e379df5b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576790099894-9a474da7a0f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    category: '蚵仔',
    stock: 50,
    rating: 4.8,
    reviews: 24,
    relatedProducts: ['2', '5', '8']
  },
  '2': {
    id: '2',
    name: '極品大蚵',
    price: 499,
    originalPrice: 599,
    discount: true,
    description: '特大號蚵仔，肉質飽滿，鮮甜可口，是高級料理的首選。每包約600公克，個頭比一般蚵仔大約1.5倍，口感更加鮮美。',
    longDescription: `
      # 產品特色
      
      - 特大號蚵仔，個頭約為一般蚵仔的1.5倍
      - 精選優質蚵苗，專業養殖
      - 肉質特別飽滿，風味更加濃郁
      - 適合高級料理或特殊場合使用
      
      # 食用方式
      
      大蚵的料理方式更加多元：
      
      1. **生食**：搭配檸檬汁或特製醬料，享受原始鮮味
      2. **炭烤**：簡單撒上蒜末、蔥花，炭烤後風味絕佳
      3. **清蒸**：保留大蚵的原汁原味
      4. **酥炸**：裹粉酥炸，外酥內嫩
      
      # 保存方式
      
      - 冷藏：可保存2-3天
      - 冷凍：可保存1個月
      
      建議收到後24小時內食用，以確保最佳風味。
    `,
    images: [
      'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1632809199725-61169cd7a0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    category: '蚵仔',
    stock: 30,
    rating: 4.9,
    reviews: 36,
    relatedProducts: ['1', '5', '6']
  }
};

// 獲取所有產品ID列表，用於靜態生成
export async function getStaticPaths() {
  // 在實際應用中，這裡會從API獲取所有產品ID
  const paths = Object.keys(mockProducts).map(id => ({
    params: { id }
  }));
  
  return {
    paths,
    fallback: true // 允許不在paths中的頁面也能被訪問
  };
}

// 獲取特定產品的資料
export async function getStaticProps({ params }) {
  const { id } = params;
  
  // 在實際應用中，這裡會從API獲取產品資料
  const product = mockProducts[id] || null;
  
  if (!product) {
    return {
      notFound: true // 如果產品不存在，返回404頁面
    };
  }
  
  return {
    props: {
      product
    },
    revalidate: 60 // 每60秒重新生成頁面
  };
}

export default function ProductDetail({ product }) {
  const router = useRouter();
  const { id } = router.query;
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // 處理商品不存在的情況
  if (router.isFallback) {
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
  if (!product && !router.isFallback) {
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
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`庫存僅剩 ${product.stock} 件`);
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
      cartAPI.addToCart(product, quantity);
      toast.success(`已加入購物車: ${product.name} x ${quantity}`);
      
      // 觸發自定義事件，通知 Navbar 更新購物車數量
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      toast.error('加入購物車失敗');
      console.error('Error adding to cart:', error);
    }
  };

  // 切換收藏狀態
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      toast.success(`已加入收藏: ${product.name}`);
    } else {
      toast.success(`已移除收藏: ${product.name}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{product.name} -  海鮮專賣</title>
        <meta name="description" content={product.description} />
      </Head>

      <Navbar />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 返回按鈕 */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={16} className="mr-1" />
              返回
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* 商品圖片區 */}
              <div>
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-all duration-300"
                  />
                </div>
                
                {/* 縮圖列表 */}
                <div className="flex space-x-2 mt-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative w-16 h-16 rounded-md overflow-hidden ${
                        activeImage === index ? 'ring-2 ring-blue-500' : 'opacity-70'
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - 圖片 ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 商品資訊區 */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {/* 評分 */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} 評價)
                  </span>
                </div>
                
                {/* 價格 */}
                <div className="mb-6">
                  {product.discount ? (
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-red-600">NT$ {product.price}</span>
                      <span className="ml-2 text-gray-500 line-through">NT$ {product.originalPrice}</span>
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        省下 NT$ {product.originalPrice - product.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">NT$ {product.price}</span>
                  )}
                </div>
                
                {/* 簡短描述 */}
                <p className="text-gray-700 mb-6">{product.description}</p>
                
                {/* 庫存狀態 */}
                <div className="mb-6">
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `庫存: ${product.stock} 件` : '缺貨中'}
                  </span>
                </div>
                
                {/* 數量選擇 */}
                <div className="flex items-center mb-6">
                  <span className="mr-4 text-gray-700">數量:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={decreaseQuantity}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                {/* 按鈕區 */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    加入購物車
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-md border ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* 詳細資訊區 */}
            <div className="border-t border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">商品詳情</h2>
              <div className="prose max-w-none">
                {product.longDescription.split('\n').map((line, index) => (
                  <p key={index} className="mb-4">{line}</p>
                ))}
              </div>
            </div>
          </div>
          
          {/* 相關商品 */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">相關商品</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.relatedProducts.map(relatedId => {
                  const relatedProduct = mockProducts[relatedId];
                  return relatedProduct ? (
                    <div key={relatedId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <Link href={`/products/${relatedId}`}>
                        <div className="relative aspect-square">
                          <Image
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900">{relatedProduct.name}</h3>
                          <p className="text-blue-600 font-bold mt-1">NT$ {relatedProduct.price}</p>
                        </div>
                      </Link>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
