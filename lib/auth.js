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
            // Valid token, set user from local storage
            const userInfo = localStorage.getItem('winsurf_user');
            if (userInfo) {
              setUser(JSON.parse(userInfo));
            }
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication error');
        localStorage.removeItem('winsurf_token');
        localStorage.removeItem('winsurf_user');
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

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
        localStorage.setItem('winsurf_token', data.token);
        localStorage.setItem('winsurf_user', JSON.stringify(data.user));
        setUser(data.user);
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
    localStorage.removeItem('winsurf_token');
    localStorage.removeItem('winsurf_user');
    setUser(null);
    router.push('/');
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
    return user && user.is_admin === true;
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
