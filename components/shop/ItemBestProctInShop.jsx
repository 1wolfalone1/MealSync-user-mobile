import { router } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { IconButton, Surface, TouchableRipple } from "react-native-paper";
import { Colors } from "../../constant";
import { formatNumberVND } from "../../utils/MyUtils";

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[100],

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
const ItemBestProctInShop = ({ item }) => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 30) / 100);

  const widthCard = parseInt((width * 75) / 100);
  const itemImageUrl = { uri: item?.imageUrl };
  console.log("");
  return item == null ? (
    <SkeletonItem />
  ) : (
    <Surface
      elevation={1}
      className=" my-4"
      style={{
        borderRadius: 20,
      }}
    >
      <TouchableRipple
        onPress={() => router.push(`/shop/${item.id}`)}
        borderless
        style={{
          borderRadius: 20,
          backgroundColor: "white",
        }}
      >
        <View
          className="flex-row  p-2"
          style={{
            width: widthCard,
          }}
        >
          <Image
            style={{ height: widthItem, width: widthItem, borderRadius: 20 }}
            source={itemImageUrl}
          />
          <View className="pl-2 flex-1">
            <View>
              <Text
                className="font-hnow64regular"
                style={{
                  fontSize: 16,
                }}
              >
                {item.name}
              </Text>
            </View>
            <View className="">
              <Text className="font-hnow63book text-gray-500 text-xs">
                {item.description}
              </Text>
            </View>
            <View className="flex-1 justify-between items-end flex-row">
              <Text className="text-primary text-lg">
                {formatNumberVND(item.price)}
              </Text>
              <IconButton
                icon={"plus"}
                size={20}
                onPress={() => {}}
                iconColor="red"
                mode="contained"
                style={{
                  margin: 0,
                  shadowColor: "rgba(1, 0, 0, 1)",
                  shadowOpacity: 0.8,
                  elevation: 6,
                  shadowRadius: 25,
                  shadowOffset: { width: 1, height: 13 },
                }}
              />
            </View>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
};

export default ItemBestProctInShop;

const SkeletonItem = () => {
  const { width, height } = Dimensions.get("window");
  const widthItem = parseInt((width * 30) / 100);
  const widthCard = parseInt((width * 75) / 100);
  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View
        style={{
          height: widthItem + 8,
          width: widthCard,
          marginVertical: 16,
          backgroundColor: Colors.skeleton.bg,
        }}
        borderRadius={20}
      />
    </SkeletonLoading>
  );
};
