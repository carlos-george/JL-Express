import React from 'react';
import AppLoading from 'expo-app-loading';
import { Roboto_400Regular, useFonts } from '@expo-google-fonts/roboto';
import { StatusBar } from 'react-native';

import Routes from './src/routes';

export default function App() {

  // useEffect(() => {
  //   async function updateApp() {
  //     const { isAvailable } = await Updates.checkForUpdateAsync();

  //     if(isAvailable) {
  //       await Updates.fetchUpdateAsync();

  //       await Updates.reloadAsync();
  //     }
  //   }

  //   updateApp();

  // }, []);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#FCA90D"
        translucent
      />
      <Routes />
    </>
  );
}
