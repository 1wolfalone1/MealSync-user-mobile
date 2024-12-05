import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { formatDateTime } from '../../utils/MyUtils';

const ItemInPageNotify = ({ item }) => {
  const { width, height } = Dimensions.get('window');
  const heightItem = (width * 20) / 100;
  const heightImage = (heightItem * 50) / 100;
  return item == null ? (
    <SkeletonItem />
  ) : (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 16,
        backgroundColor: item.id == 2 || item.id == 5 ? '#e0fcff' : 'white',
        paddingVertical: 10,
      }}
    >
      <Image
        source={{
          uri: item.imageUrl,
        }}
        style={{
          height: heightImage,
          width: heightImage,
          borderRadius: 1000,
        }}
      />
      <View className="ml-4 flex-1 pr-4">
        <View className="flex-row justify-between">
          <Text className="font-bold text-lg text-primary mb-2">{item.title}</Text>
        </View>
        <View className="flex-row justify-between items-start">
          <Text
            numberOfLines={2}
            className="flex-wrap font-hnow64regular text-gray-700 text-ellipsis"
          >
            {item.content}
          </Text>
        </View>
      </View>
      <View className="items-end justify-end">
        <Text className="text-xs text-blue-400">{formatDateTime(item.createdDate)}</Text>
        <IconButton icon={'dots-vertical'} onPress={() => {}} />
      </View>
    </View>
  );
};

export default ItemInPageNotify;

const SkeletonItem = () => {
  return <></>;
};
