import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, Image, View } from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import OrderReviewItem from "../../../../components/order-history/OrderReviewItem";
import {
  getListOrderReview,
  orderHistorySliceSelector,
} from "../../../../redux/slice/orderHistorySlice";
import { userInfoSliceSelector } from "../../../../redux/slice/userSlice";

const OrderReviewList = () => {
  const isFocus = useIsFocused();
  const userInfo = useSelector(userInfoSliceSelector);
  const { listOrderReview } = useSelector(orderHistorySliceSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getListOrderReview({ accountId: userInfo.id, pageIndex: 1, pageSize: 20 })
    );
    console.log(listOrderReview, "orderHistory");
  }, [isFocus]);
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
      }}
      className="mb-10"
    >
      {listOrderReview && listOrderReview.length > 0 ? (
        <FlatList
          data={listOrderReview ? listOrderReview : emptyList}
          style={{}}
          contentContainerStyle={{
            alignItems: "center",
            marginTop: 50,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => <OrderReviewItem item={item} />}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                height: 0,
                marginVertical: 10,
                backgroundColor: "#b1b1b1",
              }}
            />
          )}
          showsHorizontalScrollIndicator={false}
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

export default OrderReviewList;
