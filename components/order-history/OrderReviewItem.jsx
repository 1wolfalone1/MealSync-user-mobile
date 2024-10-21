import { router } from 'expo-router';
import SkeletonLoading from 'expo-skeleton-loading';
import { HandCoins, MoveRight, Star } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Colors } from '../../constant';
import orderHistorySlice from '../../redux/slice/orderHistorySlice';
import { formatNumberVND } from '../../utils/MyUtils';

const OrderReviewItem = ({ item }) => {
  const { width, height } = Dimensions.get('window');
  const dispatch = useDispatch();
  const heightItem = (width * 30) / 100;
  const widthItem = (width * 90) / 100;
  const formatDate = (originalDateString) => {
    const date = new Date(originalDateString);

    // Formatting options
    const options = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date
      .toLocaleDateString('en-GB', options)
      .replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+)/, '$1/$2/$3 $4:$5');
  };
  return item == null ? (
    <SkeletonItem />
  ) : (
    <View
      className=""
      style={{
        borderRadius: 16,
        backgroundColor: 'white',
        overflow: 'hidden',
      }}
    >
      <TouchableRipple
        onPress={() => {
          dispatch(orderHistorySlice.actions.changeOrderReviewDetails({
            shopName: item.shopName,
            logoUrl: item.logoUrl,
          }))
          router.push({
          pathname: '/review-form',
          params: {
            orderId: item.orderId,
          },
        })
        }}
        borderless
        style={{
          borderRadius: 16,
          height: heightItem,
          width: widthItem,
        }}
      >
        <View
          className="flex-row "
          style={{
            height: widthItem,
            width: widthItem,
            borderRadius: 16,
          }}
        >
          <Image
            source={{
              uri: item.logoUrl,
            }}
            style={{
              height: heightItem,
              width: heightItem,
            }}
          />
          <View className="justify-between mx-2 flex-1 pb-1" style={{ height: heightItem }}>
            <View className="flex-row  justify-between">
              <Text className="text-primary text-lg font-bold">{item.shopName}</Text>

            </View>
            <View className="flex-row justify-between">
              <Text className="text-blue-700">
                <HandCoins color={'red'} size={16} /> {formatNumberVND(item.totalOrderValue)}
              </Text>
              <Text className="text-xs text-gray-600">
                Số lượng món: {item.productOrderQuantity}
              </Text>
            </View>
            <View className="flex-row gap-1 justify-between">
              
              <Text className="text-blue-700">{formatDate(item.orderDate)}</Text>
               <MoveRight size={20} color={'grey'} />
              <Text className="text-red-700">{formatDate(item.endDate)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-500">Mã đơn hàng: #{item.orderId}</Text>
              <View className="flex-row items-center gap-1">
                <Star color={'#e8eb56'} size={14} />
                <Text className="text-xs text-yellow-500">Chờ đánh giá</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
};

export default OrderReviewItem;

const SkeletonItem = () => {
  return (
    <SkeletonLoading>
      <View></View>
    </SkeletonLoading>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[100],

    shadowOpacity: 0.4,
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
