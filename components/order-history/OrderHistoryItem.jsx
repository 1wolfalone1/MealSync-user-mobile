import { router } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import { CircleCheckBig, CircleX, HandCoins } from "lucide-react-native";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../../constant";
import common from "../../constant/common";
import {
  convertIntTimeToString,
  formatDateTime,
  formatNumberVND,
} from "../../utils/MyUtils";

const OrderHistoryItem = ({ item }) => {
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
  const getUiBasedState = () => {
    if (item.status == 4) {
      let suffix = "";
      if (
        item.reasonIdentity == common.OrderIdentity.ORDER_IDENTITY_SHOP_CANCEL
      ) {
        suffix = "Bị hủy do cửa hàng";
      } else if (
        item.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_CUSTOMER_CANCEL
      ) {
        suffix = "Đã hủy do khách hàng";
      }
      return (
        <>
          <CircleX color={"red"} size={14} />
          <Text className="text-xs text-red-500">{suffix}</Text>
        </>
      );
    } else if (item.status == 2) {
      return (
        <>
          <CircleX color={"red"} size={14} />
          <Text className="text-xs text-red-500">
            {item.status == 2 ? "Cửa hàng từ chối nhận đơn" : "Đã hủy"}
          </Text>
        </>
      );
    } else if (item.status == 9) {
      if (
        item.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_DELIVERY_FAIL_BY_CUSTOMER
      ) {
        return (
          <>
            <CircleX color={"red"} size={14} />
            <Text className="text-xs text-red-600">
              Giao thất bại do khách hàng
            </Text>
          </>
        );
      } else if (
        item.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_DELIVERY_FAIL_BY_SHOP
      ) {
        return (
          <>
            <CircleX color={"red"} size={14} />
            <Text className="text-xs text-red-600">
              Giao thất bại do cửa hàng
            </Text>
          </>
        );
      } else {
        return (
          <>
            <CircleCheckBig color={"green"} size={14} />
            <Text className="text-xs text-green-600">Giao thành công</Text>
          </>
        );
      }
    } else if (item.status == 8) {
      return (
        <>
          <CircleCheckBig color={"green"} size={14} />
          <Text className="text-xs text-green-600">Giao hành thất bại</Text>
        </>
      );
    } else if (item.status == 12) {
      return (
        <>
          <CircleCheckBig color={"orange"} size={14} />
          <Text className="text-xs text-orange-500">Báo cáo đã được xử  lý</Text>
        </>
      );
    }
  };
  return item == null ? (
    <SkeletonItem />
  ) : (
    <View
      className=""
      style={{
        borderRadius: 16,
        backgroundColor: "white",
        overflow: "hidden",
        ...styles.shadow,
      }}
    >
      <TouchableRipple
        onPress={() =>
          router.push({
            pathname: "/order-history-completed",
            params: {
              orderId: item.id,
            },
          })
        }
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
              <Text className="text-xs text-gray-500">#{item.id}</Text>
              <View className="flex-row items-center gap-1">
                {getUiBasedState()}
              </View>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
};

export default OrderHistoryItem;

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
