import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { Divider, ProgressBar } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { useDispatch } from "react-redux";
import api from "../api/api";
import ReviewInShopPageItem from "../components/ReviewInShopPageItem";
import globalSlice from "../redux/slice/globalSlice";

const ShopReview = () => {
  const [reviewOverview, setReviewOrderView] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { shopId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const getReviewOverview = async () => {
    try {
      const res = await api.get(`api/v1/shop/${shopId}/review/overview`);
      const data = await res.data;
      setReviewOrderView(data.value);
    } catch (e) {
      console.log(e);
    }
  };
  const percentStar = (number) => {
    const total =
      reviewOverview.totalOneStar +
      reviewOverview.totalTwoStar +
      reviewOverview.totalThreeStar +
      reviewOverview.totalFourStar +
      reviewOverview.totalFiveStar;
    if (total == 0) {
      return 0;
    }
    return number / total;
  };
  const getReviews = async () => {
    try {
      const res = await api.get(
        `api/v1/shop/${shopId}/review?filter=1&pageIndex=1&pageSize=20`
      );
      const data = await res.data;
      console.log(data.value.items, "list review")
      setReviews(data.value.items);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getReviewOverview();
    getReviews();
    
    dispatch(globalSlice.actions.changeStateOpenFabInShop(false));
    return () => {
      dispatch(globalSlice.actions.changeStateOpenFabInShop(true));
    };
  }, []);
  return (
    <>
      {reviewOverview == null ? (
        <></>
      ) : (
        <ScrollView
          className="flex-grow "
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#fdfafa",
          }}
        >
          <View className="justify-center items-center my-3 mt-4">
            <Text className="text-3xl font-bold">
              {reviewOverview.ratingAverage}
            </Text>
          </View>
          <Rating
            ratingCount={5}
            imageSize={40}
            jumpValue={1}
            readonly
            startingValue={reviewOverview.ratingAverage}
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
                  progress={percentStar(reviewOverview.totalFiveStar)}
                  color={"#beeb56"}
                />
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="font-bold text-lg mr-2">😊</Text>
              <View className="flex-1">
                <ProgressBar
                  progress={percentStar(reviewOverview.totalFourStar)}
                  color={"#beeb56"}
                />
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="font-bold text-lg mr-2">😀</Text>
              <View className="flex-1">
                <ProgressBar
                  progress={percentStar(reviewOverview.totalThreeStar)}
                  color={"#beeb56"}
                />
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="font-bold text-lg mr-2">😐</Text>
              <View className="flex-1">
                <ProgressBar
                  progress={percentStar(reviewOverview.totalTwoStar)}
                  color={"#beeb56"}
                />
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="font-bold text-lg mr-2">😞</Text>
              <View className="flex-1">
                <ProgressBar
                  progress={percentStar(reviewOverview.totalOneStar)}
                  color={"#beeb56"}
                />
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
                  width: "100%",
                  height: 0,
                  padding: 5,
                  backgroundColor: "#f5f5f500",
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
