import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { useDispatch } from "react-redux";
import api from "../../api/api";
import globalSlice from "../../redux/slice/globalSlice";
import { formatDateTime } from "../../utils/MyUtils";

const ItemInPageNotify = ({ item }) => {
  const { width, height } = Dimensions.get("window");
  const heightItem = (width * 20) / 100;
  const dispatch = useDispatch();

  const heightImage = (heightItem * 50) / 100;
  const handleRoute = () => {
    try {
      if (!item) {
        return;
      }
      console.log(item, " noti");
      const data = JSON.parse(item.data);
      console.log(data);
      if (item.entityType == 1) {
        handleRouteToOrder(item);
      } else if (item.entityType == 3) {
        router.push({
          pathname: `/report-details`,
          params: { orderId: item.referenceId },
        });
      } else if (item.entityType == 6) {
      } else if (item.entityType== 7) {
        router.push({
          pathname: "/shop-review",
          params: {
            shopId: item.referenceId,
          },
        });
      }
    } catch (e) {
      console.log(e, " error router");
    }
  };
  const handleRouteToOrder = async (item) => {
    try {
      const res = await api.get("/api/v1/customer/order/" + item.referenceId);
      const data = await res.data;
      if (data.isSuccess) {
        const orderData = data.value;
        if (
          orderData.status == 1 ||
          orderData.status == 3 ||
          orderData.status == 5 ||
          orderData.status == 6
        ) {
          router.push("/order-details/" + item.referenceId);
        } else if (
          orderData.status == 2 ||
          orderData.status == 4 ||
          orderData.status == 9 ||
          orderData.status == 12
        ) {
          router.push({
            pathname: "/order-history-completed",
            params: {
              orderId: item.referenceId,
            },
          });
        } else if (orderData.status == 7) {
          router.push({
            pathname: "/order-delivery-success",
            params: {
              orderId: item.referenceId,
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
              orderId: item.referenceId,
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
  return item == null ? (
    <SkeletonItem />
  ) : (
    <TouchableRipple onPress={handleRoute}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingHorizontal: 16,
          backgroundColor: item.id == 2 || item.id == 5 ? "#e0fcff" : "white",
          paddingVertical: 10,
        }}
      >
        <Image
          source={{
            uri: item.imageUrl,
          }}
          style={{
            height: heightImage,
            width: heightImage,
            borderRadius: 1000,
          }}
        />
        <View className="ml-4 flex-1 pr-4">
          <View className="flex-row justify-between">
            <Text className="font-bold text-base text-primary mb-2">
              {item.title}
            </Text>

            <Text className="text-xs text-blue-400">
              {formatDateTime(item.createdDate)}
            </Text>
          </View>

          <View className="flex-row justify-between items-start">
            <Text
              numberOfLines={2}
              className="flex-wrap font-hnow64regular text-gray-700 text-ellipsis text-xs"
            >
              {item.content}
            </Text>
          </View>
        </View>
        <View className="items-end justify-end"></View>
      </View>
    </TouchableRipple>
  );
};

export default ItemInPageNotify;

const SkeletonItem = () => {
  return <></>;
};
