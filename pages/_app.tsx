import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { validateConfig } from '../config/api';
import { AppProvider } from '../context/AppContext';
import '../globals.css';

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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
