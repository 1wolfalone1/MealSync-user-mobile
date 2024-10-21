import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect } from "react";
import "react-native-reanimated";

import { PaperProvider } from "react-native-paper";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import Toastable from "react-native-toastable";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import SnackBarCustom from '../components/common/SnackBarCustom';
import SpinnerCustom from '../components/common/SpinnerCustom';
import { store } from "../redux/store";

let persistor = persistStore(store);
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({});
  const insets = useContext(SafeAreaInsetsContext);
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "HeadingNow-21Thin": require("../assets/fonts/HeadingNow-21Thin.otf"),
    "HeadingNow-22Light": require("../assets/fonts/HeadingNow-22Light.otf"),
    "HeadingNow-23Book": require("../assets/fonts/HeadingNow-23Book.otf"),
    "HeadingNow-55Medium": require("../assets/fonts/HeadingNow-55Medium.otf"),
    "HeadingNow-61Thin": require("../assets/fonts/HeadingNow-61Thin.otf"),
    "HeadingNow-62Light": require("../assets/fonts/HeadingNow-62Light.otf"),
    "HeadingNow-63Book": require("../assets/fonts/HeadingNow-63Book.otf"),
    "HeadingNow-64Regular": require("../assets/fonts/HeadingNow-64Regular.otf"),
    "HeadingNow-65Medium": require("../assets/fonts/HeadingNow-65Medium.otf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  if (!fontsLoaded) {
    return null;
  }
  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            
            <Stack.Screen name="order-details" options={{ headerShown: false }} />
            <Stack.Screen name="shop" options={{ headerShown: false }} />
            <Stack.Screen
              name="(settings)"
              options={{ headerShown: false, animation: "slide_from_bottom" }}
            />
            <Stack.Screen name="verify" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <SnackBarCustom />
          <SpinnerCustom />
          <Toastable
            statusMap={{
              success: "red",
            }}
            offset={insets.top + 30}
            duration={10000}
          />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
