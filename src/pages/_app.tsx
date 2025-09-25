import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/globals.css';
import { useApollo } from '@/lib/apollo';
import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState || {});

  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <link rel='icon' type='image/ico' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Tanstack Table Demo</title>
      </Head>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <ApolloProvider client={apolloClient}>
          <div className='sticky top-0'>
            <Navbar />
          </div>
          <Component {...pageProps} />
          <Toaster richColors position='top-right' />
          <footer>
            <div className='justify-self-center mb-4 mt-18'>
              <p className='text-sm leading-none font-medium'>
                Build by{' '}
                <a href={process.env.NEXT_PUBLIC_PORTFOLIO_LINK || '#'} target='_blank' className='underline hover:text-link-hover-foreground'>
                  Ritesh
                </a>
                . Check out my other{' '}
                <a href={process.env.NEXT_PUBLIC_GITHUB_LINK || '#'} target='_blank' className='underline hover:text-link-hover-foreground'>
                  Github Codes
                </a>
                .
              </p>
            </div>
          </footer>
        </ApolloProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
