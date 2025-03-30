import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>登入失敗 - 海鮮專賣</title>
        <meta name="description" content="登入失敗" />
      </Head>

      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <svg 
              className="mx-auto h-12 w-12 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">登入失敗</h2>
            <p className="mt-2 text-sm text-gray-600">
              {error ? decodeURIComponent(error) : '登入過程中發生錯誤'}
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <Link href="/login">
              <button
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                返回登入頁面
              </button>
            </Link>
            
            <Link href="/">
              <button
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                返回首頁
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
