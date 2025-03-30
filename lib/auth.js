import { useState, useEffect, createContext, useContext } from 'react';
import { API } from 'aws-amplify';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';

// Create an auth context for the application
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check for token on initial load
  useEffect(() => {
    checkToken();
  }, []);

  // 驗證令牌並獲取用戶資訊
  const checkToken = async () => {
    try {
      // 從 localStorage 獲取 JWT 令牌
      const token = localStorage.getItem('jwt_token');
      if (token) {
        // 驗證令牌是否過期
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp < currentTime) {
          // 令牌過期，移除它
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user_info');
          setUser(null);
        } else {
          // 有效令牌，從後端獲取最新用戶資訊
          try {
            const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/user/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              localStorage.setItem('user_info', JSON.stringify(userData));
              setUser(userData);
            } else {
              // 如果 API 請求失敗，嘗試使用本地存儲的用戶資訊
              const userInfo = localStorage.getItem('user_info');
              if (userInfo) {
                setUser(JSON.parse(userInfo));
              }
            }
          } catch (apiError) {
            console.error('Error fetching user profile:', apiError);
            // 如果 API 請求失敗，嘗試使用本地存儲的用戶資訊
            const userInfo = localStorage.getItem('user_info');
            if (userInfo) {
              setUser(JSON.parse(userInfo));
            }
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication error');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth redirect
  const handleGoogleRedirect = async (code) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the OAuth token endpoint with the authorization code
      const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to authenticate with Google');
      }
      
      const data = await response.json();
      
      if (data && data.token) {
        // 將 JWT 令牌存儲在 localStorage 中
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user_info', JSON.stringify(data.user));
        setUser(data.user);
        
        // 觸發一個事件，通知其他元件用戶已登入
        const event = new Event('userLoggedIn');
        window.dispatchEvent(event);
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    setUser(null);
    
    // 觸發一個事件，通知其他元件用戶已登出
    const event = new Event('userLoggedOut');
    window.dispatchEvent(event);
    
    router.push('/');
  };

  // Get current auth token
  const getToken = () => {
    return localStorage.getItem('jwt_token');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.is_admin === true;
  };

  // 重新驗證用戶
  const refreshUser = () => {
    return checkToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        handleGoogleRedirect,
        logout,
        getToken,
        isAuthenticated,
        isAdmin,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
