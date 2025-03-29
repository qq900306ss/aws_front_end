import { useState, useEffect, createContext, useContext } from 'react';
import { API } from 'aws-amplify';
import jwtDecode from 'jwt-decode';

// Create an auth context for the application
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for token on initial load
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('winsurf_token');
        if (token) {
          // Verify token is not expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp && decoded.exp < currentTime) {
            // Token expired, remove it
            localStorage.removeItem('winsurf_token');
            setUser(null);
          } else {
            // Valid token, get user info
            await getUserInfo(token);
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication error');
        localStorage.removeItem('winsurf_token');
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  // Function to get user info with token
  const getUserInfo = async (token) => {
    try {
      const userInfo = await API.get('WinsurfAPI', '/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(userInfo);
    } catch (err) {
      console.error('Error getting user info:', err);
      setError('Failed to get user information');
      setUser(null);
    }
  };

  // Handle Google OAuth redirect
  const handleGoogleRedirect = async (code) => {
    try {
      setLoading(true);
      // This would normally call your backend to exchange the code for a token
      // For now, we'll simulate this with a mock API call
      const response = await API.post('WinsurfAPI', '/auth/google', {
        body: { code }
      });
      
      if (response && response.token) {
        localStorage.setItem('winsurf_token', response.token);
        await getUserInfo(response.token);
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('winsurf_token');
    setUser(null);
  };

  // Get current auth token
  const getToken = () => {
    return localStorage.getItem('winsurf_token');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
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
        isAdmin
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
