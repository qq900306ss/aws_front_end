import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

// 模擬產品資料
const mockProducts = [
  {
    id: '1',
    name: '新鮮蚵仔',
    price: 299,
    description: '來自台灣東部的優質蚵仔，鮮美多汁，適合各種料理方式。',
    image: 'https://images.unsplash.com/photo-1635146037526-e21e379df5b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '2',
    name: '極品大蚵',
    price: 499,
    originalPrice: 599,
    discount: true,
    description: '特大號蚵仔，肉質飽滿，鮮甜可口，是高級料理的首選。',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '3',
    name: '鮮蝦組合',
    price: 399,
    description: '精選各種新鮮蝦類，包括草蝦、白蝦等，適合多種烹飪方式。',
    image: 'https://images.unsplash.com/photo-1565680018160-64827b3608ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '4',
    name: '鮮活螃蟹',
    price: 599,
    originalPrice: 699,
    discount: true,
    description: '當季捕撈的新鮮螃蟹，肉質鮮美，適合清蒸或其他烹飪方式。',
    image: 'https://images.unsplash.com/photo-1550747545-c896b5f89ff7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }
];

export default function Home() {
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
              Winsurf 專注於提供最優質的蚵仔和各種海鮮，從海洋到餐桌，保證新鮮美味。
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/products" className="inline-block px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                查看更多商品
              </Link>
            </div>
          </div>
        </div>

        {/* 特色區塊 */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">為什麼選擇 Winsurf</h2>
              <p className="mt-4 text-xl text-gray-600">我們致力於提供最優質的服務和產品</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">品質保證</h3>
                <p className="text-gray-600">我們嚴選每一項海鮮產品，確保新鮮度和品質，讓您吃得安心。</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">快速配送</h3>
                <p className="text-gray-600">我們提供快速配送服務，確保海鮮在最佳狀態送達您的手中。</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">安全支付</h3>
                <p className="text-gray-600">多種安全支付方式，讓您購物無後顧之憂。</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
