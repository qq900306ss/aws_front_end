import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { cart, loading, error, removeItem, updateItemQuantity, clearAllItems, initialized } = useCart();

  // 增加商品數量
  const increaseQuantity = (productId, currentQuantity) => {
    updateItemQuantity(productId, currentQuantity + 1);
  };

  // 減少商品數量
  const decreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateItemQuantity(productId, currentQuantity - 1);
    } else {
      removeItem(productId);
    }
  };

  // 清空購物車
  const handleClearCart = () => {
    if (window.confirm('確定要清空購物車嗎？')) {
      clearAllItems();
    }
  };

  // 計算總金額
  const totalAmount = cart.total || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>購物車 - 海鮮專賣</title>
        <meta name="description" content="查看您的購物車並結帳" />
      </Head>

      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">購物車</h1>

          {loading && !initialized ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">載入購物車中...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">載入購物車時發生錯誤</p>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                重新整理
              </button>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-gray-400 mb-4">
                <ShoppingBag className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">您的購物車是空的</p>
              <Link href="/products" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                繼續購物
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={item.product_id} className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                            <div className="relative h-full w-full rounded-md overflow-hidden bg-gray-200">
                              <img
                                src={item.image_url || '/images/placeholder.jpg'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/images/placeholder.jpg';
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  <Link href={`/products/${item.product_id}`} className="hover:text-blue-600">
                                    {item.name}
                                  </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                {item.category && (
                                  <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                              <div className="mt-4 sm:mt-0 text-right">
                                <p className="text-lg font-medium text-gray-900">NT${item.price}</p>
                                <p className="text-sm text-gray-500">小計: NT${item.subtotal}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <div className="flex items-center">
                                <button
                                  className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  onClick={() => decreaseQuantity(item.product_id, item.quantity)}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="mx-3 text-gray-700">{item.quantity}</span>
                                <button
                                  className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  onClick={() => increaseQuantity(item.product_id, item.quantity)}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <button
                                className="mt-4 sm:mt-0 flex items-center text-red-600 hover:text-red-800"
                                onClick={() => removeItem(item.product_id)}
                              >
                                <Trash2 size={16} className="mr-1" />
                                <span>移除</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 sm:p-6 border-t border-gray-200">
                    <button
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                      onClick={handleClearCart}
                    >
                      <Trash2 size={16} className="mr-1" />
                      清空購物車
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">訂單摘要</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-gray-600">小計</p>
                      <p className="text-gray-900 font-medium">NT${totalAmount}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">運費</p>
                      <p className="text-gray-900 font-medium">免費</p>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <p className="text-gray-900 font-medium">總計</p>
                      <p className="text-gray-900 font-bold">NT${totalAmount}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                      前往結帳
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                  <div className="mt-4">
                    <Link href="/products" className="block text-center text-blue-600 hover:text-blue-800 text-sm">
                      繼續購物
                    </Link>
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
