import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import OrderReviewItem from '../../../../components/order-history/OrderReviewItem';
import {
  getListOrderReview,
  orderHistorySliceSelector,
} from '../../../../redux/slice/orderHistorySlice';
import { userInfoSliceSelector } from '../../../../redux/slice/userSlice';

const OrderReviewList = () => {
  const isFocus = useIsFocused();
  const userInfo = useSelector(userInfoSliceSelector);
  const { listOrderReview } = useSelector(orderHistorySliceSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getListOrderReview({ accountId: userInfo.id, pageIndex: 1, pageSize: 20 }));
    console.log(listOrderReview, 'orderHistory');
  }, [isFocus]);
  return (
    <SafeAreaView edges={['bottom']} style={{
      flex: 1,
      backgroundColor: '#f5f5f5',
     
    }}>
      <FlatList
        data={listOrderReview ? listOrderReview : emptyList}
        contentContainerStyle={{
          alignItems: 'center',
          marginTop: 50,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => <OrderReviewItem item={item} />}
        ItemSeparatorComponent={() => (
          <Divider
            style={{
              height: 0,
              marginVertical: 10,
              backgroundColor: '#b1b1b1',
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default OrderReviewList;
