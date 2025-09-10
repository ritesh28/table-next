import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';
import '@/globals.css';
import { useApollo } from '@/lib/apollo';
import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState || {});

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <ModeToggle />
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
        <Toaster richColors position='top-right' />
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default MyApp;
