import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { Divider, ProgressBar } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import api from '../api/api';
import ReviewInShopPageItem from '../components/ReviewInShopPageItem';

const ShopReview = () => {
  const [reviewOverview, setReviewOrderView] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { shopId } = useLocalSearchParams();
  const getReviewOverview = async () => {
    try {
      const res = await api.get(`api/v1/customer/shop/${shopId}/feedback/overview`);
      const data = await res.data;
      setReviewOrderView(data.value);
    } catch (e) {
      console.log(e);
    }
  };
  const percentStar = (number) => {
    const total =
      reviewOverview.totalExcellent +
      reviewOverview.totalGood +
      reviewOverview.totalAverage +
      reviewOverview.totalBellowAverage +
      reviewOverview.totalPoor;
    if (total == 0) {
      return 0;
    }
    return number / total;
  };
  const getReviews = async () => {
    try {
      const res = await api.get(`api/v1/customer/shop/${shopId}/feedback?pageIndex=1&pageSize=20`);
      const data = await res.data;
      setReviews(data.value.items);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getReviewOverview();
    getReviews();
  }, []);
  return (
    <>
      {reviewOverview == null ? (
        <></>
      ) : (
        <ScrollView className="flex-grow "
       contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#fdfafa',
       }} 
        >
          <View className="justify-center items-center my-3 mt-4">
            <Text className="text-3xl font-bold">{reviewOverview.shopRatingAverage}</Text>
          </View>
          <Rating
            ratingCount={5}
            imageSize={40}
            jumpValue={1}
            readonly
            startingValue={reviewOverview.shopRatingAverage}
          />
          <View className="justify-center items-center my-3">
            <Text className="text-gray-500 text-lg">
              Dựa trên {reviewOverview.shopTotalFeedback} đánh giá
            </Text>
          </View>
          <View className="px-8">
            <View className="flex-row items-center">
              <Text className="font-bold text-lg mr-2">😍</Text>
              <View className="flex-1">
                <ProgressBar
                  progress={percentStar(reviewOverview.totalExcellent)}
                  color={'#beeb56'}
                />
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="font-bold text-lg mr-2">😊</Text>
              <View className="flex-1">
                <ProgressBar progress={percentStar(reviewOverview.totalGood)} color={'#beeb56'} />
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="font-bold text-lg mr-2">😀</Text>
              <View className="flex-1">
                <ProgressBar
                  progress={percentStar(reviewOverview.totalAverage)}
                  color={'#beeb56'}
                />
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="font-bold text-lg mr-2">😐</Text>
              <View className="flex-1">
                <ProgressBar
                  progress={percentStar(reviewOverview.totalBellowAverage)}
                  color={'#beeb56'}
                />
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="font-bold text-lg mr-2">😞</Text>
              <View className="flex-1">
                <ProgressBar progress={percentStar(reviewOverview.totalPoor)} color={'#beeb56'} />
              </View>
            </View>
          </View>
          <FlatList
            data={reviews}
            scrollEnabled={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 20,
            }}
            renderItem={({ item }) => <ReviewInShopPageItem item={item} />}
            ItemSeparatorComponent={() => (
              <Divider
                style={{
                  width: '100%',
                  height: 0,
                  padding: 5,
                  backgroundColor: '#f5f5f500',
                }}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>
      )}
    </>
  );
};

export default ShopReview;
