import { router } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import { HandCoins, PackageCheck, TimerResetIcon } from "lucide-react-native";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Surface, TouchableRipple } from "react-native-paper";
import { Colors } from "../../constant";
import {
  convertIntTimeToString,
  formatDateTime,
  formatNumberVND,
} from "../../utils/MyUtils";

const OrderTrackingItem = ({ item }) => {
  const { width, height } = Dimensions.get("window");
  const heightItem = (width * 30) / 100;
  const widthItem = (width * 90) / 100;
  const formatDate = (originalDateString) => {
    const date = new Date(originalDateString);

    // Formatting options
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date
      .toLocaleDateString("en-GB", options)
      .replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+)/, "$1/$2/$3 $4:$5");
  };
  const getStatusUI = () => {
    if (item.status == 1) {
      return (
        <>
          <TimerResetIcon color={"blue"} size={16} />
          <Text className="text-xs text-blue-600">Chờ xác nhận</Text>
        </>
      );
    } else if (item.status == 3) {
      return (
        <>
          <TimerResetIcon color={"blue"} size={16} />
          <Text className="text-xs text-blue-600">Đã xác nhận</Text>
        </>
      );
    } else if (item.status == 5) {
      return (
        <>
          <TimerResetIcon color={"blue"} size={16} />
          <Text className="text-xs text-blue-600">Đang chuẩn bị</Text>
        </>
      );
    } else if (item.status == 6) {
      return (
        <>
          <TimerResetIcon color={"blue"} size={16} />
          <Text className="text-xs text-blue-600">Đang giao</Text>
        </>
      );
    } else if (item.status == 7) {
      return (
        <>
          <PackageCheck color={"#2a742e"} size={16} />
          <Text className="text-xs text-green-700">Giao thành công</Text>
        </>
      );
    }
  };
  return item == null ? (
    <SkeletonItem />
  ) : (
    <Surface
      style={{
        borderRadius: 16,
        backgroundColor: "white",
      }}
      elevation={1}
    >
      <TouchableRipple
        onPress={() => {
          if (item.status == 7) {
            router.push({
              pathname: "/order-delivery-success",
              params: {
                orderId: item.id,
              },
            });
          } else {
            router.push("/order-details/" + item.id);
          }
        }}
        borderless
        style={{
          borderRadius: 16,
          height: heightItem,
          width: widthItem,
        }}
      >
        <View
          className="flex-row "
          style={{
            height: widthItem,
            width: widthItem,
            borderRadius: 16,
          }}
        >
          <Image
            source={{
              uri: item.shopLogoUrl,
            }}
            style={{
              height: heightItem,
              width: heightItem,
            }}
          />
          <View
            className="justify-between mx-2 flex-1 pb-1"
            style={{ height: heightItem }}
          >
            <View className="flex-row  justify-between">
              <Text className="text-primary text-lg font-bold">
                {item.shopName}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-blue-700">
                <HandCoins color={"red"} size={16} />{" "}
                {formatNumberVND(item.totalPrice - item.totalPromotion)}
              </Text>
              <Text className="text-xs text-gray-600">
                {item.isOrderTomorrow ? "Đặt cho ngày mai" : "Đặt cho hôm nay"}
              </Text>
            </View>
            <View className="flex-row gap-1 justify-between">
              <Text className="text-blue-700">
                Đặt lúc: {formatDateTime(item.orderDate)}
              </Text>
            </View>
            <View className="flex-row gap-1 justify-between">
              {item.receiveAt == 0 ? (
                <Text className="text-green-800">
                  Khung thời gian giao:{" "}
                  {`${convertIntTimeToString(item.startTime)} - ${convertIntTimeToString(item.endTime)}`}
                </Text>
              ) : (
                <Text className="text-green-800">
                  Giao lúc: {`${formatDateTime(item.receiveAt)}`}
                </Text>
              )}
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-500">
                Mã đơn hàng: #{item.id}
              </Text>
              <View className="flex-row items-center gap-1">
                {getStatusUI()}
              </View>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
};

export default OrderTrackingItem;

const SkeletonItem = () => {
  return (
    <SkeletonLoading>
      <View></View>
    </SkeletonLoading>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[100],

    shadowOpacity: 0.4,
    elevation: 10,
    // background color must be set
  },
  shadowSelected: {
    shadowOffset: { width: 8, height: 8 },
    shadowColor: Colors.shadow.DEFAULT,

    shadowOpacity: 0.6,

    elevation: 20,
    // background color must be set
  },
});
