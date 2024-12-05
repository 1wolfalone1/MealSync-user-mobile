import { BlurView } from "expo-blur";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constant";
import { formatDateTime } from "../../utils/MyUtils";

const NotifyFisebaseForegroundItem = ({
  ImageUrl,
  Content,
  Title,
  UpdatedDate,
}) => {
  const { width, height } = Dimensions.get("window");
  const widthImage = (width * 20) / 100;
  const widthContent = (width * 90) / 100;
  return (
    <BlurView
      className="flex-row"
      style={{
        height: widthImage,
        borderRadius: 24,
        width: widthContent,
        backgroundColor: Colors.glass.blue,

        overflow: "hidden",
        ...styles.shadowSelected,
      }}
      intensity={90}
      tint="dark"
    >
      <Image
        source={{ uri: ImageUrl }}
        style={{
          width: widthImage,
          height: widthImage,
          borderRadius: 24,
        }}
      />
      <View className="ml-2 flex-1 pr-2 justify-between pb-1">
        <View>
          <Text className="font-bold text-lg text-yellow-100 mb-2">
            {Title}
          </Text>
          <Text
            numberOfLines={2}
            className="flex-wrap font-hnow64regular text-white text-ellipsis"
          >
            {Content}
          </Text>
        </View>
        <View className="flex-row justify-end items-end">
          <Text className="text-xs text-gray-300">
            {formatDateTime(UpdatedDate)}
          </Text>
        </View>
      </View>
    </BlurView>
  );
};

export default NotifyFisebaseForegroundItem;
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
