import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect } from "react";
import "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import { PaperProvider, TouchableRipple } from "react-native-paper";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import Toastable from "react-native-toastable";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import SnackBarCustom from "../components/common/SnackBarCustom";
import SpinnerCustom from "../components/common/SpinnerCustom";
import colors from "../constant/colors";
import { store } from "../redux/store";

import messaging from "@react-native-firebase/messaging";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { Colors } from "../constant";
let persistor = persistStore(store);
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
if (!__DEV__) {
  console.log = () => {};
}
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
    messaging()
      .getInitialNotification()
      .then((notification) => {
        console.log(notification);
      });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(remoteMessage, "on open");
    });
    messaging().setBackgroundMessageHandler(async (msg) => {});
    const unsubscribe = messaging().onMessage(async (msg) => {});
    return unsubscribe;
  }, []);
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
          <StatusBar style="light"  />
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            <Stack.Screen
              name="order-details"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="add-building"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="shop" options={{ headerShown: false }} />
            <Stack.Screen
              name="(settings)"
              options={{ headerShown: false, animation: "slide_from_bottom" }}
            />
            <Stack.Screen name="verify" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="chat"
              options={{ headerShown: false, animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="form-reorder"
              options={{
                title: "Thông tin đặt lại đơn hàng",
                animation: "slide_from_bottom",
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundColor,
                },
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTitleStyle: {
                  color: "#fff",
                },
                headerLeft: () => (
                  <TouchableRipple
                    onPress={() => router.back()}
                    borderless={true}
                    className="rounded-full p-2"
                  >
                    <Ionicons name="close" size={24} color="white" />
                    {/* "close" is the cancel icon */}
                  </TouchableRipple>
                ),
              }}
            />
            <Stack.Screen
              name="order-delivery-success"
              options={{
                title: "Đơn hàng giao thành công",
                animation: "slide_from_bottom",
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundColor,
                },
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTitleStyle: {
                  color: "#fff",
                },
                headerLeft: () => (
                  <TouchableRipple
                    onPress={() => router.back()}
                    borderless={true}
                    className="rounded-full p-2"
                  >
                    <Ionicons name="close" size={24} color="white" />
                    {/* "close" is the cancel icon */}
                  </TouchableRipple>
                ),
              }}
            />
            <Stack.Screen
              name="order-review"
              options={{
                title: "Đơn hàng chờ đánh giá",
                animation: "slide_from_bottom",
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundColor,
                },
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTitleStyle: {
                  color: "#fff",
                },
                headerLeft: () => (
                  <TouchableRipple
                    onPress={() => router.back()}
                    borderless={true}
                    className="rounded-full p-2"
                  >
                    <Ionicons name="close" size={24} color="white" />
                    {/* "close" is the cancel icon */}
                  </TouchableRipple>
                ),
              }}
            />
            <Stack.Screen
              name="order-issue"
              options={{
                title: "Đơn hàng có vấn đề",
                animation: "slide_from_bottom",
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundColor,
                },
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTitleStyle: {
                  color: "#fff",
                },
                headerLeft: () => (
                  <TouchableRipple
                    onPress={() => router.back()}
                    borderless={true}
                    className="rounded-full p-2"
                  >
                    <Ionicons name="close" size={24} color="white" />
                    {/* "close" is the cancel icon */}
                  </TouchableRipple>
                ),
              }}
            />
            <Stack.Screen
              name="report-details"
              options={{
                title: "Chi tiết báo cáo đơn hàng",
                animation: "slide_from_right",
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundColor,
                },
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTitleStyle: {
                  color: "#fff",
                },
                headerLeft: () => (
                  <TouchableRipple
                    onPress={() => router.back()}
                    borderless={true}
                    className="rounded-full p-2"
                  >
                    <ChevronLeft size={24} color="white" />
                    {/* "close" is the cancel icon */}
                  </TouchableRipple>
                ),
              }}
            />
            <Stack.Screen
              name="order-history-completed"
              options={{
                title: "Lịch sử đơn hàng",
                animation: "slide_from_bottom",
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundColor,
                },
                headerBackTitleStyle: {
                  color: "#fff",
                },
                headerTitleStyle: {
                  color: "#fff",
                },
                headerLeft: () => (
                  <TouchableRipple
                    onPress={() => router.back()}
                    borderless={true}
                    className="rounded-full p-2"
                  >
                    <Ionicons name="close" size={24} color="white" />
                    {/* "close" is the cancel icon */}
                  </TouchableRipple>
                ),
              }}
            />
            <Stack.Screen
              name="review-form"
              options={{
                title: "Đánh giá đơn hàng",
                animation: "slide_from_bottom",
                headerStyle: {
                  backgroundColor: colors.primaryBackgroundColor, // Set header background color to red
                },
                headerTintColor: "white", // Set header text color to white
                headerLeft: () => (
                  <TouchableRipple
                    onPress={() => router.back()}
                    borderless={true}
                    className="rounded-full p-2"
                  >
                    <Ionicons name="close" size={24} color="white" />
                    {/* "close" is the cancel icon */}
                  </TouchableRipple>
                ),
              }}
            />
            <Stack.Screen
              name="shop-review"
              options={{
                title: "Đánh giá của shop",
                animation: "slide_from_right",
                headerStyle: {
                  backgroundColor: colors.primaryBackgroundColor, // Set header background color to red
                },
                headerTintColor: "white", // Set header text color to white
              }}
            />
            <Stack.Screen
              name="map"
              options={{
                title: "Thay đổi địa chỉ",
                animation: "slide_from_right",
                headerStyle: {
                  backgroundColor: colors.primaryBackgroundColor, // Set header background color to red
                },
                headerTintColor: "white", // Set header text color to white
              }}
            />
            <Stack.Screen
              name="map2"
              options={{
                title: "Thay đổi địa chỉ mặc định",
                animation: "slide_from_right",
                headerStyle: {
                  backgroundColor: colors.primaryBackgroundColor, // Set header background color to red
                },
                headerTintColor: "white", // Set header text color to white
              }}
            />
          </Stack>
          <SnackBarCustom />
          <SpinnerCustom />
          <Toastable
            statusMap={{
              success: "red",
            }}
            offset={insets.top + 30}
            duration={3000}
          />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
