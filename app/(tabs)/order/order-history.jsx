import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, View } from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import OrderHistoryItem from "../../../components/order-history/OrderHistoryItem";
import usePagination from "../../../custom-hook/usePagination";
import usePullToRefresh from "../../../custom-hook/usePullToRefresh";
import {
  getListOrderHistory,
  orderHistorySliceSelector,
} from "../../../redux/slice/orderHistorySlice";
import { userInfoSliceSelector } from "../../../redux/slice/userSlice";

const emptyList = new Array(5).fill(null);
const OrderHistory = () => {
  const isFocus = useIsFocused();
  const userInfo = useSelector(userInfoSliceSelector);
  const { listOrderHistory } = useSelector(orderHistorySliceSelector);
  const dispatch = useDispatch();
  const { totalPage2 } = useSelector(orderHistorySliceSelector);
  const [isLoading, setLoading] = useState(true);
  const { refreshing, onRefreshHandler } = usePullToRefresh({
    onRefreshFunction() {
      setCurrentPage(1);
      dispatch(
        getListOrderHistory({
          accountId: userInfo.id,
          pageIndex: 1,
          pageSize: 5,
        })
      );
    },
  });
  const { currentPage, handleEndReached, setCurrentPage } = usePagination({
    fetchFunction: () => {
      console.log(" asfdasd" + currentPage);
      dispatch(
        getListOrderHistory({
          accountId: userInfo.id,
          pageIndex: currentPage + 1,
          pageSize: 5,
        })
      );
    },
    setLoading: setLoading,
    totalPages: totalPage2,
    initialPage: 1,
  });
  useEffect(() => {
    setCurrentPage(1);
    dispatch(
      getListOrderHistory({
        accountId: userInfo.id,
        pageIndex: 1,
        pageSize: 5,
      })
    );
  }, [isFocus]);

  console.log(currentPage, " curretn 2");
  return (
    <SafeAreaView edges={["bottom"]} className="bg-gray-50 flex-1 pb-10">
      {listOrderHistory && listOrderHistory.length > 0 ? (
        <FlatList
          data={listOrderHistory ? listOrderHistory : emptyList}
          contentContainerStyle={{
            alignItems: "center",
            marginTop: 50,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => <OrderHistoryItem item={item} />}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                height: 0,
                marginVertical: 10,
                backgroundColor: "#413030",
              }}
            />
          )}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            isLoading ? (
              <ActivityIndicator size="small" className="mt-4" />
            ) : null
          }
          scrollEventThrottle={50}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefreshHandler}
            />
          }
        />
      ) : (
        <View className="bg-white">
          <Image
            source={{
              uri: "https://mealsync.s3.ap-southeast-1.amazonaws.com/image/1733499620542-31f95bbb-52c8-41b2-af5a-b7eb7960942c.png",
            }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderHistory;
