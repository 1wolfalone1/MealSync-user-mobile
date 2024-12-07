import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import SkeletonLoading from 'expo-skeleton-loading';
import { MoveRight } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Avatar, TouchableRipple } from 'react-native-paper';
import { Colors } from '../../constant';
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

const ShopLikeItem = ({ item }) => {
  const { width, height } = Dimensions.get('window');
  const widthItem = parseInt((width * 80) / 100);
  const heightImage = parseInt((widthItem * 65) / 100);
  console.log(item, 'asdfasfasdf')
  console.log(widthItem);
  return item == null ? (
    <SkeletonItem />
  ) : (
    <View
      key={item.id}
      className={`flex justify-start items-center bg-white rounded-2xl  mb-10`}
      style={{
        ...styles.shadow,
        width: widthItem,
      }}
    >
      <TouchableRipple
        onPress={() =>
          router.navigate({
            pathname: '/shop',
            params: {
              shopId: item.id,
            },
          })
        }
        borderless
        style={{
          borderRadius: 16,
        }}
      >
        <View>
          <View
            className="w-full bg-black-100 overflow-hidden rounded-t-2xl "
            style={{
              height: heightImage,
            }}
          >
            <View className="absolute top-2 left-2 bg-glass flex-row rounded-full p-1.5 z-[1]">
              <Text className="font-hnow64regular text-xs ">{item.rating}</Text>
              <AntDesign name="star" size={14} color={Colors.star.defaut} />
              <Text className="font-hnow64regular text-xs text-gray-700">(25+)</Text>
            </View>
            <View className="rounded-full bg-primary absolute right-2 top-2 w-23 p-1.5 z-[1]">
              <AntDesign name="heart" size={18} color="white" />
            </View>
            <Image
              source={{
                uri: item.bannerUrl,
              }}
              resizeMode="cover"
              className="w-full h-full z-[0]"
              style={{
                backgroundColor: 'black',
                width: widthItem,
                height: widthItem,
              }}
            />
          </View>
          <View className="p-3 items-start w-full gap-1">
            <View className="flex-row">
              <Avatar.Image
                className="bg-transparent"
                size={24}
                source={{
                  uri: item.logoUrl,
                }}
              />
              <View className="ml-2 flex-row justify-between flex-1">
                <View>
                  <Text className="text-sm font-hnow65medium">{item.name}</Text>
                  <Text style className="text-xs text-gray-600 font-hnow64regular">
                    {item.description}
                  </Text>
                </View>
                <View className="flex-row gap-1 items-center">
                  <MaterialIcons name="schedule" size={16} color="green" />
                  <Text className="text-xs text-blue-600">{item.activeFrom}h</Text>
                  <MoveRight color={'blue'} size={20} />
                  <Text className="text-xs text-blue-600">{item.activeTo}h</Text>
                </View>
              </View>
            </View>
            <View className="flex-row gap-2 justify-between w-full items-center">
              <Text className="text-xs font-hnow65medium text-primary">12k - 30k</Text>
              <Text style className="text-xs text-gray-400 font-hnow64regular">
                {item.buildingName}
              </Text>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
};

export default ShopLikeItem;
const SkeletonItem = () => {
  const { width, height } = Dimensions.get('window');
  const widthItem = parseInt((width * 65) / 100);
  const heightImage = parseInt((widthItem * 65) / 100);
  return (
    <SkeletonLoading background={Colors.skeleton.bg} highlight={Colors.skeleton.hl}>
      <View
        style={{
          width: widthItem,
          justifyContent: 'start',
          borderRadius: 16,
          marginRight: 20,
          marginBottom: 40,
          backgroundColor: 'white',
          ...styles.shadow,
        }}
      >
        <View
          style={{
            height: heightImage,
            width: widthItem,
            backgroundColor: Colors.skeleton.bg,
          }}
          borderRadius={16}
        />
        <View flexDirection="column" padding={12} gap={4} alignItems="start" justifyContent="start">
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{ width: 14, height: 14, backgroundColor: Colors.skeleton.bg }}
              borderRadius={50}
            />
            <View flexDirection="column" flex={1} gap={2} marginBottom={4}>
              <Text
                style={{
                  borderRadius: 20,
                  fontSize: 14,
                  lineHeight: 18,
                  backgroundColor: Colors.skeleton.bg,
                }}
              ></Text>
              <Text
                style={{
                  borderRadius: 20,
                  fontSize: 14,
                  lineHeight: 18,
                  backgroundColor: Colors.skeleton.bg,
                }}
              ></Text>
            </View>
          </View>
          <Text
            style={{ borderRadius: 20, fontSize: 14, backgroundColor: Colors.skeleton.bg }}
            borderRadius={50}
          ></Text>
        </View>
      </View>
    </SkeletonLoading>
  );
};
