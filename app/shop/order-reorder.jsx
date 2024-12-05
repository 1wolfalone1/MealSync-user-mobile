import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  HandCoins,
  NotebookPen,
  Ticket,
  Timer,
  Truck,
  Wallet,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  Button,
  Divider,
  Modal,
  Portal,
  RadioButton,
  TouchableRipple,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import CartHeader from "../../components/cart-page/CartHeader";
import ItemInCartReorder from "../../components/cart-page/ItemInCartReorder";
import OrderInfoViewInCart from "../../components/cart-page/OrderInfoViewInCart";
import { Colors } from "../../constant";
import colors from "../../constant/colors";
import images from "../../constant/images";
import { cartSelector } from "../../redux/slice/cartSlice";
import globalSlice from "../../redux/slice/globalSlice";
import orderSlice, {
  orderSelector,
  orderTotalOrderSelector,
} from "../../redux/slice/orderSlice";
import { dataShopDetailsSelector } from "../../redux/slice/shopDetailsSlice";
import { userInfoSliceSelector } from "../../redux/slice/userSlice";
import { convertIntTimeToString, formatQuantity, getTimeSlotBelow } from "../../utils/MyUtils";

const CartItemInShop = () => {
  const apiKey = process.env.EXPO_PUBLIC_SERVICE_API;
  const { shopId, operatingSlotId, orderTomorrow } = useLocalSearchParams();

  const [heightNote, setHeightNote] = useState(200);
  const [open, setOpen] = useState(false);
  const [orderIdAfterPayment, setOrderIdAfterPayment] = useState(0);
  const [isNotScroll, setIsNotScroll] = useState(true);
  const [listItemInCartBySlot, setListItemInCartBySlot] = useState([]);
  const [valueOperatingTime, setValueOperatingTime] = useState(null);
  const [listOperatingTime, setListOperatingTime] = useState([
    { label: "Bỏ trống", value: 0 },
    { label: "Giá", value: 1 },
    { label: "Sao", value: 2 },
  ]);
  const { width, height } = Dimensions.get("window");
  const [noteTemp, setNoteTemp] = useState("");
  const widthItem = parseInt((width * 85) / 100);
  const { listItemInfo, items } = useSelector(cartSelector);
  const { info } = useSelector(dataShopDetailsSelector);
  const userInfo = useSelector(userInfoSliceSelector);
  const { orderPrice, ship, products, dataReorder, preDataReorder } =
    useSelector(orderSelector);
  const totalOrderPrice = useSelector(orderTotalOrderSelector);
  const dispatch = useDispatch();
  const { orderInfo, voucher, itemsInCart } = useSelector(orderSelector);
  const [operatingSlot, setOperatingSlot] = useState();
  const [paymentMethod, setPaymentMethod] = useState(2);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const order = useSelector(orderSelector);

  const [openNote, setOpenNote] = useState(false);
  const [note, setNote] = useState("");
  let scrollOffsetY = useRef(new Animated.Value(0)).current;
  const handleChangePaymentMethod = (value) => {
    setPaymentMethod(value);
  };
  useEffect(() => {
    dispatch(orderSlice.actions.calculateVoucherPrice());
  }, [voucher]);

  useEffect(() => {
    const handleVNPayRedirect = async () => {
      // Open the browser with the payment link
      let result = await WebBrowser.openAuthSessionAsync(paymentUrl);
      console.log(paymentUrl);
      console.log("---------------ddddd");
      // Check if the user returned by pressing the back button or the browser closed
      if (result.type === "cancel" || result.type === "dismiss") {
        // Make API call to check payment status
        const paymentStatus = await checkPaymentStatus();
        console.log(paymentStatus, " ddddd");
        if (paymentStatus.isSuccess) {
          // Handle successful payment, e.g., navigate to confirmation page
          dispatch(
            globalSlice.actions.changeLoadings({
              isLoading: false,
              msg: "Chờ tí nhé...",
            })
          );
          router.push("/order-details/" + orderIdAfterPayment);
        } else {
          // Handle payment failure
          dispatch(
            globalSlice.actions.changeLoadings({
              isLoading: false,
              msg: "Chờ tí nhé...",
            })
          );
          console.log("Payment Failed!");
        }
      }
    };

    if (paymentUrl) {
      handleVNPayRedirect();
      // Linking.openURL(paymentUrl);
    }
  }, [paymentUrl]);
  const checkPaymentStatus = async () => {
    try {
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: true,
          msg: "Chờ tí nhé...",
        })
      );
      console.log("Checking payment status...", paymentUrl);
      const response = await api.get(
        `/api/v1/customer/order/${orderIdAfterPayment}/payment/status`
      );
      console.log(response, " check vnpay");
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Error checking payment status", error);
      dispatch(
        globalSlice.actions.changeLoadings({
          isLoading: false,
          msg: "Chờ tí nhé...",
        })
      );
      return { success: false };
    }
  };
  useEffect(() => {
    if (
      dataReorder &&
      dataReorder.shopInfo &&
      dataReorder.shopInfo.operatingSlots &&
      Array.isArray(dataReorder.shopInfo.operatingSlots)
    ) {
      const index = dataReorder.shopInfo.operatingSlots.findIndex(
        (i) => i.id == preDataReorder.operatingSlotId
      );
      if (index >= 0) {
        const slot = dataReorder.shopInfo.operatingSlots[index];
        setOperatingSlot(slot);
        const result = [];
        let value = 0;
        const start = slot.startTime;
        const end = slot.endTime;
        let startBelow = start;
        if (orderTomorrow == 'false') {
          startBelow = getTimeSlotBelow(start);
        }
        for (let i = startBelow; i < end; i += 30) {
          if ((i - 60) % 100 == 0) {
            i = i - 60 + 100;
          }
          let y = i + 30;
          if ((y - 60) % 100 == 0) {
            y = y - 60 + 100;
          }
          if (y <= slot.endTime) {
            const label = `Từ ${convertIntTimeToString(i)} đến ${convertIntTimeToString(y)}`;
            result.push({
              label: label,
              value: `${i}-${y}`,
            });
          }
        }
        setListOperatingTime(result);
      }
    }
  }, [info]);
  useEffect(() => {
    console.log(dataReorder, "datareorrrrrrrrrrrrrrrrrrrrrr");
    if (dataReorder && dataReorder.foods && Array.isArray(dataReorder.foods)) {
      const listItemInCartBySlotTemp = dataReorder.foods.map((i) => {
        let newId =
          i.id +
          "-operatingSlotId:" +
          preDataReorder.operatingSlotId +
          "-radio:";
        if (i.optionGroupRadio) {
          i.optionGroupRadio.forEach((option) => {
            newId = newId + `(${option.id},${option.option.id})`;
          });
        }
        newId = newId + "|checkbox:";
        if (i.optionGroupCheckbox) {
          i.optionGroupCheckbox.map((item) => {
            const optionIds = item.options.map((option) => {
              return option.id;
            });
            const newStringOption = `[${optionIds.sort().join(",")}]`;
            const newId = newId + `(${item.id},${newStringOption}`;
          });
        }
        return {
          ...i,
          productId: newId,
        };
      });
      console.log(listItemInCartBySlotTemp, " list item in cart temp");

      dispatch(orderSlice.actions.changeFoodsReorder(listItemInCartBySlotTemp));
    } else {
      setListItemInCartBySlot([]);
    }
  }, []);
  useEffect(() => {
    if (dataReorder && dataReorder.foods && Array.isArray(dataReorder.foods)) {
      if (dataReorder.foods.length > 0 && dataReorder.foods[0].productId) {
        setListItemInCartBySlot(dataReorder.foods);
      }
    }
  }, [dataReorder]);
  useEffect(() => {
    const listener = scrollOffsetY.addListener(({ value }) => {
      // console.log(value, ' scroll value');

      if (value <= 0) {
        setIsNotScroll(true);
      } else {
        setIsNotScroll(false);
      }
    });
    return () => {
      scrollOffsetY.removeListener(listener);
    };
  }, []);
  useEffect(() => {
    if (userInfo) {
      dispatch(
        orderSlice.actions.changeOrderInfo({
          fullName: userInfo.fullName,
          phoneNumber: userInfo.phoneNumber,
          buildingId: preDataReorder.buildingOrderId,
        })
      );
    }
    return () => {};
  }, [userInfo]);
  useEffect(() => {
    if (dataReorder && dataReorder.foods && Array.isArray(dataReorder.foods)) {
      dispatch(
        orderSlice.actions.calculateTotalProductPriceReorder(dataReorder.foods)
      );
      dispatch(orderSlice.actions.changeProductsReorder(dataReorder.foods));
    }
  }, [dataReorder]);
  const handleOrder = async () => {
    try {
      if (
        orderInfo.fullName == "" ||
        orderInfo.phoneNumber == "" ||
        orderInfo.buildingId == 0
      ) {
        dispatch(
          globalSlice.actions.customSnackBar({
            style: {
              color: "white",
              backgroundColor: Colors.glass.red,
              pos: {
                top: 40,
              },
              actionColor: "red",
            },
          })
        );
        dispatch(
          globalSlice.actions.openSnackBar({
            message: "Vui lòng cung cấp thông tin giao hàng!!!",
          })
        );
        return;
      }

      if (valueOperatingTime) {
        const orderTime = {
          isOrderNextDay: orderTomorrow == "true" ? true : false,
          startTime: parseInt(valueOperatingTime.split("-")[0]),
          endTime: parseInt(valueOperatingTime.split("-")[1]),
        };

        const dataOrder = {
          shopId: dataReorder.shopInfo.id,
          ...orderInfo,
          note: note,
          foods: order.products,
          orderTime,
          voucherId: order.voucherId,
          totalDiscount: orderPrice.voucher,
          totalOrder: orderPrice.totalProduct - orderPrice.voucher,
          totalFoodCost: orderPrice.totalProduct,
          paymentMethod: paymentMethod,
          shipInfo: order.ship,
        };
        console.log("data order", dataOrder);
        dispatch(
          globalSlice.actions.changeLoadings({
            isLoading: true,
            msg: "Chờ tí nhé...",
          })
        );
        const res = await api.post("/api/v1/customer/order", dataOrder);
        console.log("data order", res);
        const data = await res.data;
        console.log("dataa ordrrrrrrrrrrr", data);
        if (data.isSuccess) {
          dispatch(
            globalSlice.actions.changeLoadings({
              isLoading: false,
              msg: "Chờ tí nhé...",
            })
          );
          if (paymentMethod == 1) {
            console.log(data.value.paymentLink, " linkkkkkkkkkkkkkkkkk");
            const qrUrl = data.value.paymentLink;

            setOrderIdAfterPayment(data?.value?.order?.id);
            setPaymentUrl(qrUrl);
            // Linking.openURL(qrUrl)
          } else {
            router.push("/order-details/" + data?.value?.order?.id);
          }
        } else {
          dispatch(
            globalSlice.actions.changeLoadings({
              isLoading: false,
              msg: "Chờ tí nhé...",
            })
          );
        }
      } else {
        console.log("");
      }
    } catch (e) {
      dispatch(globalSlice.actions.changeLoadings(false));
      console.error(e);
    }
  };

  const handleSaveNote = () => {
    setOpenNote(false);
    setNote(noteTemp);
  };
  const handleHideNote = () => {
    setOpenNote(false);
  };
  return (
    <View className="flex-1 bg-white overflow-visible">
      <Portal>
        <Modal
          visible={openNote}
          onDismiss={handleHideNote}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 10,
            marginHorizontal: 20,
            borderRadius: 20,
          }}
        >
          <ScrollView style={{}}>
            <View className="items-center flex-1">
              <Text className="text-center text-lg font-hnow64regular">
                Ghi chú cho quán nào
              </Text>
              <Divider style={{ width: "100%", marginVertical: 20 }} />
            </View>
            <View style={{ minHeight: 200, flex: 1 }}>
              <TextInput
                placeholder="Ghi chú tại đây cho toàn đơn..."
                onContentSizeChange={(event) => {
                  setHeightNote(event.nativeEvent.contentSize.height);
                }}
                numberOfLines={10}
                multiline
                defaultValue={noteTemp}
                onChangeText={(e) => setNoteTemp(e)}
                style={{
                  height: heightNote,
                  lineHeight: 28, // <- set the max height here
                }}
              />
            </View>
            <View className="flex-row justify-end items-center">
              <Button
                onPress={() => {
                  setOpenNote(false);
                }}
                textColor="red"
              >
                Hủy
              </Button>
              <Button onPress={handleSaveNote}>Lưu</Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
      <CartHeader info={dataReorder?.shopInfo} scrollY={isNotScroll} />
      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          {
            useNativeDriver: false,
          }
        )}
        className="flex-1 bg-white w-full  pb-[120]"
        contentContainerStyle={{
          marginBottom: 100,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-row justify-center my-4 "></View>
        <OrderInfoViewInCart userInfo={userInfo} info={info} />
        <View className="my-0 pl-8">
          <View className="flex-row items-center">
            <Truck color={"red"} size={28} />
            <Text className="ml-2 text-lg font-bold">Phí giao hàng</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <HandCoins color={Colors.greyText} size={20} />
            <Text className="ml-1 text-gray-600">Freeship</Text>
            <Divider
              className="h-full "
              style={{
                width: 1,
              }}
            />
            <Text>
              {parseFloat(ship.distance).toPrecision(2)}
              km - {parseFloat(ship.duration).toPrecision(2)} phút
            </Text>
          </View>
        </View>
        <View className="my-0 pl-8 mt-4">
          <View className="flex-row items-center">
            <Timer color={"blue"} size={28} />
            <Text className="ml-2 text-lg font-bold">Thời gian nhận hàng</Text>
          </View>

          <View className="mt-2">
            <DropDownPicker
              listMode="SCROLLVIEW"
              open={open}
              style={{
                borderColor: Colors.primaryBackgroundColor,
                width: "80%",
              }}
              containerStyle={{}}
              labelStyle={{}}
              categorySelectable={true}
              placeholderStyle={{ color: "grey" }}
              dropDownContainerStyle={{
                backgroundColor: "white",
                borderColor: Colors.primaryBackgroundColor,
                width: "80%",
              }}
              textStyle={{}}
              value={valueOperatingTime}
              items={listOperatingTime}
              setOpen={setOpen}
              onChangeValue={(value) => {}}
              setValue={setValueOperatingTime}
              setItems={setListOperatingTime}
              placeholder={operatingSlot?.title}
            />
            <Text className="text-gray-700 text-lg">
              {orderTomorrow == "true"
                ? "Đặt hàng cho ngày mai"
                : "Đặt hàng cho hôm nay"}
            </Text>
          </View>
        </View>
        <View className="p-8" style={{ zIndex: -1 }}>
          <View className="mb-5">
            <Text className="ml-2 text-lg font-psemibold">
              Thông tin đơn hàng
            </Text>
            <Divider
              style={{
                height: 1,
              }}
            />
          </View>
          {listItemInCartBySlot?.map((item) => (
            <ItemInCartReorder
              key={item ? item.productId : null}
              itemsInfo={item}
              shopId={shopId}
            />
          ))}

          <View className="mb-5 mt-8">
            <View className="items-center flex-row">
              <Wallet color={"red"} size={28} />
              <Text className="ml-2 text-lg font-psemibold">
                Phương thức thanh toán
              </Text>
            </View>

            <Divider
              style={{
                height: 1,
              }}
            />
            <View className="mt-4">
              <RadioButton.Group
                onValueChange={handleChangePaymentMethod}
                value={paymentMethod}
              >
                <View className="mt-2 gap-2">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center ">
                      <Image
                        source={images.Cod}
                        style={{
                          width: 40,
                          height: 40,

                          marginRight: 10,
                        }}
                      />
                      <Text className="text-base font-hnow64regular">
                        Thanh toán khi nhận hàng
                      </Text>
                    </View>
                    <RadioButton.Android
                      value={2}
                      status={"checked"}
                      color={colors.primaryBackgroundColor}
                    />
                  </View>
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Image
                        source={images.VNPay}
                        style={{
                          width: 40,
                          height: 40,
                          marginRight: 10,
                        }}
                      />
                      <Text className="text-base font-hnow64regular">
                        Ví VNPay
                      </Text>
                    </View>
                    <RadioButton.Android
                      value={1}
                      color={colors.primaryBackgroundColor}
                    />
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          <View className="" style={{ width: widthItem }}>
            <Divider className="mt-4 bg-black-700 h-0.5" />
            <View className="flex-row justify-between bg-red-100 py-1">
              <View className="flex-row items-center ml-2">
                <Ticket color="red" />
                <Text className="ml-2 font-hnow64regular text-gray-800">
                  Voucher
                </Text>
              </View>
              <View>
                <Button
                  icon="chevron-right"
                  onPress={() => router.push("/shop/voucher")}
                  style={{
                    margin: 0,
                    padding: 0,
                  }}
                  labelStyle={{ margin: 0 }}
                  contentStyle={{
                    flexDirection: "row-reverse",
                    margin: 0,
                    paddingHorizontal: 0,
                  }}
                >
                  Chọn voucher
                </Button>
              </View>
            </View>
            <Divider className="mb-4 bg-black-700 h-0.5" />
            <View className="flex-row justify-between">
              <Text className="font-hnow65medium text-lg">Tạm tính</Text>
              <View className="flex-row">
                <Text className="font-hnow64regular text-lg">
                  {formatQuantity(orderPrice.totalProduct)}
                </Text>
                <Text className="font-hnow63book text-lg text-gray-400">
                  {" "}
                  VNĐ
                </Text>
              </View>
            </View>
            <Divider className="my-2 bg-green-200 h-[1]" />
            <View className="flex-row justify-between">
              <Text className="font-hnow65medium text-lg">Phí giao hàng</Text>
              <View className="flex-row">
                <Text className="font-hnow64regular text-lg">
                  {orderPrice.shippingFee == 0
                    ? "0,000"
                    : formatQuantity(orderPrice.shippingFee)}
                </Text>
                <Text className="font-hnow63book text-lg text-gray-400">
                  {" "}
                  VNĐ
                </Text>
              </View>
            </View>
            <Divider className="my-2 bg-green-200 h-[1]" />

            <View className="flex-row justify-between">
              <Text className="font-hnow65medium text-lg">Khuyến mãi</Text>
              <View className="flex-row">
                <Text className="font-hnow64regular text-lg">
                  -
                  {orderPrice.voucher == 0
                    ? "0,000"
                    : formatQuantity(orderPrice.voucher)}
                </Text>
                <Text className="font-hnow63book text-lg text-gray-400">
                  {" "}
                  VNĐ
                </Text>
              </View>
            </View>

            <Divider className="my-4 bg-black-700 h-0.5 " />
          </View>
          <View
            className="flex-row justify-between"
            style={{ width: widthItem }}
          >
            <Text className="font-hnow65medium text-lg">Tổng cộng</Text>
            <View className="flex-row">
              <Text className="font-hnow64regular text-2xl text-primary">
                {formatQuantity(totalOrderPrice)}
              </Text>
              <Text className="font-hnow63book text-lg text-gray-400">
                {" "}
                VNĐ
              </Text>
            </View>
          </View>
          <View
            className="rounded-full"
            style={{
              overflow: "hidden",
            }}
          >
            <TouchableRipple
              onPress={() => setOpenNote(true)}
              borderless
              className="py-4"
            >
              <View className="flex-row">
                <NotebookPen size={24} color={"#810000"} />
                <Text
                  className="text-ellipsis flex-wrap text-gray-500 text-base ml-2"
                  numberOfLines={1}
                >
                  {note ? note : "Thêm ghi chú cho toàn đơn hàng"}
                </Text>
              </View>
            </TouchableRipple>
          </View>
          <View className="mt-8" style={{ width: widthItem }}>
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
              onPress={handleOrder}
            >
              Đặt hàng
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CartItemInShop;

const data = [
  {
    id: 1,
    image:
      "https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494.png",
    name: "Bánh mì nướng",
    price: "50.000đ",
    quantity: 1,
    topping: ["Cay", "Sốt sa tế"],
  },
  {
    id: 2,
    image:
      "https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494.png",
    name: "Bánh mì nướng",
    price: "50.000đ",
    quantity: 1,
    topping: ["Cay", "Sốt sa tế"],
  },
  {
    id: 3,
    image:
      "https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494.png",
    name: "Bánh mì nướng",
    price: "50.000đ",
    quantity: 1,
    topping: ["Cay", "Sốt sa tế"],
  },
];
