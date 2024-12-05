import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import OrderHistoryItem from '../../../components/order-history/OrderHistoryItem';
import {
  getListOrderHistory,
  orderHistorySliceSelector,
} from '../../../redux/slice/orderHistorySlice';
import { userInfoSliceSelector } from '../../../redux/slice/userSlice';

const emptyList = new Array(5).fill(null);
const OrderHistory = () => {
  const isFocus = useIsFocused();
  const userInfo = useSelector(userInfoSliceSelector);
  const { listOrderHistory } = useSelector(orderHistorySliceSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getListOrderHistory({ accountId: userInfo.id, pageIndex: 1, pageSize: 20 }));

  }, [isFocus]);
  return (
    <SafeAreaView edges={['bottom']} className="bg-gray-50 flex-1">
      <FlatList
        data={listOrderHistory ?  listOrderHistory: emptyList}
        contentContainerStyle={{
          alignItems: 'center',
          marginTop: 50,
          paddingBottom: 100,
        }}

        renderItem={({ item }) => <OrderHistoryItem item={item} />}
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

export default OrderHistory;
