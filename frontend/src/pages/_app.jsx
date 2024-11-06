/* pages/_app.js */
import React from 'react';
import CustomThemeProvider from '@/components/CustomThemeProvider';
import '../app/globals.css'; // Đảm bảo đường dẫn đúng

function MyApp({ Component, pageProps }) {
  return (
    <CustomThemeProvider>
      <Component {...pageProps} />
    </CustomThemeProvider>
  );
}

export default MyApp;
