import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Button, Divider, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import ItemInCart from "../../components/cart-page/ItemInCart";
import { Colors } from "../../constant";
import images from "../../constant/images";
import cartSlice, {
  cartSelector,
  getCartInfo,
} from "../../redux/slice/cartSlice";
import globalSlice from "../../redux/slice/globalSlice";
import shopDetailsSlice, {
  dataShopDetailsSelector,
} from "../../redux/slice/shopDetailsSlice";
import { convertIntTimeToString } from "../../utils/MyUtils";

const TempCartPage = () => {
  const { listItemInfo, items } = useSelector(cartSelector);
  const { info } = useSelector(dataShopDetailsSelector);
  const [listItemInCartBySlot, setListItemInCartBySlot] = useState([]);
  const dispatch = useDispatch();
  const { operatingSlotId, shopId } = useLocalSearchParams();

  const [cartTitle, setCartTitle] = useState(null);
  useEffect(() => {
    if (!info || !listItemInfo) {
      router.push("/home");
      return () => {
        dispatch(shopDetailsSlice.actions.resetProductDetails());
      };
    }
    dispatch(
      getCartInfo({
        id: shopId,
        operatingSlotId: operatingSlotId,
      })
    );
    dispatch(globalSlice.actions.changeStateOpenFabInShop(false));
    return () => {
      dispatch(cartSlice.actions.resetStateListItemInfo());
      dispatch(globalSlice.actions.changeStateOpenFabInShop(true));
    };
  }, []);
  useEffect(() => {
    if (info && info.operatingSlots && Array.isArray(info.operatingSlots)) {
      const index = info.operatingSlots.findIndex(
        (i) => i.id == operatingSlotId
      );
      if (index >= 0) {
        const slot = info.operatingSlots[index];

        setCartTitle(
          `${slot.title} từ ${convertIntTimeToString(slot.startTime)} đến ${convertIntTimeToString(slot.endTime)}`
        );
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
  const handleClearCart = () => {
    dispatch(
      cartSlice.actions.clearCart({
        shopId: shopId,
        operatingSlotId: operatingSlotId,
      })
    );
  };
  return (
    <View className="bg-white flex-1">
      <View
        className="flex-row justify-between items-center"
        style={{
          paddingBottom: 10,
          borderRadius: 40,
        }}
      >
        <View className="w-[100] items-start">
          <Button
            labelStyle={{
              color: "red",
              fontFamily: "HeadingNow-63Book",
              fontSize: 12,
            }}
            onPress={() => handleClearCart()}
          >
            Xóa tất cả
          </Button>
        </View>
        <Text className=" font-hnow64regular text-lg">Giỏ hàng nè</Text>
        <View className="w-[100] justify-end items-end">
          <IconButton
            onPress={() => router.back()}
            iconColor="red"
            icon="close"
            style={{
              padding: 0,
              margin: 0,
            }}
          />
        </View>
      </View>

      <Divider
        className="h-[0.4]"
        style={{
          height: 1,
          marginHorizontal: 28
        }}
      />
      <View className="ml-8">
        <Text className="text-base text-green-700">{cartTitle}</Text>
      </View>
      <ScrollView
        style={{}}
        contentContainerStyle={{
          paddingHorizontal: 28,
          paddingBottom: 20,
          paddingTop: 20,
        }}
      >
        {listItemInCartBySlot && listItemInCartBySlot.length > 0 ? (
          listItemInCartBySlot?.map((item) => (
            <ItemInCart
              key={item ? item.productId : null}
              itemsInfo={item}
              shopId={shopId}
            />
          ))
        ) : (
          <Image
            style={{
              width: "100%",
              flex: 1,
            }}
            resizeMode="contain"
            source={images.EmptyCart}
          />
        )}
      </ScrollView>
      <View className="flex mb-4 w-full items-center absolute bottom-0">
        <Button
          textColor="white"
          mode="elevated"
          buttonColor={Colors.primaryBackgroundColor}
          className="rounded-full items-center"
          labelStyle={{
            padding: 2,
          }}
          contentStyle={{
            flexDirection: "row-reverse",
            alignItems: "center",
          }}
          onPress={() => {
            router.push({
              pathname: "/shop/order2",
              params: {
                shopId: shopId,
                operatingSlotId: operatingSlotId,
              },
            });
          }}
        >
          Đặt hàng ngay
        </Button>
      </View>
    </View>
  );
};

export default TempCartPage;
