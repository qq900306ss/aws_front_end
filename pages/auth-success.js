import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthSuccess() {
  const router = useRouter();
  const { token, userId } = router.query;

  useEffect(() => {
    if (token && userId) {
      // 儲存令牌和用戶 ID
      localStorage.setItem('jwt_token', token);
      
      // 嘗試解析用戶資訊（如果有的話）
      try {
        const userInfo = {
          id: userId,
          // 其他用戶資訊可能需要通過額外的 API 呼叫獲取
        };
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        
        toast.success('登入成功！');
        
        // 重定向到首頁
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (error) {
        console.error('Error saving user info:', error);
        toast.error('登入成功，但無法儲存用戶資訊');
      }
    }
  }, [token, userId, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">登入成功</h1>
          <p className="mt-4 text-lg text-gray-600">正在重定向到首頁...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
