import { router } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../../constant";
import { formatNumberVND } from "../../utils/MyUtils";
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 2, height: 2 },
    shadowColor: Colors.shadow[300],

    shadowOpacity: 0.2,
    elevation: 5,
    // background color must be setvjjkkvjjkjj
  },
});

const ItemBodyInSearchList = ({ item, shopId }) => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 23) / 100);
  return item == null ? (
    <SkeletonItem />
  ) : (
    <TouchableRipple
      className="rounded-lg"
      borderless
      onPress={() =>
        router.navigate({
          pathname: "/shop",
          params: {
            shopId: shopId,
          },
        })
      }
    >
      <View
        className="flex flex-1 overflow-visible"
        style={{
          width: widthItem,
        }}
      >
        <View
          className="rounded-lg "
          style={{
            ...styles.shadow,
            width: widthItem,
            height: widthItem,
          }}
        >
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-full rounded-lg"
            style={{
              backgroundColor: "black",
            }}
          />
        </View>
        <View>
          <Text className="text-lg text-primary">
            {formatNumberVND(item.price)}
          </Text>
          <Text className="text-black text-xs font-hnow63book">
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};

export default ItemBodyInSearchList;

const SkeletonItem = () => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 23) / 100);

  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View style={{ gap: 4, flex: 1 }}>
        <View
          style={{
            width: widthItem,
            height: widthItem,
            borderRadius: 16,
            backgroundColor: Colors.skeleton.bg,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: 24,
              borderRadius: 4,
              flex: 1,
              marginHorizontal: 5,
              backgroundColor: Colors.skeleton.bg,
            }}
          />
        </View>
        <View
          style={{
            height: 14,
            borderRadius: 4,
            margin: 5,
            backgroundColor: Colors.skeleton.bg,
          }}
        />
      </View>
    </SkeletonLoading>
  );
};
