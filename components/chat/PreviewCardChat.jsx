import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "../../constant";
import { formatDateTime } from "../../utils/MyUtils";
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
const PreviewCardChat = ({ item }) => {
  const { width, height } = Dimensions.get("window");
  const widthImage = (width * 20) / 100;
  const widthItem = (width * 90) / 100;
  return (
    item != null && (
      <View
        style={{
          borderRadius: 16,
          backgroundColor:  item.map_user_is_read[item.info.id]
                      ? "#dffff3"
                      : "white",
          
          ...styles.shadow,
        }}
      >
        <TouchableRipple
          borderless
          onPress={() => router.push("/chat/" + item.id)}
          style={{
            borderRadius: 16,
          }}
        >
          <View
            className="flex-row "
            style={{
              width: widthItem,
              height: widthImage,
            }}
          >
            <Image
              source={{
                uri: item.info.avatarUrl,
              }}
              style={{
                height: widthImage,
                width: widthImage,
                borderRadius: 16,
              }}
            />
            <View className=" pl-4 gap-2 pr-3 pt-2 flex-1">
              <View className="flex-row justify-between items-start">
                <Text className="text-lg font-bold text-blue-800">
                  {item.info.fullName}
                  <Text className="text-lg text-gray-400">#{item.id}</Text>
                </Text>
              </View>
              <View className="flex-1 pr-2 flex-row">
                <Text
                  numberOfLines={1}
                  className="flex-wrap flex-1 text-sm text-gray-600 text-ellipsis"
                  style={{
                    fontWeight: item.map_user_is_read[item.info.id]
                      ? 400
                      : "bold",
                  }}
                >
                  {item.last_message}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-gray-500">
                  {formatDateTime(item.updated_at)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableRipple>
      </View>
    )
  );
};

export default PreviewCardChat;
