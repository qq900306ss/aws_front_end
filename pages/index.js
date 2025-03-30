import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取商品數據
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        console.log('Fetched products:', products);
        
        // 只顯示前4個商品作為精選商品
        setFeaturedProducts(products.slice(0, 4));
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('無法載入商品，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>海鮮專賣 - 優質蚵仔與海鮮</title>
        <meta name="description" content=" 海鮮專賣店，提供最新鮮的蚵仔和各種海鮮產品，直送到您家" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow">
        {/* 英雄區塊 */}
        <div className="relative h-[70vh] bg-blue-900">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1579275542618-a1dfed5f54ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
              alt="新鮮海鮮"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
            <div className="absolute inset-0 bg-blue-900/60" />
          </div>
          
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              最新鮮的<span className="text-blue-300">海鮮</span>，直送到您家
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            海鮮專賣 專注於提供最優質的蚵仔和各種海鮮，從海洋到餐桌，保證新鮮美味。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                立即選購
              </Link>
              <Link href="/about" className="px-8 py-3 bg-white text-blue-900 font-medium rounded-md hover:bg-blue-50 transition-colors">
                了解更多
              </Link>
            </div>
          </div>
        </div>

        {/* 精選商品區塊 */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">精選海鮮商品</h2>
              <p className="mt-4 text-xl text-gray-600">我們嚴選最優質的海鮮，讓您在家也能享受海洋的鮮美</p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">暫無商品</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Link href="/products" className="inline-block px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors">
                查看所有商品
              </Link>
            </div>
          </div>
        </div>

        {/* 特色區塊 */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">為什麼選擇我們</h2>
              <p className="mt-4 text-xl text-gray-600">我們致力於提供最優質的海鮮產品和服務</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">新鮮保證</h3>
                <p className="text-gray-600">我們的海鮮每日直送，保證新鮮度和品質。</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">快速配送</h3>
                <p className="text-gray-600">下單後24小時內送達，確保海鮮的最佳風味。</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">安全付款</h3>
                <p className="text-gray-600">多種付款方式，安全便捷，讓您購物無憂。</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
