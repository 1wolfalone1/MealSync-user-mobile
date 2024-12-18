import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import SkeletonLoading from 'expo-skeleton-loading';
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

const ItemShopRegulerInHome = ({ item }) => {
  const { width, height } = Dimensions.get('window');
  const widthItem = parseInt((width * 65) / 100);
  const heightImage = parseInt((widthItem * 65) / 100);

  console.log(widthItem);
  return item == null ? (
    <SkeletonItem />
  ) : (
    <View
      key={item.id}
      className={`flex justify-start items-center bg-white rounded-2xl  mr-5 mb-10`}
      style={{
        ...styles.shadow,
        width: widthItem,
      }}
    >
      <TouchableRipple
        onPress={() =>
          router.push({
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
        <View className="flex-1">
          <View
            className=" bg-black-100  overflow-hidden rounded-t-2xl "
            style={{
              height: heightImage,
              width: widthItem
            }}
          >
            <View className="absolute top-2 left-2 bg-glass-100 flex-row rounded-full p-1.5 z-[1] items-center">
              <Text className="font-hnow64regular text-sm text-white mx-1">{item.averageRating}</Text>
              <AntDesign name="star" size={14} color={Colors.star.defaut} />
              <Text className="font-hnow64regular text-xs ml-1 text-gray-300"> trong {item.totalOrder} đã bán </Text>
            </View>
            <View className="rounded-full bg-primary absolute right-2 top-2 w-23 p-1.5 z-[1]">
              <AntDesign name="heart" size={18} color="white" />
            </View>
            <Image
              source={{
                backgroundColor: 'black',
                uri: item.bannerUrl,
              }}
              resizeMode="cover"
                 style={{
                  width: widthItem,
                  height: heightImage,
                }}
            />
          </View>
          <View className="p-3 items-start  flex-1"
          
          style={{
            width: widthItem,
          }}
          >
            <View className="flex-row">
              <Avatar.Image
                className="bg-transparent"
                size={24}
                source={{
                  uri: item.logoUrl,
                }}
             
              />
              <View className="ml-2">
                <Text className="text-sm font-hnow65medium">{item.name}</Text>
                <Text style className="text-xs text-gray-600 font-hnow64regular">
                  {item.description}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between w-full items-center flex-1 items-end">
              <Text style className="text-xs text-gray-400 font-hnow64regular">
                {item.buildingName}
              </Text>
            </View>
            <View className="flex-row">
                <Text className="flex-wrap flex-1 text-xs text-gray-500" numberOfLines={1}>
                 {item.address} 
                </Text>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
};

export default ItemShopRegulerInHome;
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
