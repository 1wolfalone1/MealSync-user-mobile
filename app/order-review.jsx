import { router, useLocalSearchParams } from "expo-router";
import { Flag, MapPinned, TicketCheck } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import {
  Button,
  Divider,
  Modal,
  Portal,
  Surface,
  TouchableRipple,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { Colors, Images } from "../constant";
import images from "../constant/images";
import globalSlice from "../redux/slice/globalSlice";
import {
  convertIntTimeToString,
  formatDateTime,
  formatNumberVND,
} from "../utils/MyUtils";

const OrderHistoryCompleted = () => {
  const params = useLocalSearchParams();
  const [orderData, setOrderData] = useState(null);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  const widthImageIllustration = (width * 30) / 100;
  const handleGetOrderData = async () => {
    try {
      const res = await api.get(`/api/v1/customer/order/${params.orderId}`);
      const data = await res.data;
      console.log(data, " data orderhistory");
      setOrderData(data.value);
      if (data.value) {
        if (data.value.shopInfo) {
        }
      }
    } catch (err) {
      console.log(err, " error in OrderTracking");
    }
  };
  const handleGetPaymentMethodString = (payment) => {
    if (payment) {
      if (payment.paymentMethods == 1) {
        return "Thanh toán online qua VNPay";
      } else {
        return "Thanh toán khi nhận hàng";
      }
    } else {
      return "-";
    }
  };

  useEffect(() => {
    handleGetOrderData();
  }, []);
  const hideModal = () => setVisible(false);
  const getOrderDataString = () => {
    if (orderData.status == 8) {
      return "Đơn hàng giao thất bại";
    } else if (orderData.status == 10) {
      return "Đơn hàng đang được báo cáo";
    } else {
      return "Đơn hàng đang được xem xét báo cáo";
    }
  };
  const genPromotionTitle = (item) => {
    if (item.applyType == 1) {
      return `Giảm ${item.amountRate}%, tối đa ${formatNumberVND(item.maximumApplyValue)}. Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    } else {
      return `Giảm ${formatNumberVND(item.amountValue)}.  Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    }
  };
  const getStringButton = () => {
    console.log(orderData, " datatataaaaaaaaaa");
    if (orderData.status == 8) {
      return "Báo cáo cửa hàng";
    } else if (orderData.status == 10 || orderData.status == 11) {
      return "Xem báo cáo đơn hàng";
    }
  };
  const handlePressButton = async () => {
    router.push({
      pathname: "/review-form",
      params: {
        orderId: orderData.id,
      },
    });
  };
  return orderData == null ? (
    <></>
  ) : (
    <SafeAreaView className="flex-1 bg-white">
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            borderRadius: 20,
            backgroundColor: "white",
            padding: 20,
            marginHorizontal: 20,
          }}
        >
          <></>
        </Modal>
      </Portal>
      <View className="px-10">
        <View className="flex-row justify-between">
          <Text className="font-bold text-lg text-green-700">
            Đơn hành chờ đánh giá
          </Text>
        </View>
        <Divider
          style={{
            height: 1,
          }}
        />
      </View>
      <View className="rounded-lg overflow-hidden flex-row justify-end mr-8">
        <TouchableRipple
          borderless
          onPress={() => {
            if (orderData.isReportAllowed) {
              setVisible(true);
            } else {
              dispatch(
                globalSlice.actions.customSnackBar({
                  style: {
                    color: "black",
                    icon: "camera",
                    backgroundColor: Colors.glass.yellow,
                    pos: {
                      top: 40,
                    },
                    actionColor: "yellow",
                  },
                })
              );

              dispatch(
                globalSlice.actions.openSnackBar({
                  message: "Đơn hàng này hiện không thể báo cáo",
                })
              );
            }
          }}
          className="p-2"
        >
          <View className="flex-row">
            <Flag size={16} color={"red"} />
            <Text className="text-sm text-red-600">Báo cáo đơn hàng</Text>
          </View>
        </TouchableRipple>
      </View>
      <View className="flex-row px-10 justify-between my-4 items-center">
        <View className="flex-row gap-2 items-center">
          <Text className="text-sm">Tổng cộng: </Text>
          <Text className="text-primary text-lg">
            {formatNumberVND(orderData.totalPrice - orderData.totalPromotion)}
          </Text>
        </View>
        <View className="flex-row">
          <Text className="font-hnow63book mr-4 text-green-800">
            Mã đơn hàng: {params.id}
          </Text>
          <Text className="font-hnow63book text-green-800">
            #{orderData.id}
          </Text>
        </View>
      </View>
      <View className="px-10 flex-row justify-between items-center">
        <Text className="font-hnow64regular text-blue-500 text-xs">
          Đặt lúc: {formatDateTime(orderData.orderDate)}
        </Text>
        {orderData.receiveAt != 0 ? (
          <Text className="font-hnow64regular text-green-800 text-xs">
            Giao lúc: {`${formatDateTime(orderData.receiveAt)}`}
          </Text>
        ) : (
          <Text className="font-hnow64regular text-green-800 text-xs">
            Dự kiến giao:{" "}
            {`${convertIntTimeToString(orderData.startTime)} - ${convertIntTimeToString(orderData.endTime)}`}
          </Text>
        )}
      </View>
      <View
        className="flex-row"
        style={{
          height: widthImageIllustration,
        }}
      >
        <Image
          source={images.FoodOrder}
          style={{
            height: widthImageIllustration,
            width: widthImageIllustration,
          }}
        />
        <View className="justify-between py-4 flex-1 pr-10 ">
          <View className="flex-row items-center gap-2">
            <Image
              source={images.PromotionShopLogo}
              style={{
                height: 40,
                width: 40,
                borderRadius: 25,
                overflow: "hidden",
              }}
            />
            <Text className="font-bold text-base">
              {orderData.shopInfo.name}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text
              numberOfLines={1}
              className="flex-wrap flex-1 text-sm text-gray-600"
            >
              {orderData.fullName}
            </Text>
            <Divider className="h-full" style={{ width: 2 }} />
            <Text
              className="flex-wrap flex-1 text-sm text-gray-600 "
              style={{
                textAlign: "right",
              }}
            >
              {orderData.phoneNumber}
            </Text>
          </View>
          <View className=" flex-row  items-center gap-2">
            <MapPinned color={"grey"} size={20} />
            <Text
              numberOfLines={2}
              className="flex-wrap flex-1 text-xs text-gray-600"
            >
              {orderData.buildingName}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        {orderData.voucher && orderData.voucher.promotionId && (
          <View className="flex-row gap-1 flex-1">
            <TicketCheck size={20} color={Colors.primaryBackgroundColor} />
            <Text>{orderData.voucher.title}</Text>
          </View>
        )}
        <Text className="pl-7 text-lg font-bold">Thông tin giỏ hàng</Text>
        {orderData.orderDetails.map((product) => (
          <View className="flex-row gap-4 pl-7 mt-4">
            <Surface elevation={4} className="rounded-lg bg-white">
              <Image
                source={{ uri: product.imageUrl }}
                style={{
                  height: parseInt((width * 25) / 100),
                  width: parseInt((width * 25) / 100),
                  borderRadius: 10,
                }}
              />
            </Surface>
            <View className="flex-1 justify-between">
              <Text numberOfLines={2} className="font-bold text-lg">
                {product.name}
              </Text>
              <View className="flex-1">
                <Text>
                  {product.optionGroups &&
                    Array.isArray(product.optionGroups) &&
                    product.optionGroups.length > 0 &&
                    product.optionGroups
                      .map((option) => {
                        if (option.options && Array.isArray(option.options)) {
                          const des = option.options.reduce((a, c, i) => {
                            if (i === 0) {
                              return c.optionTitle;
                            } else {
                              return a + ", " + c.optionTitle;
                            }
                          }, "");

                          return option.optionGroupTitle + ": " + des;
                        } else {
                          return "";
                        }
                      })
                      .join(" & ")}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-primary text-base">
                  {formatNumberVND(product.totalPrice)}
                </Text>
                <Text className="text-gray-600 text-base  font-bold">
                  / {product.quantity} món
                </Text>
              </View>
            </View>
          </View>
        ))}
        {orderData.promotion && (
          <>
            <Text className="pl-7 text-lg font-bold mt-8">Giảm giá</Text>
            <Surface
              className="flex-row my-4 mx-7 flex-1"
              style={{
                height: 50,
                borderRadius: 16,
                backgroundColor: "white",
              }}
              elevation={1}
            >
              <Image
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 16,
                }}
                source={Images.PromotionShopLogo}
              />
              <View className="flex-row ml-2 flex-1 items-center">
                <Text
                  className="font-hnow64regular flex-wrap flex-1 text-gray-600"
                  numberOfLines={2}
                >
                  {genPromotionTitle(orderData.promotion)}
                </Text>
              </View>
            </Surface>
          </>
        )}
        <Text className="pl-7 text-lg font-bold mt-4">
          Phương thức thanh toán
        </Text>
        <Text numberOfLines={4} className="pl-7 text-sm text-gray-600 mb-8">
          {handleGetPaymentMethodString(orderData.payments)}
        </Text>

        <Text className="pl-7 text-lg font-bold mt-1">Ghi chú</Text>
        <Text numberOfLines={4} className="pl-7 text-sm text-gray-600 mb-8">
          {orderData.note}
        </Text>
        <View className="px-7 mb-5">
          <Button
            mode="elevated"
            textColor="black"
            buttonColor={"yellow"}
            theme={{ roundness: 2 }}
            contentStyle={{
              paddingVertical: 4,
            }}
            className="rounded-xl"
            labelStyle={{
              fontFamily: "HeadingNow-64Regular",
              fontSize: 20,
              lineHeight: 22,
            }}
            onPress={handlePressButton}
          >
            Đánh giá đơn hàng
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderHistoryCompleted;
