import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Divider, Surface } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { Colors } from "../constant";
import { formatDateTime } from "../utils/MyUtils";
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[400],

    shadowOpacity: 0.1,
    elevation: 1,
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
const ReviewInShopPageItem = ({ item }) => {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const { width, height } = Dimensions.get("window");
  const widthItem = (width * 10) / 100;

  const widthImage2 = (width * 22) / 100;
  useEffect(() => {
    console.log(item, "item ne");
    if (item) {
      if (item.reviews && Array.isArray(item.reviews)) {
        for (const review of item.reviews) {
          console.log(review);
          if (review.reviewer == 1) {
            setUser(review);
          } else {
            setShop(review);
          }
        }
      }
    }
  }, [item]);
  console.log(user);
  return user == null ? (
    <></>
  ) : (
    <View>
      <View
        className="rounded-xl bg-white p-4 mx-2"
        style={{
          ...styles.shadow,
        }}
      >
        <View className="flex-row">
          <Image
            source={{
              uri: user.avatar,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
            }}
          />
          <View className="flex-1 ml-2">
            <View className="flex-row justify-between items-start flex-1">
              <Text className="font-bold">{user.name}</Text>
              <Text className="text-gray-500 text-xs">
                {formatDateTime(user.createdDate)}
              </Text>
            </View>
            <View
              style={{
                flexShrink: 1,
              }}
            >
              <Rating
                style={{
                  padding: 0,
                  margin: 0,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
                readonly
                startingValue={user.rating}
                imageSize={12}
              />
            </View>
          </View>
        </View>
        <Divider className="my-2" />
        <View>
          <View className="">
            <Text className="flex-wrap ">{user.comment}</Text>
          </View>
          <View className="flex-row justify-between items-end">
            {user.imageUrls && Array.isArray(user.imageUrls) && (
              <View className="flex-row flex-wrap bg-transparent justify-between">
                <FlatList
                  contentContainerStyle={{}}
                  data={user.imageUrls}
                  scrollEnabled={false}
                  numColumns={3}
                  renderItem={({ item, index }) => {
                    return (
                      <Surface
                        elevation={2}
                        style={{
                          overflow: "hidden",
                          width: widthImage2,
                          height: widthImage2,
                          margin: 10,
                          borderRadius: 24,
                        }}
                      >
                        <Image
                          source={{ uri: item }}
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover",
                          }}
                        />
                      </Surface>
                    );
                  }}
                />
              </View>
            )}
          </View>
          <View className="flex-1 items-end">
            <Text
              className="text-green-600 text-xs flex-wrap text-ellipsis"
              numberOfLines={1}
            >
              #{item.orderId} {item.description}
            </Text>
          </View>
        </View>
      </View>
      {shop == null ? (
        <></>
      ) : (
        <>
          <View className="flex-row p-6 ">
            <Divider
              style={{
                width: 0.5,
                height: "100%",
                marginRight: 10,
              }}
            />
            <View className="rounded-xl mx-2" style={{}}>
              <View className="flex-row">
                <Image
                  source={{
                    uri: shop.avatar,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                  }}
                />
                <View className="flex-1 ml-2">
                  <View className="flex-row justify-between items-start">
                    <View className="justify-between flex-1">
                      <Text className="font-bold">{shop.name}</Text>
                      <Text className="text-gray-600 text-xs">
                        Trả lời từ shop
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-xs">
                      {formatDateTime(shop.createdDate)}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider className="my-2" />
              <View>
                <View className="">
                  <Text className="flex-wrap ">{shop.comment}</Text>
                </View>
                <View className="flex-row justify-between items-end">
                  {shop.imageUrls && Array.isArray(shop.imageUrls) && (
                    <View className="flex-row flex-wrap bg-transparent justify-between">
                      <FlatList
                        contentContainerStyle={{}}
                        data={shop.imageUrls}
                        scrollEnabled={false}
                        numColumns={3}
                        renderItem={({ item, index }) => {
                          return (
                            <Surface
                              elevation={2}
                              style={{
                                overflow: "hidden",
                                width: widthImage2,
                                height: widthImage2,
                                margin: 10,
                                borderRadius: 24,
                              }}
                            >
                              <Image
                                source={{ uri: item }}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  resizeMode: "cover",
                                }}
                              />
                            </Surface>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default ReviewInShopPageItem;
