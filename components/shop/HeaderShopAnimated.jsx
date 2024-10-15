import {
  AntDesign,
  FontAwesome5,
  MaterialIcons
} from "@expo/vector-icons";
import { ChevronRight, MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Avatar,
  IconButton,
  Searchbar,
  TouchableRipple,
} from "react-native-paper";
import { Colors } from "../../constant";

import { router } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import { FlatList } from "react-native";
import { convertIntTimeToString } from "../../utils/MyUtils";
const Header_Max_Height = 252;
const Header_Min_Height = 0;
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
  headerNotScroll: {
    zIndex: -1,
  },
  headerScroll: {
    zIndex: -1,
    backgroundColor: "white",
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[400],

    shadowOpacity: 0.1,
    elevation: 4,
    borderBottomEndRadius: 21,
    borderBottomLeftRadius: 21,
  },
});

const HeaderShopAnimated = ({
  isNotScroll,
  shopInfo,
  heightHeaderSticky,
  image_url,
  shopName,

  animHeaderValue,
  setIsHeaderTop,
  isHeaderTop,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
}) => {
  const { width, height } = Dimensions.get("window");
  console.log(isNotScroll, " is scroll");
  const [banner, setBanner] = useState(
    "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg"
  );
  const animateHeaderBackgroundColor = animHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const animateHeaderHeight = animHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height + 200],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });
  useEffect(() => {
    console.log(shopInfo, " asdfasdfasdfaaaaaaaaaaaaaaaaaaaaaa");
    if (shopInfo) {
      console.log(shopInfo.bannerUrl, " bannnnnnnnnnnnnnnnnnnnnnnn");
      setBanner(shopInfo.bannerUrl);
    }
  }, [shopInfo]);
  const avatar = { uri: shopInfo?.logoUrl };
  return shopInfo == null ? (
    <SkeletonItem />
  ) : (
    <Animated.View
      className="px-8"
      style={isNotScroll ? styles.headerNotScroll : styles.headerScroll}
    >
      <Animated.View
        style={[
          {
            height: animateHeaderHeight,
            backgroundColor: animateHeaderBackgroundColor,
            opacity: animateHeaderBackgroundColor,
            overflow: "hidden",
            marginTop: 0,
          },
        ]}
      >
        <View className="flex-1">
          <Image
            className="rounded-xl"
            resizeMethod="resize"
            source={{ uri: banner }}
            onError={(e) => {
              console.log(e.nativeEvent);
            }}
            style={{ height: 240, width: width - 2 * 8 * 4 }}
          />
        </View>
        <Avatar.Image
          className="rounded-xl absolute bottom-0 bg-transparent left-8 bg-black-200 rounded-full"
          size={80}
          resizeMethod="resize"
          source={avatar ? avatar : "asdf"}
        />
      </Animated.View>
      <View>
        {!isHeaderTop && (
          <View className="mt-0 flex-row justify-between items-center">
            <Text className="font-hnow65medium text-2xl">{shopInfo.name}</Text>
            {isSearchOpen ? (
              <IconButton
                icon="magnify-remove-outline"
                iconColor={Colors.primaryBackgroundColor}
                size={24}
                onPress={() => setIsSearchOpen(false)}
              />
            ) : (
              <IconButton
                icon="magnify"
                iconColor={Colors.primaryBackgroundColor}
                size={24}
                onPress={() => setIsSearchOpen(true)}
              />
            )}
          </View>
        )}
        {isSearchOpen ? (
          <ScrollView>
            {isHeaderTop && (
              <View style={{ height: (heightHeaderSticky * 90) / 100 }} />
            )}
            <Searchbar
              onIconPress={() => {}}
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{ height: 55, marginBottom: 8 }}
            />
          </ScrollView>
        ) : (
          <View className="flex h-[55] mb-2">
            <View className="flex-row gap-10 justify-between">
              <View className="flex-row items-center gap-1">
                <Text className="text-xs font-hnow64regular items-center">
                  {shopInfo.rating}
                </Text>
                <AntDesign name="star" size={16} color={Colors.star.defaut} />
                <Text className="font-hnow63book text-gray-600 text-xs">
                  ({shopInfo.totalProduct}+)
                </Text>
              </View>
              <TouchableRipple
                onPress={() =>
                  router.push({
                    pathname: "/shop-review",
                    params: {
                      shopId: shopInfo.id,
                      shopName: shopInfo.name,
                    },
                  })
                }
              >
                <View className="flex-row justify-end items-center mt-2 ">
                  <Text
                    style={{
                      color: "#4171d8",
                      fontSize: 12,
                    }}
                  >
                    Xem đánh giá của shop
                  </Text>
                  <ChevronRight color={"#4171d8"} size={18} />
                </View>
              </TouchableRipple>
            </View>
            <View className="flex-row mt-4 justify-between">
              <View className="flex-row gap-1 items-center">
                <FontAwesome5
                  name="shipping-fast"
                  size={16}
                  color={Colors.primaryBackgroundColor}
                />
                <Text className="text-xs text-gray-700 font-hnow64regular">
                  Shipping Fee {shopInfo.shippingFee}k
                </Text>
              </View>
              <View className="flex-row gap-1 items-center">
                <MapPin color={"blue"} size={16} />
                <Text className="font-hnow64regular text-gray-700 text-xs">
                  {shopInfo.location.address}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center mt-2 justify-between">
              <View>
                <FlatList
                  horizontal
                  data={shopInfo?.operatingSlots}
                  ItemSeparatorComponent={() => <View className="w-[16]" />}
                  renderItem={({ item }) => (
                    <View className="flex-row gap-1 items-center">
                      <MaterialIcons name="schedule" size={16} color="green" />
                      <Text className="font-hnow63book text-gray-700 text-xs">
                        {convertIntTimeToString(item.startTime)}
                      </Text>
                      <AntDesign
                        name="arrowright"
                        size={16}
                        color={Colors.greyText}
                      />
                      <Text className="font-hnow63book text-gray-700 text-xs">
                        {convertIntTimeToString(item.endTime)}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};
export default HeaderShopAnimated;

const SkeletonItem = () => {
  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View
        style={{
          paddingHorizontal: 28,
        }}
      >
        <View
          style={{
            borderRadius: 12,
            height: 240,
            backgroundColor: Colors.skeleton.bg,
          }}
        />
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                height: 30,
                width: 150,
                backgroundColor: Colors.skeleton.bg,
                borderRadius: 8,
              }}
            />
            <IconButton
              icon="magnify"
              iconColor={Colors.primaryBackgroundColor}
              size={24}
              onPress={() => setIsSearchOpen(true)}
            />
          </View>
          <View
            style={{
              height: 55,
              justifyContent: "space-between",
              paddingVertical: 4,
            }}
          >
            <View
              style={{
                height: 14,
                width: "80%",
                backgroundColor: Colors.skeleton.bg,
                borderRadius: 8,
              }}
            />
            <View
              style={{
                height: 14,
                width: "80%",
                backgroundColor: Colors.skeleton.bg,
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      </View>
    </SkeletonLoading>
  );
};
