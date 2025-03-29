import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { cartAPI } from '../lib/api';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // 監聽購物車變化
  useEffect(() => {
    // 初始化購物車數量
    updateCartCount();

    // 設置事件監聽器，當 localStorage 變化時更新購物車數量
    const handleStorageChange = () => {
      updateCartCount();
    };

    // 自定義事件，用於在其他元件中觸發購物車更新
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // 每秒檢查一次購物車數量（作為備用方案）
    const intervalId = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(intervalId);
    };
  }, []);

  // 更新購物車數量
  const updateCartCount = () => {
    try {
      const cart = cartAPI.getCart();
      const count = cart.items.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Winsurf</span>
              <span className="ml-2 text-blue-300">海鮮專賣</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 hover:text-white">
                首頁
              </Link>
              <Link href="/products" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 hover:text-white">
                商品列表
              </Link>
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 hover:text-white">
                關於我們
              </Link>
              {isAdmin() && (
                <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 hover:text-white">
                  管理後台
                </Link>
              )}
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center">
            <Link href="/cart" className="p-2 rounded-full hover:bg-blue-800 relative">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated() ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center">
                      {user?.name?.charAt(0) || <User size={16} />}
                    </div>
                  </button>
                  <div className="ml-2 hidden md:block">
                    <div className="text-sm font-medium">{user?.name || '使用者'}</div>
                    <button 
                      onClick={logout}
                      className="text-xs text-blue-300 hover:text-white"
                    >
                      登出
                    </button>
                  </div>
                </div>
                
                {/* Dropdown menu */}
                {mobileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      個人資料
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      我的訂單
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      登出
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="ml-3 px-4 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-600">
                登入
              </Link>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden ml-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 hover:text-white">
              首頁
            </Link>
            <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 hover:text-white">
              商品列表
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 hover:text-white">
              關於我們
            </Link>
            {isAuthenticated() && (
              <>
                <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 hover:text-white">
                  個人資料
                </Link>
                <Link href="/orders" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 hover:text-white">
                  我的訂單
                </Link>
                {isAdmin() && (
                  <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 hover:text-white">
                    管理後台
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 hover:text-white"
                >
                  登出
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
