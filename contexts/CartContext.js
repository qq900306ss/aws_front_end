import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getCart, addToCart, removeFromCart, updateCart, clearCart } from '../services/cartService';

// 創建購物車上下文
const CartContext = createContext();

// 購物車提供者組件
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // 初始化購物車 - 在組件掛載時獲取購物車數據
  useEffect(() => {
    const initializeCart = async () => {
      // 檢查是否有令牌，如果沒有則不獲取購物車
      const token = localStorage.getItem('winsurf_token');
      if (!token) {
        setInitialized(true);
        return;
      }

      try {
        setLoading(true);
        const cartData = await getCart();
        setCart(cartData);
        setError(null);
      } catch (err) {
        console.error('初始化購物車失敗:', err);
        setError(err.message);
        // 如果是授權錯誤，不顯示錯誤提示
        if (!err.message.includes('未授權')) {
          toast.error(`獲取購物車失敗: ${err.message}`);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeCart();
  }, []);

  // 監聽 localStorage 中令牌的變化
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'winsurf_token') {
        // 如果令牌被添加或更改，重新獲取購物車
        if (e.newValue) {
          refreshCart();
        } else {
          // 如果令牌被移除，清空購物車
          setCart({ items: [], total: 0 });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 刷新購物車
  const refreshCart = async () => {
    const token = localStorage.getItem('winsurf_token');
    if (!token) return;

    try {
      setLoading(true);
      const cartData = await getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      console.error('刷新購物車失敗:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 添加商品到購物車
  const addItem = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await addToCart(productId, quantity);
      setCart(updatedCart);
      toast.success('商品已添加到購物車');
    } catch (err) {
      setError(err.message);
      toast.error(`添加失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 從購物車移除商品
  const removeItem = async (productId, quantity = 0) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await removeFromCart(productId, quantity);
      setCart(updatedCart);
      toast.success('商品已從購物車移除');
    } catch (err) {
      setError(err.message);
      toast.error(`移除失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 更新購物車中商品的數量
  const updateItemQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      
      // 如果數量為 0，則移除商品
      if (quantity <= 0) {
        await removeItem(productId, 0);
        return;
      }
      
      // 構建購物車項目數組
      const items = cart.items.map(item => {
        if (item.product_id === productId) {
          return { product_id: productId, quantity };
        }
        return { product_id: item.product_id, quantity: item.quantity };
      });
      
      const updatedCart = await updateCart(items);
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
      toast.error(`更新數量失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 清空購物車
  const clearAllItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const emptyCart = await clearCart();
      setCart(emptyCart);
      toast.success('購物車已清空');
    } catch (err) {
      setError(err.message);
      toast.error(`清空購物車失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 獲取購物車中的商品總數
  const getItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // 獲取購物車中特定商品的數量
  const getItemQuantity = (productId) => {
    // 添加對 cart 和 cart.items 的防護檢查
    if (!cart || !cart.items) return 0;
    
    const item = cart.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  // 提供的上下文值
  const value = {
    cart,
    loading,
    error,
    initialized,
    addItem,
    removeItem,
    updateItemQuantity,
    clearAllItems,
    refreshCart,
    getItemCount,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// 自定義鉤子，用於在組件中訪問購物車上下文
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
