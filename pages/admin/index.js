import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 檢查用戶是否已登入且是管理員
  useEffect(() => {
    // 確保 auth 狀態已加載完成
    if (!loading) {
      console.log('Auth state:', { isAuthenticated: isAuthenticated(), isAdmin: isAdmin(), user });
      
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
  }, [isAuthenticated, isAdmin, loading, router, user]);

  // 顯示加載中狀態
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">正在加載中...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 顯示驗證權限中狀態
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">正在驗證您的權限...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>管理員後台 | 海鮮專賣</title>
        <meta name="description" content="海鮮專賣管理員後台" />
      </Head>

      <Navbar />

      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">管理員後台</h1>
            <p className="mt-2 text-sm text-gray-500">
              歡迎回來，管理員。您可以在這裡管理商品、訂單和用戶。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 商品管理卡片 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">商品管理</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">管理所有商品</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/products" className="font-medium text-blue-600 hover:text-blue-500">
                    查看所有商品
                  </Link>
                </div>
              </div>
            </div>

            {/* 新增商品卡片 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">新增商品</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">添加新商品</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/products/new" className="font-medium text-green-600 hover:text-green-500">
                    新增商品
                  </Link>
                </div>
              </div>
            </div>

            {/* 訂單管理卡片 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">訂單管理</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">管理所有訂單</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/orders" className="font-medium text-yellow-600 hover:text-yellow-500">
                    查看所有訂單
                  </Link>
                </div>
              </div>
            </div>

            {/* 用戶管理卡片 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">用戶管理</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">管理所有用戶</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/admin/users" className="font-medium text-purple-600 hover:text-purple-500">
                    查看所有用戶
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
