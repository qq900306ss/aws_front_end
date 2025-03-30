import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const { code } = router.query;
  const { handleGoogleRedirect, isAuthenticated, loading, error } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  // 處理 Google OAuth 回調
  useEffect(() => {
    if (code && !redirecting) {
      setRedirecting(true);
      handleGoogleRedirect(code);
    }
  }, [code, handleGoogleRedirect, redirecting]);

  // 已登入則重定向到首頁
  useEffect(() => {
    if (isAuthenticated() && !loading) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // 顯示錯誤訊息
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // 處理 Google 登入
  const handleGoogleLogin = () => {
    // 重定向到 Google OAuth 頁面
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    // 使用 API 文件中指定的重定向 URI
    const redirectUri = 'https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/oauth/callback';
    
    const params = new URLSearchParams({
      client_id: '970174882826-6mau4p0nl1vha8uqg4h1ofqmembi4jl3.apps.googleusercontent.com',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent',
    });
    
    // 重定向到 Google 登入頁面
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
  };

  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">正在處理您的登入請求...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>登入 - 海鮮專賣</title>
        <meta name="description" content="登入  海鮮專賣網站，享受會員專屬優惠" />
      </Head>

      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">登入您的帳戶</h2>
            <p className="mt-2 text-sm text-gray-600">
              或{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                註冊新帳戶
              </Link>
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
              </span>
              使用 Google 帳戶登入
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或使用電子郵件登入</span>
              </div>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">電子郵件</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="電子郵件"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">密碼</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="密碼"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    記住我
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    忘記密碼?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => toast.error('目前僅支援 Google 登入')}
                >
                  登入
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
