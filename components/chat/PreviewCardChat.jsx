import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { useSelector } from "react-redux";
import { Colors } from "../../constant";
import { userInfoSliceSelector } from "../../redux/slice/userSlice";
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
  const userInfo = useSelector(userInfoSliceSelector);
  const widthImage = (width * 18) / 100;
  const widthItem = (width * 90) / 100;
  return (
    item != null && (
      <View
        style={{
          borderRadius: 16,
          backgroundColor: !item.map_user_is_read[userInfo.id]
            ? "#dffff3"
            : "white",

          ...styles.shadow,
        }}
      >
        <TouchableRipple
          borderless
          onPress={() => router.push({
            pathname: "/chat/" + item.id,
            params: {
              isClose: item.is_close == 1 ? false : true
            },
          })}
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
            <View className=" pl-4 gap-2 pr-3 pt-1 flex-1">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-bold text-blue-800">
                  Đơn hàng mã số
                  <Text className="text-base text-gray-400">#{item.id}</Text>
                
                </Text>
                  {
                    item.is_close == 2 && (
                      <Text
                        className="text-xs text-red-600"
                      >
                        Đã đóng
                      </Text>
                    )
                  }
              </View>
              <View className="flex-1 pr-2 flex-row">
                <Text
                  numberOfLines={1}
                  className="flex-wrap flex-1 text-xs text-gray-600 text-ellipsis"
                  style={{
                    fontWeight: item.map_user_is_read[userInfo.id]
                      ? 400
                      : "bold",
                  }}
                >
                  ~{item.info.fullName}:{" "}
                  <Text
                    className="text-xs text-gray-950"
                    style={{
                      fontWeight: item.map_user_is_read[userInfo.id]
                        ? 400
                        : "bold",
                    }}
                  >
                    {item.last_message}
                  </Text>
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
