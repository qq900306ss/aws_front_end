import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { cartAPI } from '../lib/api';

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // 載入購物車資料
  useEffect(() => {
    try {
      const cartData = cartAPI.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('載入購物車失敗');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 更新商品數量
  const updateQuantity = (productId, quantity) => {
    try {
      const updatedCart = cartAPI.updateCartItem(productId, quantity);
      setCart(updatedCart);
      toast.success('購物車已更新');
      
      // 觸發自定義事件，通知 Navbar 更新購物車數量
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('更新購物車失敗');
    }
  };

  // 移除商品
  const removeItem = (productId) => {
    try {
      const updatedCart = cartAPI.updateCartItem(productId, 0);
      setCart(updatedCart);
      toast.success('商品已從購物車移除');
      
      // 觸發自定義事件，通知 Navbar 更新購物車數量
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('移除商品失敗');
    }
  };

  // 清空購物車
  const clearCart = () => {
    try {
      const emptyCart = cartAPI.clearCart();
      setCart(emptyCart);
      toast.success('購物車已清空');
      
      // 觸發自定義事件，通知 Navbar 更新購物車數量
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('清空購物車失敗');
    }
  };

  // 計算運費 (示範用，實際應根據業務邏輯調整)
  const calculateShipping = () => {
    return cart.total >= 1000 ? 0 : 100;
  };

  // 計算總金額
  const calculateTotal = () => {
    const shipping = calculateShipping();
    return cart.total + shipping;
  };

  // 處理結帳
  const handleCheckout = () => {
    // 這裡應該導向結帳頁面或處理結帳邏輯
    toast.success('正在前往結帳頁面...');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>購物車 - 海鮮專賣</title>
        <meta name="description" content="查看您的購物車內容並進行結帳" />
      </Head>

      <Navbar />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">購物車</h1>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <ShoppingBag size={96} strokeWidth={1} />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">您的購物車是空的</h3>
              <p className="mt-2 text-sm text-gray-500">
                看起來您還沒有將任何商品加入購物車。
              </p>
              <div className="mt-6">
                <Link href="/products" className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                  繼續購物
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* 購物車商品列表 */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={item.id} className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row">
                          {/* 商品圖片 */}
                          <div className="flex-shrink-0 relative h-24 w-24 rounded-md overflow-hidden">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">無圖片</span>
                              </div>
                            )}
                          </div>

                          {/* 商品資訊 */}
                          <div className="flex-1 ml-0 sm:ml-6 mt-4 sm:mt-0">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  <Link href={`/products/${item.id}`} className="hover:text-blue-600">
                                    {item.name}
                                  </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">單價: NT$ {item.price}</p>
                              </div>
                              <p className="text-base font-medium text-gray-900">
                                NT$ {item.price * item.quantity}
                              </p>
                            </div>

                            {/* 數量控制和刪除按鈕 */}
                            <div className="mt-4 flex justify-between items-center">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 text-gray-600 hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 text-gray-600 hover:bg-gray-100"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* 購物車操作按鈕 */}
                  <div className="border-t border-gray-200 p-4 sm:p-6 flex justify-between">
                    <Link href="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <ArrowRight size={16} className="mr-1 rotate-180" />
                      繼續購物
                    </Link>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" />
                      清空購物車
                    </button>
                  </div>
                </div>
              </div>

              {/* 訂單摘要 */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">訂單摘要</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-gray-600">小計</p>
                      <p className="text-gray-900">NT$ {cart.total}</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="text-gray-600">運費</p>
                      <p className="text-gray-900">
                        {calculateShipping() === 0 ? '免運費' : `NT$ ${calculateShipping()}`}
                      </p>
                    </div>
                    
                    {calculateShipping() > 0 && (
                      <div className="text-sm text-gray-500 bg-blue-50 p-2 rounded">
                        消費滿 NT$ 1,000 即可享有免運費優惠
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
                      <p className="text-gray-900">總計</p>
                      <p className="text-blue-600">NT$ {calculateTotal()}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    前往結帳
                  </button>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    <p>結帳即表示您同意我們的</p>
                    <div className="flex space-x-1 mt-1">
                      <Link href="/terms" className="text-blue-600 hover:underline">服務條款</Link>
                      <span>和</span>
                      <Link href="/privacy" className="text-blue-600 hover:underline">隱私權政策</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
