import SkeletonLoading from "expo-skeleton-loading";
import { ArrowRight } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { Colors } from "../../constant";
import colors from "../../constant/colors";
import images from "../../constant/images";
import {
  formatNumberVND,
  parseDateStringToOnlyDate,
} from "../../utils/MyUtils";
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
const ActiveVoucher = ({ item }) => {
  const [image, setImage] = useState("");
  const { width, height } = Dimensions.get("window");
  const widthImage = parseInt((width * 25) / 100);
  console.log(item, " vouche4r details");
  const genPromotionTitle = (item) => {
    if (item.applyType == 1) {
      return `Giảm ${item.amountRate}%, tối đa ${formatNumberVND(item.maximumApplyValue)}. Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    } else {
      return `Giảm ${formatNumberVND(item.amountValue)}.  Áp dụng đơn hàng từ ${formatNumberVND(item.minOrdervalue)}`;
    }
  };
  return item.title == null ? (
    <SkeletonItem />
  ) : (
    <View
      className="flex-row mb-4 justify-between"
      style={{
        height: widthImage,
        width: "100%",
        backgroundColor: "white",
        ...styles.shadow,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <Image
        source={images.PromotionShopLogo}
        style={{
          height: widthImage,
          width: widthImage,
        }}
      />
      <View className="ml-2 flex-1 justify-between p-2">
        <Text numberOfLines={5} className=" flex-1">
          {item.title}
        </Text>
        <Text className="text-xs mb-1 text-gray-500">
          {genPromotionTitle(item)}
        </Text>
        <Text className="text-xs mb-1 text-gray-500">
          Giới hạn: {item.usageLimit} mã
        </Text>
        <View className="flex-row gap-2 flex-wrap h-[30]">
          <Text numberOfLines={1} className="text-primary">
            {parseDateStringToOnlyDate(item.startDate)}
          </Text>
          <ArrowRight color={"red"} size={20} />
          <Text numberOfLines={1} className="text-blue-500">
            {parseDateStringToOnlyDate(item.endDate)}
          </Text>
        </View>
      </View>
      <View className="items-center justify-center">
        <RadioButton.Android
          value={`${item.id}`}
          // status={toppingChecked === item.name ? 'checked' : 'unchecked'}
          color={colors.primaryBackgroundColor}
        />
      </View>
    </View>
  );
};

export default ActiveVoucher;

const SkeletonItem = () => {
  const { width, height } = Dimensions.get("window");
  const widthImage = parseInt((width * 25) / 100);

  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View
        style={{
          height: widthImage,
          borderRadius: 16,
          marginVertical: 16,
          backgroundColor: Colors.skeleton.bg,
        }}
      />
    </SkeletonLoading>
  );
};
