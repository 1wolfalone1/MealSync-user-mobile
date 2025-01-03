import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarCheck2,
  Coins,
  Flag,
  MapPinned,
  MessageCircleQuestion,
  NotepadText,
  TicketCheck,
  Utensils,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  Button,
  Dialog,
  Divider,
  Modal,
  Portal,
  Surface,
  TouchableRipple,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { Colors } from "../constant";
import common from "../constant/common";
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

  const [visible, setVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  const widthImageIllustration = (width * 30) / 100;
  const dispatch = useDispatch();
  const handleGetOrderData = async () => {
    try {
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: true,
          msg: "Đang tải dữ liệu...",
        })
      );
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
    } finally {
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: false,
          msg: "Đang tải dữ liệu...",
        })
      );
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
    let suffix = "";
    if (orderData.status == 4) {
      if (
        orderData.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_SHOP_CANCEL
      ) {
        suffix = " bởi cửa hàng";
      } else if (
        orderData.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_CUSTOMER_CANCEL
      ) {
        suffix = " bởi khách hàng";
      }

      return "Đơn hàng đã bị hủy" + suffix;
    } else if (orderData.status == 2) {
      return "Đơn hàng đã bị từ chối bởi cửa hàng";
    } else if (orderData.status == 9) {
      if (orderData.reasonIdentity == null) {
        return "Đơn hàng đã giao hàng thành công";
      } else if (
        orderData.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_DELIVERY_FAIL_BY_CUSTOMER
      ) {
        return "Đơn hàng giao thất bại (do khách hàng)";
      } else if (
        orderData.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_DELIVERY_FAIL_BY_SHOP
      ) {
        return "Đơn hàng giao thất bại (do cửa hàng)";
      }
    } else if (orderData.status == 12) {
      return "Đã xử khiếu nại thành công";
    }
  };
  const genPromotionTitle = (item) => {
    if (item.applyType == 1) {
      return `Giảm ${item.amountRate}%, tối đa ${formatNumberVND(item.maximumApplyValue)}. Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    } else {
      return `Giảm ${formatNumberVND(item.amountValue)}.  Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    }
  };
  const [visible2, setVisible2] = useState(false);
  const hideDialog2 = () => setVisible2(false);
  const widthImage2 = (width * 22) / 100;
  return orderData == null ? (
    <></>
  ) : (
    <SafeAreaView className="flex-1 bg-white">
      <Portal>
        <Dialog visible={visible2} onDismiss={hideDialog2}>
          <Dialog.Title>Lý do giao thất bại</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{orderData.reason}</Text>
            <Text variant="bodyMedium" >Hình ảnh: </Text>
            {orderData.shopDeliveryFailEvidence && (
              <View className="flex-row flex-wrap bg-transparent justify-between">
                <FlatList
                  contentContainerStyle={{}}
                  data={orderData.shopDeliveryFailEvidence}
                  scrollEnabled={false}
                  numColumns={3}
                  renderItem={({ item, index }) => {
                    return (
                      <Surface
                        elevation={2}
                        style={{
                          overflow: "hidden",
                          width: widthImage2,
                          height: widthImage2,
                          margin: 10,
                          borderRadius: 24,
                        }}
                      >
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover",
                          }}
                        />
                      </Surface>
                    );
                  }}
                />
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog2}>Xong</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
        <Text className="font-bold text-lg text-red-500">
          {getOrderDataString()}
        </Text>
        <Divider
          style={{
            height: 1,
          }}
        />
        <View className="flex-row  justify-between items-center">
          {orderData.reason && (
            <TouchableRipple
              borderless
              onPress={() => {setVisible2(true)}}
              className="p-2 rounded-lg"
            >
              <View className="flex-row items-center gap-1">
                <MessageCircleQuestion size={16} color={"blue"} />
                <Text className="text-sm text-blue-700">
                  Xem lý do
                </Text>
              </View>
            </TouchableRipple>
          )}
          {orderData.status == 12 && (
            <TouchableRipple
              borderless
              onPress={() => {
                router.push({
                  pathname: `/report-details`,
                  params: { orderId: orderData.id },
                });
              }}
              className="p-2"
            >
              <View className="flex-row justify-end">
                <Flag size={16} color={"red"} />
                <Text className="text-sm text-red-600">
                  Xem chi tiết báo cáo
                </Text>
              </View>
            </TouchableRipple>
          )}
        </View>
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
      <View className="flex-row justify-end px-10 py-1">
        {orderData.isOrderNextDay ? (
          <>
            <CalendarCheck2 color={"red"} size={16} />

            <Text className="text-xs text-red-400">Đặt hàng cho ngày mai</Text>
          </>
        ) : (
          <>
            <CalendarCheck2 color={"red"} size={16} />
            <Text className="text-xs text-red-400">Đặt hàng cho hôm nay</Text>
          </>
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
              source={{
                uri: orderData?.shopInfo?.logoUrl,
              }}
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
            <Image
              source={{ uri: product.imageUrl }}
              style={{
                height: parseInt((width * 25) / 100),
                width: parseInt((width * 25) / 100),
                borderRadius: 10,
              }}
            />
            <View className="flex-1 justify-between">
              <Text numberOfLines={2} className="font-bold text-lg">
                {product.name}
              </Text>
              <View className="flex-1 flex-row gap-1 mr-2">
                <Utensils size={16} color={"blue"} />
                <Text
                  className="flex-wrap flex-1 text-ellipsis"
                  numberOfLines={3}
                >
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
              <View className="gap-3 my-1 flex-row items-center">
                {product.note && (
                  <>
                    <NotepadText size={12} color="green" />
                    <Text className="text-xs text-gray-500">
                      Ghi chú: {product.note}
                    </Text>
                  </>
                )}
              </View>
              <View className="flex-row items-center gap-2">
                <Coins size={18} color={"red"} />
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
              className="flex-row my-4 mx-7"
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
                source={{
                  uri: orderData.shopInfo.logoUrl,
                }}
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
        {orderData.note && (
          <>
            <Text className="pl-7 text-lg font-bold mt-1">Ghi chú</Text>
            <Text numberOfLines={4} className="pl-7 text-sm text-gray-600 mb-8">
              {orderData.note}
            </Text>
          </>
        )}
        <View className="px-7 mb-5">
          <Button
            mode="elevated"
            textColor="white"
            buttonColor={Colors.primaryBackgroundColor}
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
            onPress={() => {
              router.push({
                pathname: "form-reorder",
                params: { orderId: orderData.id },
              });
            }}
          >
            Đặt lại đơn hàng
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderHistoryCompleted;
