import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import MaterialTopBar from "../../../components/custom-stack/MaterialTopBar";
import { Colors, Icons } from "../../../constant";

const OrderLayout = () => {
  const dispatch = useDispatch();
  const [origin, setOrigin] = useState([
    {
      latitude: 10.8387911,
      longitude: 106.8347649,
      name: "Vinhome Grand Park",
    },
  ]);
  useFocusEffect(() => {
    return () => {};
  });
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="items-center" style={{}}>
        <Image
          source={Icons.IconLight}
          style={{
            width: 50,
            height: 60,
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
            fontFamily: "HeadingNow-64Regular",
          },
          tabBarStyle: { backgroundColor: Colors.primaryBackgroundColor },
          tabBarIndicatorStyle: {
            borderBottomWidth: 1.5,
          },
          tabBarAllowFontScaling: false,
        }}
      >
        <MaterialTopBar.Screen
          name="index"
          options={{
            title: "Đơn đang giao",
          }}
        />
        <MaterialTopBar.Screen
          name="order-review"
          options={{
            title: "Chờ đánh giá",
          }}
        />
        <MaterialTopBar.Screen
          name="order-history"
          options={{
            title: "Hoàn thành",
          }}
        />
        <MaterialTopBar.Screen
          name="order-issue"
          options={{
            title: "Có vấn đề",
          }}
        />
      </MaterialTopBar>
    </SafeAreaView>
  );
};

export default OrderLayout;
