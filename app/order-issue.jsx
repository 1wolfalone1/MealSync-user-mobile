import * as FileSystem from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarCheck2,
  Coins,
  MapPinned,
  NotepadText,
  TicketCheck,
  Utensils,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";

import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  Button,
  Divider,
  HelperText,
  IconButton,
  Modal,
  Portal,
  Surface,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { Colors, Images } from "../constant";
import common from "../constant/common";
import images from "../constant/images";
import globalSlice, { globalSelector } from "../redux/slice/globalSlice";
import {
  convertIntTimeToString,
  formatDateTime,
  formatNumberVND,
} from "../utils/MyUtils";

const OrderHistoryCompleted = () => {
  const params = useLocalSearchParams();
  const [imageUrls, setImageUrls] = useState([{ firstIndex: true }]);
  const [orderData, setOrderData] = useState(null);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [commnent, setCommnent] = useState("");
  const [commnetError, setCommnetError] = useState("");
  const [inRequest, setInRequest] = useState(false);
  const dispatch = useDispatch();

  const { orderStatusChange } = useSelector(globalSelector);
  const [visible, setVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  const widthImage2 = (width * 22) / 100;
  const widthImageIllustration = (width * 30) / 100;
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
  useEffect(() => {
    if (orderData && orderData.status == 12) {
      router.navigate(`/order/order-history`);
    }
  }, [orderData]);
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
  }, [orderStatusChange]);
  const hideModal = () => setVisible(false);
  const [reason, setReason] = useState();
  const getOrderDataString = () => {
    let suffix = "";
    if (orderData.status == 8) {
      if (
        orderData.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_DELIVERY_FAIL_BY_SHOP
      ) {
        return "Đơn hàng giao thất bại (do cửa hàng)";
      } else if (
        orderData.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_DELIVERY_FAIL_BY_CUSTOMER
      ) {
        return "Đơn hàng giao thất bại (do khách hàng)";
      }
    } else if (orderData.status == 10) {
      if (
        orderData.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_DELIVERED_REPORTED_BY_CUSTOMER
      ) {
        suffix = "\nTừ đơn hàng giao thành công";
      } else if (
        orderData.reasonIdentity ==
        common.OrderIdentity
          .ORDER_IDENTITY_DELIVERY_FAIL_BY_CUSTOMER_REPORTED_BY_CUSTOMER
      ) {
        suffix = "\nVì đơn hàng giao thất bại do khách hàng";
      } else if (
        orderData.reasonIdentity ==
        common.OrderIdentity
          .ORDER_IDENTITY_DELIVERY_FAIL_BY_SHOP_REPORTED_BY_CUSTOMER
      ) {
        suffix = "\nVì đơn hàng giao thất bại do cửa hàng";
      }
      return "Đơn hàng đang được báo cáo" + suffix;
    } else {
      if (
        orderData.reasonIdentity ==
        common.OrderIdentity.ORDER_IDENTITY_DELIVERED_REPORTED_BY_CUSTOMER
      ) {
        suffix = "\nTừ đơn hàng giao thành công";
      } else if (
        orderData.reasonIdentity ==
        common.OrderIdentity
          .ORDER_IDENTITY_DELIVERY_FAIL_BY_CUSTOMER_REPORTED_BY_CUSTOMER
      ) {
        suffix = "\nVì đơn hàng giao thất bại do khách hàng";
      } else if (
        orderData.reasonIdentity ==
        common.OrderIdentity
          .ORDER_IDENTITY_DELIVERY_FAIL_BY_SHOP_REPORTED_BY_CUSTOMER
      ) {
        suffix = "\nVì đơn hàng giao thất bại do cửa hàng";
      }
      return "Đơn hàng đang được xem xét báo cáo" + suffix;
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
    if (orderData.status == 8) {
      if (orderData.isReportAllowed) {
        setVisible(true);
      } else {
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: "white",
              icon: "camera",
              backgroundColor: Colors.glass.red,
              pos: {
                top: 40,
              },
              actionColor: "yellow",
            },
          })
        );

        dispatch(
          globalSlice.actions.openSnackBar({
            message: "Không thể báo cáo đơn hàng lúc này!!",
          })
        );
      }
    } else if (orderData.status == 10 || orderData.status == 11) {
      router.push({
        pathname: `/report-details`,
        params: { orderId: orderData.id },
      });
    }
  };
  const pickImage = async () => {
    console.log(" -----------------pick image----------------");
    if (Platform.OS !== "web") {
      const libraryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryStatus.status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }

      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      console.log(result);
      if (!result.cancelled) {
        const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
        if (!fileInfo.exists) {
          return;
        }
        if (fileInfo.size / (1024 * 1024) > 5) {
          Alert.alert(
            "Tệp không hợp lệ",
            "Tệp tải lên không được lớn hơn 5MB 😔"
          );
          return;
        }
        setImageUrls([
          { uri: result.assets[0].uri, firstIndex: false },
          ...imageUrls,
        ]);
      }
    } catch (e) {
      console.log(e, "Error loading image");
    }
  };
  const validate = () => {
    let isValid = true;
    if (!title || title.length > 100) {
      setTitleError("Tiêu đề là bắt buộc hoắc độ dài bé hơn 100 ký tự");
      isValid = false;
    }
    if (!commnent || commnent.length > 500) {
      setCommnetError("Lý do là bắt buộc hoắc độ dài bé hơn 300 ký tự");
      isValid = false;
    }
    if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 6) {
      dispatch(
        globalSlice.actions.customSnackBar({
          style: {
            color: "white",
            icon: "camera",
            backgroundColor: Colors.glass.red,
            pos: {
              top: 40,
            },
            actionColor: "yellow",
          },
        })
      );

      dispatch(
        globalSlice.actions.openSnackBar({
          message: "Chỉ có thể cung cấp tối đa 5 hình",
        })
      );
      isValid = false;
    }
    return isValid;
  };
  const handleReport = async () => {
    try {
      const isValid = validate();
      if (!isValid) {
        return;
      }
      setInRequest(true);
      const formData = new FormData();
      formData.append("OrderId", orderData.id);
      formData.append("Title", title);
      formData.append("Content", commnent);
      if (imageUrls.length > 0) {
        imageUrls.forEach((i) => {
          if (!i.firstIndex) {
            formData.append("Images", {
              uri: i.uri,
              name: "image.jpg",
              type: "image/jpg",
            });
          }
        });
      }
      const res = await api.post("/api/v1/customer/order/report", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      const data = await res.data;
      console.log(data, " response report data");
      if (data.isSuccess) {
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: "white",
              icon: "camera",
              backgroundColor: Colors.glass.green,
              pos: {
                top: 40,
              },
              actionColor: "yellow",
            },
          })
        );

        dispatch(
          globalSlice.actions.openSnackBar({
            message: "Báo cáo đơn hàng thành công",
          })
        );
        setVisible(false);
        handleGetOrderData();
      }

      setInRequest(false);
    } catch (e) {
      setInRequest(false);
      console.log(e);
      if (e.response && e.response.data) {
        if (e.response.status == 400) {
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
              message: e.response?.data?.error?.message,
            })
          );
        }
      }
    }
  };
  const genPromotionTitle = (item) => {
    if (item.applyType == 1) {
      return `Giảm ${item.amountRate}%, tối đa ${formatNumberVND(item.maximumApplyValue)}. Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    } else {
      return `Giảm ${formatNumberVND(item.amountValue)}.  Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    }
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
          <>
            <View className="">
              <Text className="font-bold text-lg">
                Báo cáo đơn hàng #${orderData.id}
              </Text>
              <Divider style={{ height: 1 }} />
              <View className="mt-4">
                <TextInput
                  onChangeText={(value) => setTitle(value)}
                  value={title}
                  label="Tiêu đề"
                  mode="outlined"
                />
                <HelperText type="error" visible={titleError}>
                  {titleError}
                </HelperText>
              </View>
              <TextInput
                onChangeText={(value) => setCommnent(value)}
                value={commnent}
                mode="outlined"
                label="Lý do báo cáo"
                multiline
                numberOfLines={4}
              />
              <HelperText type="error" visible={commnetError}>
                {commnetError}
              </HelperText>
              <View className="flex-row flex-wrap bg-transparent justify-between">
                <FlatList
                  contentContainerStyle={{}}
                  data={imageUrls}
                  scrollEnabled={false}
                  numColumns={3}
                  renderItem={({ item, index }) => {
                    if (item.firstIndex) {
                      return (
                        <View
                          style={{
                            borderRadius: 24,
                            width: widthImage2,
                            height: widthImage2,
                            margin: 10,
                            backgroundColor: "white",
                          }}
                        >
                          <TouchableRipple
                            borderless
                            style={{
                              borderRadius: 24,
                            }}
                            onPress={() => pickImage()}
                          >
                            <Image
                              source={images.AddImage}
                              style={{
                                height: widthImage2,
                                width: widthImage2,
                                borderRadius: 24,
                              }}
                            />
                          </TouchableRipple>
                        </View>
                      );
                    } else {
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
                          <View className="absolute top-2 right-2 z-[1] bg-red-500 rounded-full">
                            <IconButton
                              size={12}
                              iconColor="white"
                              onPress={() => {
                                setImageUrls(
                                  imageUrls.filter((_, i) => i !== index)
                                );
                              }}
                              style={{
                                margin: 0,
                              }}
                              icon={"cancel"}
                            />
                          </View>

                          <Image
                            source={{ uri: item.uri }}
                            style={{
                              width: "100%",
                              height: "100%",
                              resizeMode: "cover",
                              zIndex: 0,
                            }}
                          />
                        </Surface>
                      );
                    }
                  }}
                />
              </View>
              <View className="flex-row justify-end items-center">
                <Button onPress={() => setVisible(false)} textColor="red">
                  Hủy
                </Button>
                <Button
                  disabled={inRequest}
                  loading={inRequest}
                  onPress={handleReport}
                >
                  Lưu
                </Button>
              </View>
            </View>
          </>
        </Modal>
      </Portal>
      <View className="px-10">
        <Text className="text-lg font-hnow64regular text-red-500">
          {getOrderDataString()}
        </Text>
        <Divider
          style={{
            height: 1,
          }}
        />
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
              <View className="flex-1 flex-row gap-1 mr-2">
                <Utensils size={16} color={"blue"} />
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
            onPress={handlePressButton}
          >
            {getStringButton()}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderHistoryCompleted;
