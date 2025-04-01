import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getCart, addToCart, removeFromCart, updateCart, clearCart } from '../services/cartService';

// 創建購物車上下文
const CartContext = createContext();

// 本地購物車的 localStorage key
const LOCAL_CART_KEY = 'local_cart_data';

// 購物車提供者組件
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 檢查用戶是否已登入
  const checkAuthentication = () => {
    const token = localStorage.getItem('jwt_token');
    setIsAuthenticated(!!token);
    return !!token;
  };

  // 獲取本地購物車數據
  const getLocalCart = () => {
    try {
      const localCartData = localStorage.getItem(LOCAL_CART_KEY);
      return localCartData ? JSON.parse(localCartData) : { items: [], total: 0 };
    } catch (error) {
      console.error('獲取本地購物車失敗:', error);
      return { items: [], total: 0 };
    }
  };

  // 保存本地購物車數據
  const saveLocalCart = (cartData) => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error('保存本地購物車失敗:', error);
    }
  };

  // 計算購物車總金額
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  };

  // 初始化購物車 - 在組件掛載時獲取購物車數據
  useEffect(() => {
    const initializeCart = async () => {
      // 檢查是否已登入
      const isLoggedIn = checkAuthentication();
      
      if (isLoggedIn) {
        // 已登入，從後端獲取購物車
        try {
          setLoading(true);
          const cartData = await getCart();
          setCart(cartData);
          setError(null);
          
          // 檢查是否有本地購物車數據需要合併
          const localCart = getLocalCart();
          if (localCart.items.length > 0) {
            // 有本地數據，合併到後端購物車
            await mergeLocalCartWithRemote(localCart);
            // 清空本地購物車
            localStorage.removeItem(LOCAL_CART_KEY);
          }
        } catch (err) {
          console.error('初始化購物車失敗:', err);
          setError(err.message);
          // 如果是授權錯誤，不顯示錯誤提示
          if (!err.message.includes('未授權')) {
            toast.error(`獲取購物車失敗: ${err.message}`);
          }
          
          // 如果後端獲取失敗，使用本地購物車
          const localCart = getLocalCart();
          setCart(localCart);
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      } else {
        // 未登入，使用本地購物車
        const localCart = getLocalCart();
        setCart(localCart);
        setInitialized(true);
      }
    };

    initializeCart();
  }, []);

  // 監聽 localStorage 中令牌的變化
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'jwt_token') {
        // 如果令牌被添加或更改，重新獲取購物車
        if (e.newValue) {
          setIsAuthenticated(true);
          refreshCart();
        } else {
          // 如果令牌被移除，使用本地購物車
          setIsAuthenticated(false);
          const localCart = getLocalCart();
          setCart(localCart);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 合併本地購物車到遠程購物車
  const mergeLocalCartWithRemote = async (localCart) => {
    try {
      // 構建合併後的購物車項目
      const mergedItems = [...cart.items];
      
      // 遍歷本地購物車項目
      for (const localItem of localCart.items) {
        // 檢查遠程購物車是否已有該商品
        const existingItemIndex = mergedItems.findIndex(item => item.product_id === localItem.product_id);
        
        if (existingItemIndex >= 0) {
          // 已存在，增加數量
          mergedItems[existingItemIndex].quantity += localItem.quantity;
        } else {
          // 不存在，添加新項目
          mergedItems.push({
            product_id: localItem.product_id,
            quantity: localItem.quantity
          });
        }
      }
      
      // 更新遠程購物車
      if (mergedItems.length > 0) {
        const updatedCart = await updateCart(mergedItems);
        setCart(updatedCart);
        toast.success('本地購物車已合併到您的帳戶');
      }
    } catch (error) {
      console.error('合併購物車失敗:', error);
      toast.error('合併購物車失敗，請稍後再試');
    }
  };

  // 刷新購物車
  const refreshCart = async () => {
    const isLoggedIn = checkAuthentication();
    if (!isLoggedIn) {
      const localCart = getLocalCart();
      setCart(localCart);
      return;
    }

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
      
      const isLoggedIn = checkAuthentication();
      
      if (isLoggedIn) {
        // 已登入，使用後端 API
        const updatedCart = await addToCart(productId, quantity);
        setCart(updatedCart);
      } else {
        // 未登入，使用本地存儲
        const localCart = getLocalCart();
        const existingItemIndex = localCart.items.findIndex(item => item.product_id === productId);
        
        if (existingItemIndex >= 0) {
          // 更新現有項目數量
          localCart.items[existingItemIndex].quantity += quantity;
        } else {
          // 添加新項目
          // 需要獲取商品詳情
          try {
            const response = await fetch(`https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/products?id=${productId}`);
            if (response.ok) {
              const productData = await response.json();
              const product = Array.isArray(productData) ? productData[0] : productData;
              
              localCart.items.push({
                product_id: productId,
                quantity: quantity,
                name: product.name,
                price: product.price,
                image_url: product.image_url
              });
            } else {
              throw new Error('獲取商品信息失敗');
            }
          } catch (error) {
            console.error('獲取商品信息失敗:', error);
            // 即使無法獲取商品詳情，仍添加基本信息
            localCart.items.push({
              product_id: productId,
              quantity: quantity
            });
          }
        }
        
        // 更新總金額
        localCart.total = calculateTotal(localCart.items);
        
        // 保存到本地存儲
        saveLocalCart(localCart);
        setCart(localCart);
      }
      
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
      
      const isLoggedIn = checkAuthentication();
      
      if (isLoggedIn) {
        // 已登入，使用後端 API
        const updatedCart = await removeFromCart(productId, quantity);
        setCart(updatedCart);
      } else {
        // 未登入，使用本地存儲
        const localCart = getLocalCart();
        const existingItemIndex = localCart.items.findIndex(item => item.product_id === productId);
        
        if (existingItemIndex >= 0) {
          if (quantity <= 0 || localCart.items[existingItemIndex].quantity <= quantity) {
            // 完全移除項目
            localCart.items.splice(existingItemIndex, 1);
          } else {
            // 減少數量
            localCart.items[existingItemIndex].quantity -= quantity;
          }
          
          // 更新總金額
          localCart.total = calculateTotal(localCart.items);
          
          // 保存到本地存儲
          saveLocalCart(localCart);
          setCart(localCart);
        }
      }
      
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
      
      const isLoggedIn = checkAuthentication();
      
      if (isLoggedIn) {
        // 已登入，使用後端 API
        // 構建購物車項目數組
        const items = cart.items.map(item => {
          if (item.product_id === productId) {
            return { product_id: productId, quantity };
          }
          return { product_id: item.product_id, quantity: item.quantity };
        });
        
        const updatedCart = await updateCart(items);
        setCart(updatedCart);
      } else {
        // 未登入，使用本地存儲
        const localCart = getLocalCart();
        const existingItemIndex = localCart.items.findIndex(item => item.product_id === productId);
        
        if (existingItemIndex >= 0) {
          // 更新數量
          localCart.items[existingItemIndex].quantity = quantity;
          
          // 更新總金額
          localCart.total = calculateTotal(localCart.items);
          
          // 保存到本地存儲
          saveLocalCart(localCart);
          setCart(localCart);
        }
      }
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
      
      const isLoggedIn = checkAuthentication();
      
      if (isLoggedIn) {
        // 已登入，使用後端 API
        const emptyCart = await clearCart();
        setCart(emptyCart);
      } else {
        // 未登入，使用本地存儲
        const emptyCart = { items: [], total: 0 };
        saveLocalCart(emptyCart);
        setCart(emptyCart);
      }
      
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
    isAuthenticated,
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
