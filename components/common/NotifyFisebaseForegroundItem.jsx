import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Surface } from "react-native-paper";
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
    <Surface
      className="flex-row"
      elevation={3}
      style={{
        height: widthImage,
        borderRadius: 24,
        width: widthContent,

        backgroundColor: "white",

        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: widthImage,
          height: widthImage,
          padding: 10,
          borderRadius: 24,
        }}
      >
        <Image
          source={{ uri: ImageUrl }}
          style={{
            width: widthImage -20 ,
            height: widthImage -20,
            borderRadius: 24,
          }}
        />
      </View>
      <View className="ml-2 flex-1 pr-2 justify-between pb-1">
        <View>
          <Text className="font-bold text-lg text-gray-800 mb-2">{Title}</Text>
          <Text
            numberOfLines={2}
            className="flex-wrap font-hnow64regular text-lime-900 text-ellipsis"
          >
            {Content}
          </Text>
        </View>
        <View className="flex-row justify-end items-end">
          <Text className="text-xs text-gray-700">
            {formatDateTime(UpdatedDate)}
          </Text>
        </View>
      </View>
    </Surface>
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
