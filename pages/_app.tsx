import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { validateConfig } from '../config/api';
import { AppProvider } from '../context/AppContext';
import '../globals.css';
import { AuthProvider } from '../hooks/useAuth';

// Validation de la configuration au démarrage
if (typeof window !== 'undefined') {
  const configValidation = validateConfig();
  if (!configValidation.valid) {
    console.warn('Configuration issues detected:', configValidation.errors);
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </AppProvider>
  );
}
