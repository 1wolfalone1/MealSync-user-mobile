import SkeletonLoading from "expo-skeleton-loading";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Button, Dialog, Divider, Portal, Surface } from "react-native-paper";
import { Colors, Images } from "../../constant";
import { formatNumberVND } from "../../utils/MyUtils";
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[400],

    shadowOpacity: 0.1,
    elevation: 4,
    // background color must be set
  },
  shadowSelected: {
    shadowOffset: { width: 8, height: 8 },
    shadowColor: Colors.shadow.DEFAULT,

    shadowOpacity: 0.6,

    elevation: 20,
    // background color must be set
  },
});

const ItemPromotionInShop = ({ item }) => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 12) / 100);
  const [open, setOpen] = useState(false);
  const handleCloseConditionText = () => {
    setOpen(false);
  };
  const genPromotionTitle = (item) => {
    try {
      if (item.applyType == 1) {
        return `Giảm ${item.amountRate}%, tối đa ${formatNumberVND(item.maximumApplyValue)}. Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
      } else {
        return `Giảm ${formatNumberVND(item.amountValue)}.  Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
      }
    } catch (e) {
      return "";
    }
  };

  return item == null ? (
    <SkeletonItem />
  ) : (
    <Surface  className=" my-4 bg-white rounded-2xl pr-3" elevation={2}>
      <View
        className="flex-row"
        style={{
          width: "50%",
          height: widthItem,
          borderRadius: 16,
        }}
      >
        <Portal>
          <Dialog visible={open} onDismiss={handleCloseConditionText}>
            <Dialog.Title
              style={{
                color: Colors.primaryBackgroundColor,
              }}
            >
              Điều kiện của voucher
            </Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{genPromotionTitle(item)}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleCloseConditionText}>Đóng</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Image
          style={{ height: widthItem, width: widthItem, borderRadius: 16 }}
          source={Images.PromotionShopLogo}
        />
        <View className="flex-row items-center ml-2">
          <View className="">
            <Text
              numberOfLines={2}
              className="font-hnow65medium flex-wrap text-xs"
            >
              {genPromotionTitle(item)}
            </Text>
          </View>
          <Divider className="" />
          <View className="">
            <Button
              onPress={() => {
                setOpen(true);
              }}
            >
              Xem
            </Button>
          </View>
        </View>
      </View>
    </Surface>
  );
};

export default ItemPromotionInShop;

const SkeletonItem = () => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 12) / 100);

  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View
        style={{
          height: widthItem,
          borderRadius: 16,
          marginVertical: 16,
          width: widthItem * 5,
          backgroundColor: Colors.skeleton.bg,
          ...styles.shadow,
        }}
      />
    </SkeletonLoading>
  );
};
