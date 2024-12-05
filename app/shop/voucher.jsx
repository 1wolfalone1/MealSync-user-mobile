import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Divider, RadioButton } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import ActiveVoucher from "../../components/cart-page/ActiveVoucher";
import InactiveVoucher from "../../components/cart-page/InactiveVoucher";
import { Colors } from "../../constant";
import orderSlice, {
  getListVoucher,
  orderSelector,
} from "../../redux/slice/orderSlice";
import { dataShopDetailsSelector } from "../../redux/slice/shopDetailsSlice";
import { userInfoSliceSelector } from "../../redux/slice/userSlice";

const VoucherPage = () => {
  const { ship, listVoucher, voucher, voucherId, dataReorder} = useSelector(orderSelector);
  const test = useSelector(orderSelector);
  const dispatch = useDispatch();
  const { info } = useSelector(dataShopDetailsSelector);
  const userInfo = useSelector(userInfoSliceSelector);
  const [openFloatButton, setOpenFloatButton] = useState(false);
  const translateY = useSharedValue(0);
  console.log(listVoucher, voucher, " listafttttttttttt", test);
  useEffect(() => {
    dispatch(
      getListVoucher({
        shopId: info?.id ? info.id : dataReorder?.shopInfo?.id,
      })
    );
    if (voucher.id) {
      setOpenFloatButton(true);
    }
    return () => {
      dispatch(orderSlice.actions.resetListVoucher());
    };
  }, []);
  const styles = StyleSheet.create({
    shadow: {
      shadowOffset: { width: 4, height: 4 },
      shadowColor: Colors.shadow[400],

      shadowOpacity: 0.1,
      elevation: 10,
      // background color must be set
    },
    shadowSelected: {
      shadowOffset: { width: 8, height: 8 },
      shadowColor: Colors.shadow.DEFAULT,

      shadowOpacity: 0.1,

      elevation: 4,
      // background color must be set
    },
  });
  useEffect(() => {
    if (openFloatButton) {
      translateY.value = withTiming(0);
    } else {
      translateY.value = withTiming(200);
    }
  }, [openFloatButton]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  return (
    <View
      className="flex-1"
      style={{ backgroundColor: "white", paddingTop: 0 }}
    >
      <Animated.View
        className="absolute bottom-2 left-2 right-2 flex-row justify-end py-4 px-4"
        style={[
          {
            zIndex: 1000,
            borderRadius: 16,
            gap: 16,
          },
          animatedStyle,
        ]}
      >
        <Button
          theme={{ roundness: 1 }}
          contentStyle={{
            backgroundColor: "black",
            color: "white",
          }}
          labelStyle={{
            color: "white",
            fontSize: 20,
            lineHeight: 22,
          }}
          onPress={() => {
            dispatch(orderSlice.actions.resetVoucher());
            router.back();
          }}
          mode="elevated"
        >
          Hủy
        </Button>
        <Button
          theme={{ roundness: 1 }}
          mode="elevated"
          contentStyle={{
            backgroundColor: Colors.primaryBackgroundColor,
            color: "white",
          }}
          labelStyle={{
            color: "white",
            fontSize: 20,
            lineHeight: 22,
          }}
          onPress={() => {
            router.back();
          }}
        >
          Chọn voucher
        </Button>
      </Animated.View>
      <View className="items-center py-3 bg-primary">
        <Text className="font-bold text-xl text-white">Khuyến mãi</Text>
      </View>

      <Divider className="h-[1] w-full mb-4" />
      <ScrollView
        showsHorizontalScrollIndicator
        showsVerticalScrollIndicator
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 12,
        }}
      >
        <View className=" flex-1">
          <Text className="font-bold text-xl text-gray-700 ">
            Chọn 1 voucher nào
          </Text>
          <Divider className="h-[1] w-full my-4" />
          <RadioButton.Group
            value={voucherId}
            className=" w-full bg-black-100"
            onValueChange={(value) => {
              setOpenFloatButton(true);
              console.log(value, "0-00000000000000000");
              if (value) dispatch(orderSlice.actions.changeVoucher(value));
            }}
          >
            {listVoucher.active.map((item) => (
              <ActiveVoucher item={item} key={`${item?.id}`} />
            ))}
          </RadioButton.Group>
        </View>

        <View className=" flex-1">
          <Divider className="h-[1] w-full my-4" />
          <Text className="font-hnow64regular text-lg text-gray-700 ">
            Voucher không đủ điều kiện
          </Text>
          <Divider className="h-[1] w-full my-4" />
          {listVoucher.inactive.map((item) => (
            <InactiveVoucher item={item} key={item.id} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default VoucherPage;
