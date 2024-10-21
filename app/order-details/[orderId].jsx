import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import {
  ConciergeBell,
  MapPinned,
  PackageCheck,
  TicketCheck,
  Timer,
  Truck,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Divider,
  HelperText,
  IconButton,
  Modal,
  Portal,
  Surface,
  TextInput,
} from "react-native-paper";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import StepIndicator from "react-native-step-indicator";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { Colors, Images } from "../../constant";
import colors from "../../constant/colors";
import images from "../../constant/images";
import globalSlice, { globalSelector } from "../../redux/slice/globalSlice";
import { userInfoSliceSelector } from "../../redux/slice/userSlice";
import {
  convertIntTimeToString,
  formatDateTime,
  formatNumberVND,
} from "../../utils/MyUtils";

const OrderTracking = () => {
  const { width, height } = Dimensions.get("window");
  const widthItem = (width * 90) / 100;
  const heightItem = (height * 20) / 100;
  const widthImageIllustration = (width * 30) / 100;
  const [openInfoOrder, setOpenInfoOrder] = useState(false);
  console.log(openInfoOrder, " open");
  const params = useLocalSearchParams();
  const refMap = useRef();
  const [heightMap, setHeightMap] = useState(0);
  const layoutRef = useRef();
  const translateY = useSharedValue(0);
  const bottomSheetRef = useRef(null);
  const info = useSelector(userInfoSliceSelector);
  const isFocus = useIsFocused();
  const { orderStatusChange } = useSelector(globalSelector);
  const apiKey = process.env.EXPO_PUBLIC_SERVICE_API;
  const [visible, setVisible] = useState(false);
  const [reasonCancel, setReasonCancel] = useState("");
  const [reasonError, setReasonError] = useState("");
  const dispatch = useDispatch();
  const [origin, setOrigin] = useState([
    {
      latitude: 10.8387911,
      longitude: 106.8347649,
      name: "Vinhome Grand Park",
    },
  ]);
  const [orderData, setOrderData] = useState(null);
  // callbacks
  useEffect(() => {
    handleGetOrderData();
  }, [isFocus, orderStatusChange]);

  const handleGetOrderData = async () => {
    try {
      const res = await api.get(`/api/v1/customer/order/${params.orderId}`);
      const data = await res.data;
      console.log(data, " data OrderTracking");
      setOrderData(data.value);
      if (data.value) {
        if (data.value.shopInfo) {
        }
      }
    } catch (err) {
      console.log(err, " error in OrderTracking");
    }
  };
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const genPromotionTitle = (item) => {
    if (item.applyType == 1) {
      return `Giảm ${item.amountRate}%, tối đa ${formatNumberVND(item.maximumApplyValue)}. Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    } else {
      return `Giảm ${formatNumberVND(item.amountValue)}.  Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    }
  };
  console.log(heightMap, " height map");
  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);
  useEffect(() => {
    if (openInfoOrder) {
      translateY.value = withTiming(100);
    } else {
      translateY.value = withTiming(heightMap - 50);
    }
  }, [openInfoOrder]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      minHeight: translateY.value,
    };
  });
  const handleOpenDialogCancelOrder = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
  const handleGetPaymentMethodString = (payments) => {
    if (payments && Array.isArray(payments)) {
      const payment = payments.find((i) => i.type == 1);
      if (payment) {
        if (payment.paymentMethods == 1) {
          return "Thanh toán online qua VNPay";
        } else {
          return "Thanh toán khi nhận hàng";
        }
      } else {
        return "-";
      }
    } else {
      return "";
    }
  };
  const handleCancelOrder = async () => {
    try {
      if (reasonCancel == "") {
        setReasonError("Vui lòng nhập lý do hủy đơn hàng");
        return;
      }
      const res = await api.put(
        `/api/v1/customer/order/${orderData.id}/cancel`,
        {
          reason: reasonCancel,
        }
      );
      const data = await res.data;

      if (data.isSuccess) {
        hideModal();
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: "white",
              backgroundColor: colors.glass.green,
              pos: {
                top: 40,
              },
              actionColor: "green",
            },
          })
        );
        dispatch(
          globalSlice.actions.openSnackBar({
            message: "Hủy đơn hàng thành công",
          })
        );
        router.push("/order/order-history");
      } else {
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: "white",
              backgroundColor: Colors.glass.green,
              pos: {
                top: 40,
              },
              actionColor: "yellow",
            },
          })
        );
        dispatch(
          globalSlice.actions.openSnackBar({ message: data?.error?.message })
        );
      }
    } catch (e) {
      dispatch(
        globalSlice.actions.customSnackBar({
          style: {
            color: "white",
            backgroundColor: Colors.glass.green,
            pos: {
              top: 40,
            },
            actionColor: "red",
          },
        })
      );
      dispatch(
        globalSlice.actions.openSnackBar({
          message: "Đã có lỗi xảy ra ở phía máy chủ",
        })
      );
      console.log(e);
    }
  };
  return orderData == null ? (
    <></>
  ) : (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className="flex-1"
      ref={layoutRef}
      onLayout={(event) => {
        setHeightMap(event.nativeEvent.layout.height); // Store parent height on layout
      }}
    >
      <SafeAreaView
        className="bg-white pb-4 rounded-b-3xl"
        style={styles.shadow}
        edges={["top"]}
      >
        <View className="flex-row justify-center items-center w-full ">
          <IconButton
            className="absolute left-0 "
            icon="chevron-left"
            size={32}
            iconColor={Colors.primaryBackgroundColor}
            onPress={() => router.push("/order/")}
          />
          <Text className="font-hnow64regular text-lg text-primary">
            Cart page
          </Text>
        </View>
      </SafeAreaView>
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
          <Text className="font-bold text-lg mb-2">
            Lý do hủy đơn hàng #{orderData.id}
          </Text>
          <TextInput
            onChangeText={(value) => setReasonCancel(value)}
            value={reasonCancel}
            mode="outlined"
            label="Lý do ..."
            multiline
            numberOfLines={4}
          />
          <HelperText type="error" visible={reasonError != ""}>
            {reasonError}
          </HelperText>
          <View className="flex-row justify-end gap-2">
            <Button
              mode="contained"
              contentStyle={{
                backgroundColor: "#000000",
              }}
              onPress={hideModal}
            >
              Hủy
            </Button>
            <Button mode="contained" onPress={handleCancelOrder}>
              Xác nhận
            </Button>
          </View>
        </Modal>
      </Portal>
      <View className=" absolute bottom-0 right-0 left-0 items-center">
        {
          // <Animated.View
          //   style={[
          //     {
          //       width: width,
          //       backgroundColor: 'white',
          //       ...styles.shadow,
          //       borderTopLeftRadius: 16,
          //       borderTopRightRadius: 16,
          //     },
          //     animatedStyle,
          //   ]}
          // >
          //   <TouchableRipple onPress={() => setOpenInfoOrder(state => !openInfoOrder)}>
          //     <View
          //       className="justify-center items-center"
          //       style={{
          //         height: 50,
          //       }}
          //     >
          //       <Equal color={Colors.greyText} size={25} />
          //     </View>
          //   </TouchableRipple>
          //
          //   <Divider className="w-full" />
          //
          //   <View style={{ height: 200 }} />
          // </Animated.View>
        }
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        style={{
          backgroundColor: "white",
          ...styles.shadow,
          borderRadius: 16,
        }}
        onChange={handleSheetChanges}
        snapPoints={[300, heightMap != 0 ? heightMap : 100]}
      >
        <BottomSheetView
          style={{
            flex: 1,
          }}
        >
          <StepIndicator
            stepCount={4}
            customStyles={customStyles}
            currentPosition={orderData.status - 1}
            labels={labels}
            renderStepIndicator={renderStepIndicator}
          />
          <View className="flex-row px-10 justify-between my-4 items-center">
            <View className="flex-row gap-2 items-center">
              <Text className="text-sm">Tổng cộng: </Text>
              <Text className="text-primary text-lg">
                {formatNumberVND(
                  orderData.totalPrice - orderData.totalPromotion
                )}
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
            <Text className="font-hnow64regular text-green-800 text-xs">
              Dự kiến giao:{" "}
              {`${convertIntTimeToString(orderData.startTime)} - ${convertIntTimeToString(orderData.endTime)}`}
            </Text>
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
                  <View className="flex-1">
                    <Text>
                      {product.optionGroups &&
                        Array.isArray(product.optionGroups) &&
                        product.optionGroups.length > 0 &&
                        product.optionGroups
                          .map((option) => {
                            if (
                              option.options &&
                              Array.isArray(option.options)
                            ) {
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
            <View className="px-7">
              <Button
                mode="elevated"
                textColor="white"
                buttonColor={Colors.cyan500}
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
                onPress={handleOpenDialogCancelOrder}
              >
                Hủy đơn hàng
              </Button>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default OrderTracking;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: "black",

    shadowOpacity: 0.9,
    elevation: 20,
  },
});
const labels = ["Chờ xác nhận", "Shop đang làm", "Đang giao", "Hoàn thành"];
const customStyles = {
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: Colors.blue[100],
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: Colors.blue[100],
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: Colors.blue[100],
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: Colors.blue[100],
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 30,
  currentStepIndicatorLabelFontSize: 35,
  stepIndicatorLabelCurrentColor: Colors.blue[100],
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 12,
  currentStepLabelColor: Colors.blue[100],
};
const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
  const iconConfig = {
    color: stepStatus === "finished" ? "#ffffff" : Colors.blue[100],
    size: 24,
  };

  return iconConfig;
};

const renderStepIndicator = (params) => {
  const { position, stepStatus } = params;
  if (position == 0) {
    return <Timer {...getStepIndicatorIconConfig(params)} />;
  } else if (position == 1) {
    return <ConciergeBell {...getStepIndicatorIconConfig(params)} />;
  } else if (position == 2) {
    return <Truck {...getStepIndicatorIconConfig(params)} />;
  } else if (position == 3) {
    return <PackageCheck {...getStepIndicatorIconConfig(params)} />;
  }
};
