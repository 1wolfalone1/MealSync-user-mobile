import { router } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import { Star } from "lucide-react-native";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Surface, TouchableRipple } from "react-native-paper";
import { Colors } from "../../constant";

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 2, height: 4 },
    shadowColor: Colors.shadow[300],

    shadowOpacity: 0.3,
    elevation: 10,
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

const ItemHeaderInSearchList = ({ item }) => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 26) / 100);
  return item == null ? (
    <SkeletonItem />
  ) : (
    <View className="flex-row pl-7 mb-7 gap-2">
      <Surface className="rounded-md overflow-hidden" elevation={2}>
        <TouchableRipple
          borderless
          onPress={() => {
            router.navigate({
              pathname: "/shop",
              params: {
                shopId: item.id,
              },
            });
          }}
        >
          <View
            className=" bg-white rounded-lg"
            style={{
              height: widthItem,
              width: widthItem,
            }}
          >
            <Image
              className="h-full w-full rounded-lg"
              source={{ uri: item.banner }}
              style={{ backgroundColor: "black" }}
            />
          </View>
        </TouchableRipple>
      </Surface>
      <View className="justify-between">
        <Text style={{ fontSize: 16 }} className=" font-hnow65medium">
          {item.shopName}
        </Text>

        <Text
          style={{ fontSize: 14 }}
          className=" font-hnow64regular text-gray-600"
        >
          {item.title}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text
            style={{ fontSize: 14 }}
            className=" font-hnow63book text-primary"
          >
            {item.price} đơn đã bán
          </Text>
        </View>
        <View className="flex-row gap-1 items-center">
          <Text
            style={{ fontSize: 12 }}
            className=" font-hnow64regular text-yellow-700"
          >
            {item.address}
          </Text>
          <Star strokeWidth={3} color="orange" size={14} />
        </View>
      </View>
    </View>
  );
};

export default ItemHeaderInSearchList;

const SkeletonItem = () => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 26) / 100);

  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View
        style={{
          gap: 4,
          paddingLeft: 28,
          flexDirection: "row",
          marginBottom: 28,
        }}
      >
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
            flexDirection: "column",
            gap: 2,
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <View
            style={{
              height: 20,
              borderRadius: 8,
              backgroundColor: Colors.skeleton.bg,
            }}
          />
          <View
            style={{
              height: 16,
              borderRadius: 8,
              backgroundColor: Colors.skeleton.bg,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 14,
                width: 50,
                backgroundColor: Colors.skeleton.bg,
                borderRadius: 8,
              }}
            />

            <View
              style={{
                height: 14,
                width: 50,

                borderRadius: 8,
                backgroundColor: Colors.skeleton.bg,
              }}
            />
          </View>
          <View
            style={{
              height: 16,
              width: widthItem * 1.5,
              backgroundColor: Colors.skeleton.bg,
              borderRadius: 8,
            }}
          />
        </View>
      </View>
    </SkeletonLoading>
  );
};
