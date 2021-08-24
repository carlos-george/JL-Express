import type { AppProps } from 'next/app'
import { SnackbarProvider } from 'notistack';

import '../styles/global.scss';
import { Header } from '../components/Header';
import { MenuContextProvider } from '../context/MenuContext';
import { AuthContextProvider } from '../context/AuthContext';


function MyApp({ Component, pageProps }: AppProps) {



  return (
    <AuthContextProvider>
      <MenuContextProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Header />
          <Component {...pageProps} />
        </SnackbarProvider>
      </MenuContextProvider>
    </AuthContextProvider>
  )
}
export default MyApp
