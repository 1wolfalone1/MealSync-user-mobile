import { router } from 'expo-router';
import SkeletonLoading from 'expo-skeleton-loading';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { Colors } from '../../constant';
import { formatNumberVND } from '../../utils/MyUtils';
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[400],

    shadowOpacity: 0.1,
    elevation: 4,
    // background color must be set
  },
  shadow2: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[300],

    shadowOpacity: 0.1,
    elevation: 10,
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

const ItemAllProductInShop = ({ item }) => {
  const { width, height } = Dimensions.get('window');
  const widthItem = parseInt((width * 40) / 100);

  return item == null ? (
    <SkeletonItem />
  ) : (
    <View className="flex my-4" style={{ borderRadius: 16 }}>
      <View
        style={{
          borderRadius: 16,
          backgroundColor: 'black',
          ...styles.shadow,
        }}
      >
        <Image
          style={{
            borderRadius: 16,
            height: widthItem,
            width: widthItem,
            backgroundColor: 'black',
          }}
          source={{
            uri: item.imageUrl,
          }}
        />
        <TouchableRipple
          style={{
            borderRadius: 50,
            backgroundColor: 'red',
            ...styles.shadow2,
            padding: 5,
          }}
          className="absolute bottom-2 right-2"
          onPress={() => router.push('/shop/' + item.id, {})}
        >
          <Plus color="white" size={30} />
        </TouchableRipple>
      </View>
      <View className="flex gap-1 mt-1 ">
        <View className="">
          <Text className="font-hnow65medium text-sm">{item.name}</Text>
        </View>
        <View>
          <Text className="text-primary text-lg">{formatNumberVND(item.price)}</Text>
        </View>
      </View>
    </View>
  );
};

export default ItemAllProductInShop;

const SkeletonItem = () => {
  const { width, height } = Dimensions.get('window');
  const widthItem = parseInt((width * 40) / 100);

  return (
    <SkeletonLoading background={Colors.skeleton.bg} highlight={Colors.skeleton.hl}>
      <View className="flex my-4" style={{ borderRadius: 16, marginVertical: 16 }}>
        <View
          style={{
            borderRadius: 16,
            backgroundColor: 'black',
            ...styles.shadow,
          }}
        >
          <View
            style={{
              borderRadius: 16,
              backgroundColor: 'black',
              height: widthItem,
              width: widthItem,
              backgroundColor: Colors.skeleton.bg,
            }}
          />
        </View>
        <View
          className="flex gap-1 mt-1 "
          style={{
            gap: 4,
            marginTop: 4,
          }}
        >
          <View style={{ height: 16, width: 60 }} />

          <View style={{ height: 16, width: 60 }} />
        </View>
      </View>
    </SkeletonLoading>
  );
};
