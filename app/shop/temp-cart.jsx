import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  Portal,
  Switch,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import ItemInCart from "../../components/cart-page/ItemInCart";
import { Colors } from "../../constant";
import images from "../../constant/images";
import cartSlice, {
  cartSelector,
  getCartInfo,
} from "../../redux/slice/cartSlice";
import globalSlice from "../../redux/slice/globalSlice";
import orderSlice from "../../redux/slice/orderSlice";
import shopDetailsSlice, {
  dataShopDetailsSelector,
} from "../../redux/slice/shopDetailsSlice";
import { convertIntTimeToString } from "../../utils/MyUtils";

const TempCartPage = () => {
  const { listItemInfo, items, cartState } = useSelector(cartSelector);

  const data = useSelector(cartSelector);
  const { info } = useSelector(dataShopDetailsSelector);
  const [listItemInCartBySlot, setListItemInCartBySlot] = useState([]);
  const dispatch = useDispatch();
  const { operatingSlotId, shopId } = useLocalSearchParams();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [messageErrorPopUp, setMessageErrorPopUp] = React.useState("");
  const [messageErrorInline, setMessageErrorInline] = React.useState("");
  const [isShowPopUp, setIsShowPopUp] = useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [cartTitle, setCartTitle] = useState(null);
  useEffect(() => {
    if (!info || !listItemInfo) {
      console.log(
        info,
        items,
        listItemInfo,
        data,
        " - 234 ----------- errrorrr"
      );
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
      dispatch(cartSlice.actions.resetCartState());
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
    console.log(cartState, " cartState ne ");
    if (cartState) {
      if (cartState.messageForAllCart) {
        setMessageErrorPopUp(cartState.messageForAllCart);
        setIsShowPopUp(true);
      }
    }
  }, [cartState]);
  useEffect(() => {
    if (
      items &&
      items[shopId] &&
      Array.isArray(items[shopId]) &&
      listItemInfo
    ) {
      const mapIdsNotFoundToday = {};
      const mapIdsNotFoundTomorrow = {};
      if (
        cartState.idsNotFoundToday &&
        Array.isArray(cartState.idsNotFoundToday)
      ) {
        cartState.idsNotFoundToday.forEach((id) => {
          mapIdsNotFoundToday[id] = id;
        });
      }
      if (
        cartState.idsNotFoundTomorrow &&
        Array.isArray(cartState.idsNotFoundTomorrow)
      ) {
        cartState.idsNotFoundTomorrow.forEach((id) => {
          mapIdsNotFoundTomorrow[id] = id;
        });
      }
      let filterByConditionList = [];
      console.log(
        listItemInfo,
        mapIdsNotFoundToday,
        mapIdsNotFoundTomorrow,
        " listItemInfo"
      );
      if (isSwitchOn) {
        filterByConditionList = listItemInfo?.filter(
          (i) => !mapIdsNotFoundTomorrow[i.id]
        );
      } else {
        filterByConditionList = listItemInfo?.filter(
          (i) => !mapIdsNotFoundToday[i.id]
        );
      }

      const listItemInCartBySlotTemp = items[shopId].filter((i) => {
        return filterByConditionList.find((j) => j.id == i.productId && i.operatingSlotId == operatingSlotId);
      });
      console.log(listItemInfo, " list item in cartt ttt");
      const listItemInCartBySlotWithInfo = listItemInCartBySlotTemp.map((i) => {
        const itemInListListItemInfo = listItemInfo.find(
          (j) => j.id == i.productId
        );
        if (itemInListListItemInfo) {
          return {
            ...i,
            info: itemInListListItemInfo,
            topping: {
              radio: itemInListListItemInfo.optionGroupRadio,
              checkbox: itemInListListItemInfo.optionGroupCheckbox,
            },
          };
        } else {
          return null;
        }
      });
      console.log(
        listItemInCartBySlotWithInfo,
        " list item in cart with info ttt 222"
      );
      setListItemInCartBySlot(listItemInCartBySlotWithInfo);
    } else {
      setListItemInCartBySlot([]);
    }
  }, [listItemInfo, items, cartState, isSwitchOn]);
  const handleClearCart = () => {
    dispatch(
      cartSlice.actions.clearCart({
        shopId: shopId,
        operatingSlotId: operatingSlotId,
      })
    );
  };
  console.log(listItemInfo, ' list item info neeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
  return (
    <View className="bg-white flex-1">
      <Portal>
        <Dialog
          visible={isShowPopUp}
          onDismiss={() => {
            setIsShowPopUp(false);
          }}
        >
          <Dialog.Title>Thông báo giỏ hàng</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{messageErrorPopUp}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setIsShowPopUp(false);
                if (
                  cartState.isReceivingOrderPaused ||
                  cartState.isRemoveAllCart
                ) {
                  router.back();
                }
              }}
            >
              Đóng
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
          marginHorizontal: 28,
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
          paddingTop: 4,
        }}
      >
        <View className="flex-row justify-end items-center pb-2">
          <Text
            className="text-base text-gray-400"
            style={{
              color: isSwitchOn ? "blue" : "#6b6464",
            }}
          >
            Đặt hàng cho ngày mai
          </Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>
        {listItemInfo && listItemInfo.length > 0 ? (
          listItemInCartBySlot && listItemInCartBySlot.length > 0 ? (
            listItemInCartBySlot?.map((item) => (
              <ItemInCart
                key={item ? item.productId : null}
                itemsInfo={item}
                shopId={shopId}
              />
            ))
          ) : (
            listItemInfo?.map((item) => (
              <ItemInCart
                key={item ? item.productId : null}
                itemsInfo={null}
                shopId={shopId}
              />
            ))
          )
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
        <Text className="text-red-600 text-sm mt-4">
          {isSwitchOn
            ? cartState.messageFoodNeedRemoveTomorrow
            : cartState.messageFoodNeedRemoveToday}{" "}
        </Text>
      </ScrollView>
      <View className="flex mb-4 w-full items-center absolute bottom-0">
        <Button
          textColor="white"
          mode="elevated"
          disabled={
            !isSwitchOn
              ? !cartState.isAcceptingOrderToday
              : !cartState.isAcceptingOrderTomorrow
          }
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
            const mapCartIds = listItemInCartBySlot.reduce((acc, item) => {
              return {
                ...acc,
                [item.productId]: item,
              };
            }, {});
            dispatch(orderSlice.actions.changeItemsInCart(mapCartIds));
            router.push({
              pathname: "/shop/order2",
              params: {
                shopId: shopId,
                operatingSlotId: operatingSlotId,
                orderTomorrow: isSwitchOn
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
