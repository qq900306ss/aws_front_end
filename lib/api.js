import { API } from 'aws-amplify';

// API endpoint name defined in amplify-config.js
const apiName = 'WinsurfAPI';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('winsurf_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Product API functions
export const productAPI = {
  // Get all products
  getProducts: async () => {
    try {
      return await API.get(apiName, '/products', {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  getProduct: async (productId) => {
    try {
      return await API.get(apiName, `/products/${productId}`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  // Admin: Create product
  createProduct: async (productData) => {
    try {
      return await API.post(apiName, '/products', {
        headers: getAuthHeaders(),
        body: productData
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Admin: Update product
  updateProduct: async (productId, productData) => {
    try {
      return await API.put(apiName, `/products/${productId}`, {
        headers: getAuthHeaders(),
        body: productData
      });
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw error;
    }
  },

  // Admin: Delete product
  deleteProduct: async (productId) => {
    try {
      return await API.del(apiName, `/products/${productId}`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      throw error;
    }
  }
};

// Order API functions
export const orderAPI = {
  // Get user orders
  getUserOrders: async () => {
    try {
      return await API.get(apiName, '/orders', {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Get single order
  getOrder: async (orderId) => {
    try {
      return await API.get(apiName, `/orders/${orderId}`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Create order
  createOrder: async (orderData) => {
    try {
      return await API.post(apiName, '/orders', {
        headers: getAuthHeaders(),
        body: orderData
      });
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Admin: Get all orders
  getAllOrders: async () => {
    try {
      return await API.get(apiName, '/admin/orders', {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      return await API.put(apiName, `/admin/orders/${orderId}/status`, {
        headers: getAuthHeaders(),
        body: { status }
      });
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
  }
};

// User API functions
export const userAPI = {
  // Admin: Get all users
  getUsers: async () => {
    try {
      return await API.get(apiName, '/admin/users', {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Admin: Update user role
  updateUserRole: async (userId, role) => {
    try {
      return await API.put(apiName, `/admin/users/${userId}/role`, {
        headers: getAuthHeaders(),
        body: { role }
      });
    } catch (error) {
      console.error(`Error updating user ${userId} role:`, error);
      throw error;
    }
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
          image: product.image,
          quantity
        });
      }
      
      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Save to localStorage
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
      const itemIndex = cart.items.findIndex(item => item.id === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is zero or negative
          cart.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          cart.items[itemIndex].quantity = quantity;
        }
        
        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Save to localStorage
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
      localStorage.setItem('winsurf_cart', JSON.stringify({ items: [], total: 0 }));
      return { items: [], total: 0 };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};
