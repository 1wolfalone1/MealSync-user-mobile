import SkeletonLoading from "expo-skeleton-loading";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Surface, TouchableRipple } from "react-native-paper";
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
const CategoryItemInHome = ({
  item,
  idCategorySelected,
  setCategorySelected,
}) => {
  const { width, height } = Dimensions.get("window");
  const widthCategory = parseInt((width * 13) / 100);
  return item == null ? (
    <SkeletonItem />
  ) : (
    <Surface elevation={1} className="mr-5 rounded-full">
      <TouchableRipple
        onPress={() => {
          setCategorySelected(item.id);
        }}
        borderless
        rippleColor="rgba(252, 91, 91, 0.178)"
        key={item.id}
        className=" rounded-full"
      >
        <View
          style={{
            ...(idCategorySelected == item.id
              ? { backgroundColor: Colors.primaryBackgroundColor }
              : { backgroundColor: "white" }),
            ...styles.shadow,
          }}
          className={`flex justify-start items-center rounded-full p-1
                   ${"bg-white"}  h-full`}
        >
          <View className="">
            <Image
              source={{
                uri: item.imageUrl,
              }}
              className="rounded-full  border-solid border-primary"
              style={{
                borderColor: "red",
                borderWidth: 1,
                backgroundColor: "white",
                height: widthCategory,
                width: widthCategory,
              }}
            />
          </View>
          <View className="w-[40] pb-2 mt-2 justify-center items-center">
            <Text
              numberOfLines={2}
              // className="font-hnow64regular flex flex-wrap over"
              className={`${"text-black"}  justify-center items-center text-center font-pregular`}
              style={{
                fontSize: 10,
                lineHeight: 15,
                flexWrap: "wrap",
                ...(idCategorySelected == item.id
                  ? { color: "white" }
                  : { color: "black" }),
              }}
            >
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
};

export default CategoryItemInHome;
const SkeletonItem = () => {
  const { width, height } = Dimensions.get("window");
  const widthCategory = parseInt((width * 15) / 100);
  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View style={{ marginRight: 20, flexDirection: "column" }}>
        <View
          style={{
            flexDirection: "row",
            width: widthCategory,
            height: widthCategory + 40,
            backgroundColor: Colors.skeleton.bg,
          }}
          borderRadius={50}
        />
      </View>
    </SkeletonLoading>
  );
};
