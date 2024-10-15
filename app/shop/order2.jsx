import { router, useLocalSearchParams } from "expo-router";
import { HandCoins, Ticket, Timer, Truck, Wallet } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, ScrollView, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, Divider, RadioButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import CartHeader from "../../components/cart-page/CartHeader";
import ItemInCart from "../../components/cart-page/ItemInCart";
import OrderInfoViewInCart from "../../components/cart-page/OrderInfoViewInCart";
import { Colors } from "../../constant";
import colors from "../../constant/colors";
import images from "../../constant/images";
import cartSlice, {
  cartSelector,
  getCartInfo,
} from "../../redux/slice/cartSlice";
import globalSlice from "../../redux/slice/globalSlice";
import orderSlice, {
  orderSelector,
  orderTotalOrderSelector,
} from "../../redux/slice/orderSlice";
import shopDetailsSlice, {
  dataShopDetailsSelector,
  getShopInfo,
} from "../../redux/slice/shopDetailsSlice";
import { userInfoSliceSelector } from "../../redux/slice/userSlice";
import { convertIntTimeToString, formatQuantity } from "../../utils/MyUtils";

const CartItemInShop = () => {
  const apiKey = process.env.EXPO_PUBLIC_SERVICE_API;
  const { shopId, operatingSlotId } = useLocalSearchParams();

  const [open, setOpen] = useState(false);
  const [isNotScroll, setIsNotScroll] = useState(true);
  const [listItemInCartBySlot, setListItemInCartBySlot] = useState([]);
  const [valueOperatingTime, setValueOperatingTime] = useState(null);
  const [listOperatingTime, setListOperatingTime] = useState([
    { label: "Bỏ trống", value: 0 },
    { label: "Giá", value: 1 },
    { label: "Sao", value: 2 },
  ]);
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 85) / 100);
  const { listItemInfo, items } = useSelector(cartSelector);
  const { info } = useSelector(dataShopDetailsSelector);
  const userInfo = useSelector(userInfoSliceSelector);
  const { orderPrice, ship } = useSelector(orderSelector);
  const totalOrderPrice = useSelector(orderTotalOrderSelector);
  const dispatch = useDispatch();
  const { orderInfo, voucher } = useSelector(orderSelector);
  const [operatingSlot, setOperatingSlot] = useState();
  const [paymentMethod, setPaymentMethod] = useState(1);


  const order = useSelector(orderSelector);
  let scrollOffsetY = useRef(new Animated.Value(0)).current;
  const handleChangePaymentMethod = (value) => {
    setPaymentMethod(value);
  } 
  useEffect(() => {
    dispatch(orderSlice.actions.calculateVoucherPrice());
  }, [voucher]);
  useEffect(() => {
    if (info && info.operatingSlots && Array.isArray(info.operatingSlots)) {
      const index = info.operatingSlots.findIndex(
        (i) => i.id == operatingSlotId
      );
      if (index >= 0) {
        const slot = info.operatingSlots[index];
        setOperatingSlot(slot);
        console.log(slot, " ---------------------------------");
        const result = [];
        let value = 0;
        const start = slot.startTime;
        const end = slot.endTime;
        for (let i = start; i < end; i += 30) {
          if ((i - 60) % 100 == 0) {
            i = i - 60 + 100;
          }
          let y = i + 30;
          if ((y - 60) % 100 == 0) {
            y = y - 60 + 100;
          }
          const label = `Từ ${convertIntTimeToString(i)} đến ${convertIntTimeToString(y)}`;

          result.push({
            label: label,
            value: value++,
          });
        }
        setListOperatingTime(result);
      }
    }
  }, [info]);
  useEffect(() => {
    if (items && items[shopId] && Array.isArray(items[shopId])) {
      const listItemInCartBySlotTemp = items[shopId].filter((i) => {
        return i.operatingSlotId == operatingSlotId;
      });
      setListItemInCartBySlot(listItemInCartBySlotTemp);
    } else {
      setListItemInCartBySlot([]);
    }
  }, [listItemInfo, items]);
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
  const handleGetListBuilding = async () => {
    try {
      const res = await api.get("/api/v1/customer/building");
      const data = await res.data;
      const list = data.value;
      console.log(list);
      if (list && Array.isArray(list)) {
        const item = list.find((i) => i.buildingId == orderInfo.buildingId);
        console.log(item, orderInfo, " dsfasfdasssssss");
        setSelectBuilding(item.buildingName);
      }
    } catch (e) {
      console.log("Get list building error: ", e);
    }
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(
        orderSlice.actions.changeOrderInfo({
          fullName: userInfo.fullName,
          phoneNumber: userInfo.phoneNumber,
          building: {
            address: userInfo?.building?.address,
            longitude: userInfo?.building?.longitude,
            latitude: userInfo?.building?.latitude,
          },
        })
      );
    }
    return () => {};
  }, [userInfo]);
  useEffect(() => {
    dispatch(globalSlice.actions.changePositionTabBar(500));
    console.log(listItemInfo);
    if (shopId) {
      dispatch(getCartInfo(shopId));
      dispatch(getShopInfo(shopId));
      dispatch(orderSlice.actions.changeShopId(shopId));
    }
    return () => {
      dispatch(cartSlice.actions.resetStateListItemInfo());
      dispatch(orderSlice.actions.resetState());
      dispatch(globalSlice.actions.changePositionTabBar(0));
      dispatch(shopDetailsSlice.actions.resetState());
    };
  }, []);
  useEffect(() => {
    if (items[shopId]) {
      dispatch(orderSlice.actions.calculateTotalProductPrice(items[shopId]));
      dispatch(orderSlice.actions.changeProducts(items[shopId]));
    }
  }, [items]);

  const handleOrder = async () => {
    try {
      const { listVoucher, ...orther } = order;
      console.log(orther);
      if (
        !(
          orderInfo.building &&
          orderInfo.building.address != "" &&
          orderInfo.building.latitude != 0 &&
          orderInfo.building.longitude != 0
        )
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
            message: "Vui lòng cung địa chỉ giao hàng!!!",
          })
        );
        return;
      }
      dispatch(globalSlice.actions.changeLoadings(true));
      const res = await api.post("api/v1/customer/order", orther);
      const data = await res.data;
      console.log("dataa ordrrrrrrrrrrr", data);
      if (data.isSuccess) {
        dispatch(globalSlice.actions.changeLoadings(true));
        router.push("/order/");
      } else {
        dispatch(globalSlice.actions.changeLoadings(false));
      }
    } catch (e) {
      dispatch(globalSlice.actions.changeLoadings(false));
      console.error(e);
    }
  };
  const handleNavigateToOrderTracking = async (id) => {
    try {
      const res = await api.get();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <View className="flex-1 bg-white overflow-visible">
      <CartHeader info={info} scrollY={isNotScroll} />
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
              onChangeValue={(value) => {
              }}
              setValue={setValueOperatingTime}
              setItems={setListOperatingTime}
              placeholder={operatingSlot?.title}
            />
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
            <ItemInCart
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
                      <Image source={images.Cod} style={{
                        width: 40,
                        height: 40,
                        
                        marginRight: 10,
                      }}/>
                      <Text className="text-base font-hnow64regular">Thanh toán khi nhận hàng</Text>
                    </View>
                    <RadioButton.Android
                      value={1}
                      status={"checked"}
                      color={colors.primaryBackgroundColor}
                    />
                  </View>
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Image source={images.VNPay} 
                      
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 10,
                      }}/>
                      <Text className="text-base font-hnow64regular">Ví VNPay</Text>
                    </View>
                    <RadioButton.Android
                      value={2}
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
                  onPress={() => router.push("/cart/" + info.id + "/voucher")}
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