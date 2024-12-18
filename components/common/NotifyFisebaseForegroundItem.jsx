import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Surface, TouchableRipple } from "react-native-paper";
import { useDispatch } from "react-redux";
import api from "../../api/api";
import { Colors } from "../../constant";
import globalSlice from "../../redux/slice/globalSlice";
import { formatDateTime } from "../../utils/MyUtils";

const NotifyFisebaseForegroundItem = ({
  ImageUrl,
  Content,
  Title,
  UpdatedDate,
  item,
}) => {
  const { width, height } = Dimensions.get("window");
  const widthImage = (width * 20) / 100;
  const widthContent = (width * 90) / 100;
  const dispatch = useDispatch();
  const handleClick = () => {
    try {
      if (!item) {
        return;
      }
      if (item.EntityType == 1) {
        handleRouteToOrder(item);
      } else if (item.EntityType == 3) {
        router.push({
          pathname: `/report-details`,
          params: { orderId: item.ReferenceId },
        });
      } else if (item.EntityType == 6) {
        router.push({
          pathname: "/chat/" + item.ReferenceId,
        });
      } else if (item.EntityType == 7) {
        router.push({
          pathname: "/shop-review",
          params: {
            shopId: item.ReferenceId,
          },
        });
      }
    } catch (e) {
      console.log(e, " error router");
    }
  };
  const handleRouteToOrder = async (item) => {
    try {
      const res = await api.get("/api/v1/customer/order/" + item.ReferenceId);
      const data = await res.data;
      if (data.isSuccess) {
        const orderData = data.value;
        if (
          orderData.status == 1 ||
          orderData.status == 3 ||
          orderData.status == 5 ||
          orderData.status == 6
        ) {
          router.push("/order-details/" + item.ReferenceId);
        } else if (
          orderData.status == 2 ||
          orderData.status == 4 ||
          orderData.status == 9 ||
          orderData.status == 12
        ) {
          router.push({
            pathname: "/order-history-completed",
            params: {
              orderId: item.ReferenceId,
            },
          });
        } else if (orderData.status == 7) {
          router.push({
            pathname: "/order-delivery-success",
            params: {
              orderId: item.ReferenceId,
            },
          });
        } else if (
          orderData.status == 10 ||
          orderData.status == 11 ||
          orderData.status == 8
        ) {
          router.push({
            pathname: "/order-issue",
            params: {
              orderId: item.ReferenceId,
            },
          });
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.status == 400) {
          dispatch(
            globalSlice.actions.customSnackBar({
              style: {
                color: "white",
                backgroundColor: "red",
                pos: {
                  top: 40,
                },
                actionColor: "white",
              },
            })
          );
          dispatch(
            globalSlice.actions.openSnackBar({
              message: e.response?.data?.error?.message + "😠",
            })
          );
        } else {
          dispatch(
            globalSlice.actions.customSnackBar({
              style: {
                color: "white",
                backgroundColor: Colors.glass.red,
                pos: {
                  top: 40,
                },
                actionColor: "white",
              },
            })
          );
          dispatch(
            globalSlice.actions.openSnackBar({
              message: "Có gì đó sai sai! Mong bạn thử lại sau 🥲",
            })
          );
        }
      }
      console.log("Route to order error: ", e);
    }
  };
  return (
    <Surface
      elevation={3}
      style={{
        borderRadius: 24,
        width: widthContent,
      }}
    >
      <TouchableRipple
        borderless
        onPress={handleClick}
        style={{
          borderRadius: 24,

          width: widthContent,
        }}
      >
        <View
          className="flex-row"
          style={{
            height: widthImage,
            borderRadius: 24,
            width: widthContent,

            backgroundColor: "white",

            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: widthImage,
              height: widthImage,
              padding: 10,
              borderRadius: 24,
            }}
          >
            <Image
              source={{ uri: ImageUrl }}
              style={{
                width: widthImage - 20,
                height: widthImage - 20,
                borderRadius: 24,
              }}
            />
          </View>
          <View className="ml-2 flex-1 pr-2 justify-between pb-1">
            <View className="flex-1">
              <Text className="font-bold text-sm text-gray-800 mb-2">
                {Title}
              </Text>
              <Text
                numberOfLines={2}
                className="flex-wrap font-hnow64regular text-xs text-purple-900 text-ellipsis flex-1"
              >
                {Content}
              </Text>
            </View>
            <View className="flex-row justify-end items-end">
              <Text className="text-xs text-gray-700">
                {formatDateTime(UpdatedDate)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
};

export default NotifyFisebaseForegroundItem;
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[300],

    shadowOpacity: 0.1,
    elevation: 6,
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
