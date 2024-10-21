import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import OrderTrackingItem from '../../../../components/order-history/OrderTrackingItem';
import { getListOrderTracking, orderHistorySliceSelector } from '../../../../redux/slice/orderHistorySlice';
import { userInfoSliceSelector } from '../../../../redux/slice/userSlice';


const index = () => {
  const isFocus = useIsFocused();
  const userInfo = useSelector(userInfoSliceSelector);
  const { listOrderTracking } = useSelector(orderHistorySliceSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getListOrderTracking({ accountId: userInfo.id, pageIndex: 1, pageSize: 20 }));
    console.log(listOrderTracking, 'orderHistory');
  }, [isFocus]);
  return (
    <SafeAreaView edges={['bottom']} className="bg-gray-50 flex-1">
      <FlatList
        data={listOrderTracking ? listOrderTracking : emptyList}
        contentContainerStyle={{
          alignItems: 'center',
          marginTop: 50,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => <OrderTrackingItem item={item} />}
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

export default index;
