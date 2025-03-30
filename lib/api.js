// Direct API integration with the backend
const API_BASE_URL = 'https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('winsurf_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function for making API requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };

  const config = {
    method,
    headers
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request error (${endpoint}):`, error);
    throw error;
  }
};

// Product API functions
export const productAPI = {
  // Get all products
  getProducts: async () => {
    return apiRequest('/products');
  },

  // Get single product by ID
  getProduct: async (productId) => {
    return apiRequest(`/products/${productId}`);
  },

  // Admin: Create product
  createProduct: async (productData) => {
    return apiRequest('/products', 'POST', productData);
  },

  // Admin: Update product
  updateProduct: async (productId, productData) => {
    return apiRequest(`/products/${productId}`, 'PUT', productData);
  },

  // Admin: Delete product
  deleteProduct: async (productId) => {
    return apiRequest(`/products/${productId}`, 'DELETE');
  }
};

// Order API functions
export const orderAPI = {
  // Get user orders
  getUserOrders: async () => {
    return apiRequest('/orders');
  },

  // Get single order
  getOrder: async (orderId) => {
    return apiRequest(`/orders/${orderId}`);
  },

  // Create order
  createOrder: async (orderData) => {
    return apiRequest('/orders', 'POST', orderData);
  },

  // Admin: Get all orders
  getAllOrders: async () => {
    return apiRequest('/admin/orders');
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/admin/orders/${orderId}/status`, 'PUT', { status });
  }
};

// User API functions
export const userAPI = {
  // Admin: Get all users
  getUsers: async () => {
    return apiRequest('/admin/users');
  },

  // Admin: Update user role
  updateUserRole: async (userId, role) => {
    return apiRequest(`/admin/users/${userId}/role`, 'PUT', { role });
  }
};

// Cart functions (local storage based for now)
export const cartAPI = {
  getCart: () => {
    try {
      const cart = localStorage.getItem('winsurf_cart');
      return cart ? JSON.parse(cart) : { items: [], total: 0 };
    } catch (error) {
      console.error('Error getting cart:', error);
      return { items: [], total: 0 };
    }
  },

  addToCart: (product, quantity = 1) => {
    try {
      const cart = cartAPI.getCart();
      const existingItemIndex = cart.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity
        });
      }
      
      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Save to local storage
      localStorage.setItem('winsurf_cart', JSON.stringify(cart));
      
      return cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  updateCartItem: (productId, quantity) => {
    try {
      const cart = cartAPI.getCart();
      const existingItemIndex = cart.items.findIndex(item => item.id === productId);
      
      if (existingItemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          cart.items.splice(existingItemIndex, 1);
        } else {
          // Update quantity
          cart.items[existingItemIndex].quantity = quantity;
        }
        
        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Save to local storage
        localStorage.setItem('winsurf_cart', JSON.stringify(cart));
      }
      
      return cart;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  clearCart: () => {
    try {
      const emptyCart = { items: [], total: 0 };
      localStorage.setItem('winsurf_cart', JSON.stringify(emptyCart));
      return emptyCart;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};
