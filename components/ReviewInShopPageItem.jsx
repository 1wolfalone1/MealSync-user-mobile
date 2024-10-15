import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import { Colors } from '../constant';
import { formatDateTime } from '../utils/MyUtils';
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
  const { width, height } = Dimensions.get('window');
  const widthItem = (width * 10) / 100;
  return (
    <View
      className="rounded-xl bg-white p-4 mx-2"
      style={{
        ...styles.shadow,
      }}
    >
      <View className="flex-row">
        <Image
          source={{
            uri: item.accountAvartar,
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 100,
          }}
        />
        <View className="flex-1 ml-2">
          <View className="flex-row justify-between items-start flex-1">
            <Text className="font-bold">{item.accountName}</Text>
            <Text className="text-gray-500 text-xs">{formatDateTime(item.createdDate)}</Text>
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
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
              readonly
              startingValue={item.rating}
              imageSize={12}
            />
          </View>
        </View>
      </View>
      <Divider className="my-2" />
      <View>
        <View className="">
          <Text className="flex-wrap ">{item.comment}</Text>
        </View>
        <View className="flex-row justify-between items-end">
          {item.images && Array.isArray(item.images) && item.images[0] != '' ? (
            <Image
              source={{
                uri: item.images[0],
              }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 10,
              }}
            />
          ): <View>
            </View>}
          <Text className="text-green-600 text-xs">{item.productOrders}</Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewInShopPageItem;
