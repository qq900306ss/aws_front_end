/**
 * 購物車服務 - 處理與購物車 API 的所有交互
 */

// API 基礎路徑
const API_BASE_URL = 'https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging';

/**
 * 獲取授權標頭
 * @returns {Object} 包含授權令牌的標頭對象
 */
const getAuthHeaders = () => {
  // 使用 'winsurf_token' 作為 localStorage 中存儲 JWT token 的 key
  const token = localStorage.getItem('jwt_token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

/**
 * 處理 API 錯誤
 * @param {Response} response - fetch API 的響應對象
 * @returns {Promise} 解析為錯誤消息的 Promise
 */
const handleApiError = async (response) => {
  try {
    const errorData = await response.json();
    // 如果是 401 錯誤（未授權），清除本地存儲中的令牌
    if (response.status === 401) {
      localStorage.removeItem('jwt_token');
    }
    return errorData.error || `請求失敗 (${response.status})`;
  } catch (error) {
    return `請求失敗 (${response.status})`;
  }
};

/**
 * 獲取當前用戶的購物車
 * @returns {Promise<Object>} 包含購物車數據的 Promise
 */
export const getCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('獲取購物車失敗:', error);
    throw error;
  }
};

/**
 * 添加商品到購物車
 * @param {string} productId - 商品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} 包含更新後的購物車數據的 Promise
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/item`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity
      })
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('添加商品到購物車失敗:', error);
    throw error;
  }
};

/**
 * 從購物車移除商品
 * @param {string} productId - 商品 ID
 * @param {number} quantity - 要減少的數量，如果為0則完全移除
 * @returns {Promise<Object>} 包含更新後的購物車數據的 Promise
 */
export const removeFromCart = async (productId, quantity = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/item`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity
      })
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('從購物車移除商品失敗:', error);
    throw error;
  }
};

/**
 * 更新整個購物車
 * @param {Array} items - 購物車項目數組，每個項目包含 product_id 和 quantity
 * @returns {Promise<Object>} 包含更新後的購物車數據的 Promise
 */
export const updateCart = async (items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items })
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('更新購物車失敗:', error);
    throw error;
  }
};

/**
 * 清空購物車
 * @returns {Promise<Object>} 包含清空後的購物車數據的 Promise
 */
export const clearCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('清空購物車失敗:', error);
    throw error;
  }
};

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  clearCart
};
