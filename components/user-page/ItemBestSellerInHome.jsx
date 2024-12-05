import { router } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Avatar, Surface, TouchableRipple } from "react-native-paper";
import { Colors } from "../../constant";
import { formatNumberVND } from "../../utils/MyUtils";

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

const ItemBestSellerInHome = ({ item }) => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 30) / 100);
  const itemImage = {
    uri: item?.imageUrl,
  };
  const avatar = {
    uri: item?.shopLogoUrl,
  };
  return item == null ? (
    <SkeletonItem />
  ) : (
    <View
      key={item.id}
      className={`flex justify-start items-center bg-transparent rounded-2xl  mr-5 mb-10`}
      style={{
        width: widthItem,
      }}
    >
      <Surface elevation={1} className="w-full rounded-2xl">        
        <TouchableRipple
          borderless
          onPress={() =>
            router.push({
              pathname: "/shop",
              params: {
                shopId: item.shopId,
              },
            })
          }
          className="bg-red-300 rounded-2xl"
        >
          <View
            className="w-full bg-black-100  rounded-2xl "
            style={{
              height: widthItem,
            }}
          >
            <View className="absolute top-2 left-2 bg-white flex-row rounded-full p-1.5 z-[1]">
              <Text
                className="font-hnow64regular text-xs text-gray-500"
                style={{ fontSize: 10 }}
              >
                {item.totalOrder} đã bán
              </Text>
            </View>
            <Text
              style
              className="text-xs text-black font-hnow64regular absolute bottom-0 left-0 p-1 bg-glass z-[1]"
            >
              {formatNumberVND(item.price)}
            </Text>
            <Image
              source={{
                uri: item?.imageUrl,
              }}
              style={{
                width: widthItem,
                height: widthItem,
              }}
              resizeMode="cover"
              className="z-[0] rounded-2xl"
            />
          </View>
        </TouchableRipple>
      </Surface>
      <View className="pt-1 items-start w-full gap-1">
        <View className="flex  justify-center w-full items-start">
          <Text style className="text-xs text-gray-400 font-hnow64regular">
            {item.name}
          </Text>
        </View>
        <View className="flex-row">
          <Avatar.Image
            className="bg-transparent"
            size={16}
            resizeMethod="resize"
            source={{
              uri: item?.shopLogoUrl,
            }}
          />
          <View className="ml-2">
            <Text className="text-xs font-hnow64regular">{item.shopName}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemBestSellerInHome;

const SkeletonItem = () => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 30) / 100);
  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View
        style={{
          marginBottom: 40,
          marginRight: 20,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            height: widthItem,
            width: widthItem,
            borderRadius: 20,
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

        <View
          style={{
            flexDirection: "row",
            gap: 5,
          }}
        >
          <View
            style={{
              height: 14,
              width: 14,
              borderRadius: 50,
              backgroundColor: Colors.skeleton.bg,
            }}
          />
          <View
            style={{
              height: 14,
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
