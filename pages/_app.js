import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { Amplify } from 'aws-amplify';
import amplifyConfig from '../lib/amplify-config';
import { AuthProvider } from '../lib/auth';
import { CartProvider } from '../contexts/CartContext';

// Configure Amplify
Amplify.configure(amplifyConfig);

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" />
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
