import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { toast } from 'react-hot-toast';

export default function ProductsManagement() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, getToken, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 檢查用戶是否已登入且是管理員
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        toast.error('請先登入');
        router.push('/login');
      } else if (!isAdmin()) {
        toast.error('您沒有管理員權限');
        router.push('/');
      } else {
        setIsAuthorized(true);
        fetchProducts();
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // 獲取所有商品
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('獲取商品列表失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除商品
  const handleDeleteProduct = async (productId) => {
    if (!confirm('確定要刪除這個商品嗎？此操作無法撤銷。')) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success('商品已成功刪除');
      // 重新獲取商品列表
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('刪除商品失敗');
    }
  };

  if (loading || !isAuthorized || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">正在載入...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>商品管理 - 管理員後台 | 海鮮專賣</title>
        <meta name="description" content="海鮮專賣管理員後台 - 商品管理" />
      </Head>

      <Navbar />

      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">商品管理</h1>
              <p className="mt-2 text-sm text-gray-500">
                管理所有海鮮商品，包括新增、編輯和刪除。
              </p>
            </div>
            <Link href="/admin/products/add" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              新增商品
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <li key={product.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {product.image_url && (
                            <div className="flex-shrink-0 h-16 w-16 mr-4">
                              <img 
                                className="h-16 w-16 rounded-md object-cover" 
                                src={product.image_url} 
                                alt={product.name} 
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-lg font-medium text-blue-600 truncate">{product.name}</p>
                            <div className="mt-1 flex items-center">
                              <p className="text-sm text-gray-500">
                                價格: NT$ {product.price}
                              </p>
                              <span className="mx-2 text-gray-300">|</span>
                              <p className="text-sm text-gray-500">
                                庫存: {product.stock} 件
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/admin/products/edit/${product.id}`} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            編輯
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            刪除
                          </button>
                          <Link href={`/products/${product.id}`} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            查看
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-900">沒有商品</p>
                  <p className="mt-1 text-sm text-gray-500">開始添加您的第一個商品吧！</p>
                  <div className="mt-6">
                    <Link href="/admin/products/add" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      新增商品
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
