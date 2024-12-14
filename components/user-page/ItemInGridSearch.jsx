import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Avatar, TouchableRipple } from "react-native-paper";
import { Colors } from "../../constant";
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[300],

    shadowOpacity: 0.1,
    elevation: 6,
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
const ItemInGridSearch = ({ item }) => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 26) / 100);
  return item == null ? (
    <SkeletonItem />
  ) : (
    <View
      key={item.id}
      className={`flex justify-start items-center bg-transparent  rounded-2xl  mr-5 mb-10`}
      style={{
        width: widthItem,
      }}
    >
      <TouchableRipple
        onPress={() => {
          router.replace({
            pathname: "/shop",
            params: {
              shopId: item.shopId,
              productId: item.id,
            },
          });
        }}
      >
        <View
          className={`w-full bg-black-100  overflow-hidden rounded-2xl `}
          style={{
            height: widthItem,
            width: widthItem,
            ...styles.shadow,
          }}
        >
          <View className="absolute top-2 left-2 bg-glass flex-row rounded-full p-1 z-[1] items-center">
            <Text className="font-hnow64regular" style={{ fontSize: 10 }}>
              4.5
            </Text>
            <AntDesign name="star" size={10} color={Colors.star.defaut} />
            <Text
              className="font-hnow64regular text-xs text-gray-500"
              style={{ fontSize: 10 }}
            >
              (25+)
            </Text>
          </View>

          <Image
            source={{
              uri: item.imageUrl,
            }}
            resizeMode="cover"
            className="z-[0]"
            style={{
              backgroundColor: "black",
              width: widthItem,
              height: widthItem,
            }}
          />
        </View>
      </TouchableRipple>
      <View className="pt-1 items-start w-full gap-1 flex-1">
        <View className="flex  justify-start w-full items-start flex-1">
          <Text style className="text-xs text-gray-400 font-hnow64regular">
            {item.name}
          </Text>
        </View>
        <View className="flex-row flex-1">
          <Avatar.Image
            className="bg-transparent"
            size={16}
            source={{
              uri: item.shopLogoUrl,
            }}
          />
          <View className="ml-2">
            <Text style={{ fontSize: 10 }} className=" font-hnow64regular">
              {item.shopName}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemInGridSearch;
const SkeletonItem = () => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 26) / 100);

  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View style={{ gap: 4, marginRight: 20, marginBottom: 40 }}>
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
            height: 12,
            borderRadius: 4,
            backgroundColor: Colors.skeleton.bg,
          }}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 50,
              backgroundColor: Colors.skeleton.bg,
            }}
          />
          <View
            style={{
              height: 16,
              borderRadius: 4,
              flex: 1,
              backgroundColor: Colors.skeleton.bg,
            }}
          />
        </View>
      </View>
    </SkeletonLoading>
  );
};
