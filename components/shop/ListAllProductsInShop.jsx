import React, { useState } from 'react';
import { ActivityIndicator, Animated, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import usePagination from '../../custom-hook/usePagination';
import usePullToRefresh from '../../custom-hook/usePullToRefresh';
import { addMoreProductInShopDetails, dataShopDetailsSelector, getListAllProductsInShop } from '../../redux/slice/shopDetailsSlice';
import ItemAllProductInShop from './ItemAllProductInShop';
const INITIAL_PAGE = 0;
const ListAllProductsInShop = ({ data, shopId }) => {
  const {totalPage} = useSelector(dataShopDetailsSelector);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const { refreshing, onRefreshHandler } = usePullToRefresh({
    onRefreshFunction() {
      setCurrentPage(1)
      console.log('tgestsdfasdfasdfasdfasdf')
      dispatch(getListAllProductsInShop(shopId));
    },
  });
  console.log("data ", data)
  const { currentPage, handleEndReached, setCurrentPage} = usePagination({
    fetchFunction: () => {
      dispatch(addMoreProductInShopDetails(currentPage + 1));
      
    },
    setLoading:setLoading,
    totalPages: totalPage,
    initialPage: 1,
  });
  return (
    <Animated.FlatList
      data={data}
      nestedScrollEnabled={true}
      contentContainerStyle={{
        paddingHorizontal: 28,
        justifyContent: 'center',
        flex: 1,
        backfaceVisibility: 'black',
      }}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      numColumns={2}
      keyExtractor={(item) => {
        return item.id;
      }}
    
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      scrollEnabled={false}
      renderItem={({ item }) => <ItemAllProductInShop item={item} />}
      ListFooterComponent={isLoading ? <ActivityIndicator size="large" /> : null}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshHandler} />}
    />
  );
};

export default ListAllProductsInShop;
