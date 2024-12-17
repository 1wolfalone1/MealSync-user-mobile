import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { ActivityIndicator, Divider, ProgressBar } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import api from "../api/api";
import ReviewInShopPageItem from "../components/ReviewInShopPageItem";
import usePagination from "../custom-hook/usePagination";
import usePullToRefresh from "../custom-hook/usePullToRefresh";
import globalSlice from "../redux/slice/globalSlice";

const ShopReview = () => {
  const [reviewOverview, setReviewOrderView] = useState(null);
  const [reviews, setReviews] = useState(null);
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
  const [total, setTotal] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const { refreshing, onRefreshHandler } = usePullToRefresh({
    onRefreshFunction() {
      setCurrentPage(1);
      setTotal(0);
      getReviews(1, 5);
    },
  });
  const { currentPage, handleEndReached, setCurrentPage } = usePagination({
    fetchFunction: () => {
      console.log(" asfdasd" + currentPage);
      getReviews(currentPage + 1, 5);
    },
    setLoading: setLoading,
    totalPages: total,
    initialPage: 1,
  });
  console.log(total, " total");
  const getReviews = async (pageIndex, pageSize) => {
    try {
      const res = await api.get(
        `api/v1/shop/${shopId}/review?filter=1&pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
      const data = await res.data;
      console.log(data, " data ne");
      console.log(data.value.items, "list review");
      if (data.isSuccess) {
        setTotal(data.value.totalPages);

        if (pageIndex == 1) {
          setReviews(data.value.items);
        } else {
          if (pageIndex > total) {
            return;
          }
          setReviews([...reviews, ...data.value.items]);
        }
      }
    } catch (e) {
      console.log(e, "errror ne");
    }
  };
  useEffect(() => {
    getReviewOverview();
    getReviews(1, 5);

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
        <SafeAreaView className="bg-white flex-1" edges={["bottom"]}>
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
              Dựa trên {reviewOverview.totalReview} đánh giá
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
            style={{
            }}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 20,
              paddingBottom: 100
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
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator size="small" className="mt-4" />
              ) : null
            }
            scrollEventThrottle={40}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshHandler}
              />
            }
            showsHorizontalScrollIndicator={false}
          />
        </SafeAreaView>
      )}
    </>
  );
};

export default ShopReview;
