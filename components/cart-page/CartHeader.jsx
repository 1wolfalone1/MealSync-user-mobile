import { router } from "expo-router";
import SkeletonLoading from "expo-skeleton-loading";
import { MapPin } from "lucide-react-native";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constant";
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
const CartHeader = ({ info, scrollY }) => {
  console.log(info, " info shop in cart header");
  return (
    <SafeAreaView
      className="gap-2 items-center bg-white"
      style={[
        !scrollY && styles.shadow,
        { backgroundColor: "white", zIndex: 10 },
      ]}
      edges={["top", "left", "right"]}
    >
      {!(info && info.id) ? (
        <SkeletonItem />
      ) : (
        <View className="gap-2 items-center  w-full">
          <IconButton
            icon="chevron-left"
            iconColor={Colors.primaryBackgroundColor}
            size={40}
            theme={{ padding: 5 }}
            onPress={() => {
             router.back()
            }}
            className="p-0 m-0 absolute left-1"
            style={{ borderRadius: 16, alignSelf: "center" }}
          />

          <View className="flex-row items-center">
            <Avatar.Image
              className="bg-transparent"
              size={24}
              source={{
                uri: info?.logoUrl,
              }}
            />
            <Text className="ml-2 text-2xl font-hnow65medium">
              {info?.name}
            </Text>
          </View>
          <View className="flex-row items-center">
            <MapPin color={Colors.greyText} size={20} />
            <Text className="ml-1 text-gray-600">
              {info?.location?.address}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartHeader;

const SkeletonItem = () => {
  const { width, height } = Dimensions.get("window");
  return (
    <SkeletonLoading
      background={Colors.skeleton.bg}
      highlight={Colors.skeleton.hl}
    >
      <View
        style={{
          alignItems: "center",
          width: width,
          gap: 8,
        }}
      >
        <IconButton
          icon="chevron-left"
          iconColor={Colors.primaryBackgroundColor}
          size={40}
          theme={{ padding: 5 }}
          onPress={() =>
            router.push({
              pathname: "/home",
              params: {
                shopId: info.id,
              },
            })
          }
          className="p-0 m-0 absolute left-1"
          style={{ borderRadius: 16, alignSelf: "center" }}
        />
        <View
          style={{
            height: 30,
            width: 200,
            backgroundColor: Colors.skeleton.bg,
            borderRadius: 16,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            height: 16,
            width: 300,
            backgroundColor: Colors.skeleton.bg,
            borderRadius: 16,
          }}
        />
      </View>
    </SkeletonLoading>
  );
};
