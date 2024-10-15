import SkeletonLoading from 'expo-skeleton-loading';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { Colors, Images } from '../../constant';
import { formatNumberVND } from '../../utils/MyUtils';
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
  const { width, height } = Dimensions.get('window');
  const widthItem = parseInt((width * 12) / 100);
  const genPromotionTitle = (item) => {
    if (item.applyType == 1) {
      return `Giảm ${item.amountRate}% \nTối đa ${formatNumberVND(item.maximumApplyValue)}`;
    } else {
      return `Giảm ${formatNumberVND(item.amountValue)} \n Áp dụng đơn hàng từ ${formatNumberVND(item.minimumOrderValue)}`;
    }
  };
  return item == null ? (
    <SkeletonItem />
  ) : (
    <View
      className="flex-row my-4"
      style={{ height: widthItem, borderRadius: 16, backgroundColor: 'white', ...styles.shadow }}
    >
      <Image
        style={{ height: widthItem, width: widthItem, borderRadius: 16 }}
        source={Images.PromotionShopLogo}
      />
      <View className="flex-row items-center ml-2">
        <View className="">
          <Text className="font-hnow65medium">{genPromotionTitle(item)}</Text>
        </View>
        <Divider className="h-full w-[0.8] ml-4" />
        <View>
          <Button onPress={() => {}}>Xem</Button>
        </View>
      </View>
    </View>
  );
};

export default ItemPromotionInShop;

const SkeletonItem = () => {
  const { width, height } = Dimensions.get('window');
  const widthItem = parseInt((width * 12) / 100);

  return (
    <SkeletonLoading background={Colors.skeleton.bg} highlight={Colors.skeleton.hl}>
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
