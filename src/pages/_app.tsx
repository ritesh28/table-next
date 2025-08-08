import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/theme-toggle';
import '@/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <ModeToggle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
