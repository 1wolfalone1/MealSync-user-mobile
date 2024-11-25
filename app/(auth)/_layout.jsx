import React from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialTopBar from "../../components/custom-stack/MaterialTopBar";
import colors from "../../constant/colors";
import icons from "../../constant/icons";
const AuthLayout = () => {
 /*  const rootNavigationState = useRootNavigationState();
  if (true) {
    if (!rootNavigationState?.key) return null;
    return <Redirect href={'/home'}/>
  } */
  return (
    <SafeAreaView
      className="flex-1 bg-primary rounded-sm"
      style={{
        borderBottomEndRadius: 10,
      }}
    >
      <View
        className="items-center"
        style={{
          borderRadius: 2000,
        }}
      >
        <Image
          source={icons.IconLight}
          style={{
            width: 100,
            height: 120,
          }}
        />
      </View>
      <MaterialTopBar
        screenOptions={{
          swipeEnabled: false,
          animationEnabled: true,
          headerShown: true,
          headerStyle: {
            backgroundColor: "red",
          },
          tabBarActiveTintColor: "white",
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarStyle: { backgroundColor: colors.primaryBackgroundColor },
          tabBarIndicatorStyle: {
            borderBottomWidth: 1.5,
          },
          tabBarAllowFontScaling: false,
        }}
      >
        <MaterialTopBar.Screen
          name="index"
          options={{
            title: "Đăng nhập",
          }}
        />
        <MaterialTopBar.Screen
          name="sign-up"
          options={{
            title: "Đăng ký",
          }}
        />
      </MaterialTopBar>
    </SafeAreaView>
  );
};

export default AuthLayout;
