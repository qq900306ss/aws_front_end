import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { Amplify } from 'aws-amplify';
import amplifyConfig from '../lib/amplify-config';
import { AuthProvider } from '../lib/auth';

// Configure Amplify
Amplify.configure(amplifyConfig);

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
